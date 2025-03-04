import express from 'express';
const app = express();
import passport from "passport";
import mongoStore from "connect-mongo";
import LocalStrategy from "passport-local";
import passportLocalMongoose from "passport-local-mongoose";
import crypto from 'crypto';

import User from "../models/User.model.js";
import Vendor from "../models/Vendor.model.js";
import otpModel from "../models/Otp.Model.js";
import client from "../utils/twilioclient.js";
import EcoPoints from "../models/EcoPoints.model.js";

export const vendorSignup = async (req, res) => {
    try{
        const {username, password, vendorType, Name, organisation, contact, address, city, email} = req.body;

        if(!username || !password || !vendorType || !Name || !organisation || !contact || !address || !city || !email){
            return res.status(401).json({success:false, message:"Bad gateway, Please enter all the details!"});
        }
        const registerVendor = new Vendor({username, vendorType, Name, organisation, contact, address, city, email});
        const registeredVendor = await Vendor.register(registerVendor, password);
        console.log("Registered User:", registeredVendor);

        req.login(registeredVendor, async (err) => {
            if(err){
                console.error("Login error:", err);
                return res.status(500).json({success: false, message: "Error during login", error: err.message});
            }

            const vendor = await Vendor.findOne({username:username});
            const id = vendor._id;
            return res.status(200).json({success: true, data: {registeredVendor, id}});
        });

    }catch(e){
        return res.status(500).json({success:false, message:`Some error occurred on our side! It says ${e.message}`});
    }
}

export const vendorLogin = async (req, res, next) => {
    const {username, password} = req.body;

    if(!username || !password){
        return res.status(401).json({success:false, message:"Bad gateway! Enter all the fields"});
    }

    passport.authenticate("local", async (err, user, info) => {

        console.log("Passport Auth Error:", err);
        console.log("Passport Auth User:", user);
        console.log("Passport Info:", info);
        if (err) {
            // Handle error if there is any during authentication
            return res.status(500).json({ success: false, message: "Internal server error" });
        }

        if (!user) {
            // Handle invalid login (wrong credentials or user not found)
            return res.status(401).json({ success: false, message: "Invalid username or password" });
        }

        // If authentication is successful, log the user in and send the success response
        req.login(user, async (err) => {
            if (err) {
                // Handle error during session login
                return res.status(500).json({ success: false, message: "Could not establish session" });
            }

            // Authentication successful
            //redirect the home page or the required page here.
            const vendor = await Vendor.findOne({username:username});
            const id = vendor._id;
            return res.status(200).json({id});
        });
    })(req, res, next);
}

export const validateAndGenerateOtp = async(req, res) => {
    try {
        const {contact} = req.body;
        const checkPhone = await Vendor.findOne({contact:contact});
        if(!checkPhone){
            return res.status(404).json({
                success:false,
                message:"vendor not found"
            });
        }

        const Otp = crypto.randomInt(100000, 999999).toString(); //6 Digit Otp
        const expiry = new Date(Date.now() + 5 * 60 * 1000); //5 minutes expiry

        const otpRecord = new otpModel({contact, Otp, expiry});
        await otpRecord.save();

        //Send the Otp through twilio client
        const message = await client.messages.create({
            body: `Your OTP is ${Otp}. It is valid for 5 minutes.`,
            to: contact,     // Recipient's phone number
            from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio number
        });
        console.log("Message sent:", message.sid);


        //Render the otp form to submit the otp, instead of this;
        return res.status(200).json({success: true, message:`Your otp is sent successfully.`});
    }
    catch (error) {
        // console.error("Error sending OTP:", error);
        return res.status(400).json({success:false, message:`Something went wrong! ${error.message}`});
    }
};

export const changePassword = async (req, res, next) => {
    const {username, newPassword, confirmPassword} = req.body;

    try{
        console.log('Reached Change Password')
        const vendor = await Vendor.findOne({username: username});

        if(!vendor){
            return res.status(404).json({message:`Internal Server Error`});
        }

        if(newPassword !== confirmPassword){
            return res.status(400).json({message:`Bad Request, Enter the correct password in both fields, and try again!`});
        }

        await vendor.setPassword(newPassword);

        await vendor.save();

        req.login(user, async (err) => {
            if (err) {
                // Handle error during session login
                return res.status(500).json({ success: false, message: "Could not establish session" });
            }

            //Authentication successful
            //redirect the home page or the required page here.
            const vendor = await Vendor.findOne({username:username});
            const vendorId = vendor._id;
            return res.status(200).json({
                success: true,
                message: "Password reset successful. You are now logged in.",
                vendor: {
                    id: vendor._id,
                    username: vendor.username,
                },
            });
        });

    }catch(e){
        console.error(e.message);
    }
}

export const updateUserInfo = async (req, res) => {
    try{
        const {id} = req.params;

        const vendor = await Vendor.findById(id);
        if(!vendor) return res.status(404).json({success:false, message: "Vendor not found"});

        const updateVendorInfo = await Vendor.findByIdAndUpdate(
            id,
            { ...req.body },
            { new: true, runValidators: true }

        );
        console.log(updateVendorInfo);
        return res.status(200).json({updateVendorInfo});
    }
    catch(err){
        return res.status(500).json({success:false, message: err.message});
    }
}