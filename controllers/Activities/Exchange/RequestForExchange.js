import express from 'express';
const app = express();
import sendEmail from "../../../utils/sendEmail.js"
import User from "../../../models/User.model.js";
import Vendor from "../../../models/Vendor.model.js";
import Activity from "../../../models/activity.model.js";
import Product from "../../../models/Product.model.js";
import otpModel from "../../../models/Otp.model.js";
import client from "../../../utils/twilioclient.js";
import EcoPoints from "../../../models/EcoPoints.model.js";


export const RequestForExchange = async(req, res) => {
    try{
        const { userId, productId } = req.params;

        const user1 = await User.findById(userId);
        const product = await Product.findById(productId);
        if (!user1 || !product) {
            return res.status(404).json({ success: false, message: "Product or user not found!" });
        }

        const user2 = await User.findById(product.userId);
        if (!user2) {
            return res.status(404).json({ success: false, message: "Product owner not found!" });
        }

        // Check if product is available
        if (product.activityStatus !== "Available") {
            return res.status(400).json({ success: false, message: "Product is not available for exchange!" });
        }

        //fetching Payment mode from user
        const {paymentMode, activityType } = req.body;

        const user1Location = user1.location;
        const user2Location = user2.location;

        //Apply machine learning or location calculation algorithm here PLEASEEEEEEEEE.

        //When requester sends the request to his peer after seeing the product.
        const newActivity = new Activity({
            activityType:activityType,
            typeOfProduct:product.typeOfProduct,
            weightOfMaterial:prodcut.weightOfMaterial,
            productImage: product.productImage,
            userId: userId,
            productId: productId,
            senderId: user1._id,
            receiverId: user2._id,
        });

        // Send notification to peer
        const peerNotification = {
            title: "New Exchange Request",
            body: `${user1.name} wants to exchange your ${product.typeOfProduct}`,
            senderId: user1._id,
            receiverId: user2._id,
        };

        await sendEmailToUser(peerNotification);

        // Create activity
        await newActivity.save();

        // Update product status
        product.activityStatus = "Requested";
        await product.save();

        res.json({ success: true, message: "Request sent successfully!" });

    }catch(e){

    }
}