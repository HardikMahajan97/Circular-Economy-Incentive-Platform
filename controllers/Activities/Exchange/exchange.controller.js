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

async function sendEmailToUser(user1, user2, product) {
    const emailContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            h2 {
                color: #4CAF50;
            }
            p {
                font-size: 16px;
                color: #555555;
                line-height: 1.6;
            }
            .summary {
                background-color: #f9f9f9;
                padding: 10px;
                border-radius: 5px;
                margin-top: 15px;
            }
            .summary p {
                margin: 8px 0;
            }
            .btn {
                display: inline-block;
                background-color: #4CAF50;
                color: white;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 10px;
            }
            .btn:hover {
                background-color: #45a049;
            }
            .footer {
                margin-top: 20px;
                text-align: center;
                font-size: 14px;
                color: #777777;
            }
            .footer a {
                color: #4CAF50;
                text-decoration: none;
            }
        </style>
    </head>
    <body>

    <div class="container">
        <h2>Exchange Request Confirmation – Next Steps! 🔄</h2>

        <p>Dear <strong>${user1.name}</strong> and <strong>${user2.name}</strong>,</p>

        <p>We’re excited to inform you that the exchange request for <strong>"${product.name}"</strong> has been successfully initiated! 🎉</p>

        <div class="summary">
            <p><strong>🔄 Product:</strong> ${product.name}</p>
            <p><strong>📍 User 1 Location:</strong> ${user1.location}</p>
            <p><strong>📍 User 2 Location:</strong> ${user2.location}</p>
        </div>

        <h3>📦 Next Steps:</h3>
        <p>✅ <strong>Coordinate Exchange Location:</strong><br> We recommend connecting with each other to finalize a convenient exchange location.</p>
        <p>✅ <strong>Check Product Condition:</strong><br> Please ensure that the product is in the agreed-upon condition before completing the exchange.</p>
        <p>✅ <strong>Confirm Completion:</strong><br> Once the exchange is completed, kindly update the status in the app to mark the activity as <strong>Completed</strong>.</p>

        <p>🕒 <strong>Need Help?</strong><br> If you encounter any issues or have questions, feel free to contact our support team.</p>

        <a href="mailto:support@yourplatform.com" class="btn">Contact Support</a>

        <div class="footer">
            <p>Thank you for being a part of our eco-friendly community! 🌱</p>
            <p>💡 <strong>Pro Tip:</strong> Don’t forget to log your activity to earn eco-points and unlock exclusive rewards! 🎁</p>
            <p><a href="#">Visit Our Website</a> | 📞 +91-XXXXXXXXXX | 📧 <a href="mailto:support@yourplatform.com">support@yourplatform.com</a></p>
        </div>
    </div>

    </body>
    </html>
    `;

    const sendMailToUser = await sendEmail(
        user1.email,
        "Exchange Request Confirmation – Next Steps!",
        emailContent
    );

    return sendMailToUser;
}


export const exchangeProduct = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        // Fetch users and product
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


        // Create new exchange activity
        const newActivity = new Activity({
            typeOfProduct: product.typeOfProduct,
            weightOfMaterial: 2,
            quantity: product.quantity,
            activityType:"Exchange",
            images:product.images,
            userId: user1._id,
            vendorId: user2._id,
            productId: product._id,
            activityStatus: "Pending",
        });
        await newActivity.save();

        // Mark product as exchanged
        product.activityStatus = "Completed";
        await product.save();

        // Award eco-points for exchange
        // const impactMetrics = CalculateImpactMetric();

        // Send email to users
        const emailToUser1 = await sendEmailToUser(user1, user2, product);
        const emailToUser2 = await sendEmailToUser(user2, user1, product);
        if(!emailToUser1 || !emailToUser2) return res.status(500).json({
            success:false,
            message:"Internal Server Error! " +
                "There was a problem sending email to the user! Please try again, we are sorry for the inconvenience!"
        });

        return res.status(200).json({ success: true, message: "Exchange process initiated successfully!" });
    } catch (err) {
        return res.status(500).json({ success: false, message: `Internal error occurred: ${err.message}` });
    }
};
