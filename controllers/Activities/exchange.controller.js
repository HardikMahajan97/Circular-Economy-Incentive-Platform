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


export const exchangeProduct = async (req, res) => {
    try{
        const {userId, vendorId, productId} = req.params;

    }catch(err){
        return res.status(500).json({success:false, message:`Some internal error occurred! It says: ${err.message}`});
    }
}