import express from 'express';
const app = express();
import sendEmail from "../../utils/sendEmail.js"
import User from "../../models/User.model.js";
import Vendor from "../../models/Vendor.model.js";
import Activity from "../../models/activity.model.js";
import Product from "../../models/Product.model.js";
import otpModel from "../../models/Otp.model.js";
import client from "../../utils/twilioclient.js";

async function sendEmailToUser(user, product){
    const sendMail = await sendEmail(
        user.email,
        "Your product is now at our platform! 🥳",
        "",
        "<p>Hi "+user.name+",</p>\n" +
        "\n" +
        "<p>We sincerely appreciate you for taking the initiative to list your product on our circular economy platform! Your contribution helps build a more sustainable future by promoting reuse, recycling, and responsible consumption. 🌍</p>\n" +
        "\n" +
        "<p><strong>Here are your product details:</strong><br>\n" +
        "<strong>Name:</strong> "+product.productName+"<br>\n" +
        "<strong>Description:</strong> "+product.description+"<br>\n" +
        "<strong>Price:</strong> "+product.price+"<br>\n" +
        "<strong>Quantity:</strong> "+product.quantity+"</p>\n" +
        "\n" +
        "<p>Your listing is now live, and interested buyers can view and engage with it. You can manage or update your listing anytime through your account dashboard.</p>\n" +
        "\n" +
        "<p>Please check your product details and reach out to us in case of any problem.</p>"+ "\n" +
        "<p>Thank you for being an active part of our eco-conscious community. Every action you take makes a difference! 💚</p>\n" +
        "\n" +
        "<p>Best regards,<br>\n" +
        "<strong>The Circular Economy Incentive Platform Team</strong></p>\n"
    );
    return sendMail;
}

export const addProduct = async(req, res) => {
    try{
        const {userId} = req.params;

        const user = await User.findById(userId);
        if(!user) return res.status(404).json({
            success:false,
            message:"User not found!"
        });

        const {productName, description, images, price, quantity} = req.body;
        if(!productName || !description || !images || !price || !quantity) return res.status(404).json({
            success:false,
            message:"Product details are incomplete! Please enter all details."
        });

        const product = await new Product({productName, description, images, price, quantity, userId});
        if(!product) return res.status(401).json({message:"Error 401, Bad request Product not listed in server"});

        await sendEmailToUser(user, product);

        return res.status(200).json({success:true, message:"Product listed successfully! Here are your product details:", data:product});
    }catch(err){
        return res.status(500).json({success:false, message:"Internal Server error"});
    }
};