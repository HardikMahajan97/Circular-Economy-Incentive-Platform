import express from 'express';
const app = express();
import sendEmail from "../../utils/sendEmail.js"
import User from "../../models/User.model.js";
import Vendor from "../../models/Vendor.model.js";
import Activity from "../../models/activity.model.js";
import Product from "../../models/Product.model.js";
import otpModel from "../../models/Otp.model.js";
import client from "../../utils/twilioclient.js";
import EcoPoints from "../../models/EcoPoints.model.js";

async function sendEmailToUsers(user1, user2, product){

}

export const exchangeProduct = async (req, res) => {
    try{
        const {userId, productId} = req.params;
        const user1 = await User.findById(userId);
        const product = await Product.findById(productId);
        if(!user1 || !product) return res.status(404).json({success:false,  message:"Product or user not found!"});

        const user2Id = product.userId;
        const user2 = await User.findById(user2Id);

        const email = await sendEmailToUsers(user1, user2, product);

        return res.status(200).json({success:true, message:"Go to the next step"});

    }catch(err){
        return res.status(500).json({success:false, message:`Some internal error occurred! It says: ${err.message}`});
    }
};