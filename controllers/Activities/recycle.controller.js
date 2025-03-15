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

async function sendEmailToUserAndVendor(user, vendor, typeOfMaterial, quantity, vendorlocation){

    const userEmail = user.email;
    const vendorEmail = vendor.email;

    const userMail = await sendEmail(
        userEmail,
        "Your Recycling Was a Success! 🌍♻️",
        "",
        "<p>Dear " + user.Name + ",</p>" +
        "<p>Great news! Your recycling has been successfully processed! 🌟</p>" +
        "<p>By recycling with us, you're making a real impact in reducing waste and promoting a healthier planet. Your effort supports the circular economy, prevents landfill overflow, and inspires others to take meaningful action.</p>" +
        "<p><strong>Here's what you achieved:</strong></p>" +
        "<ul>" +
        "<li>Reduced waste and contributed to a greener future</li>" +
        "<li>Earned [Eco Points] to track your sustainability journey</li>" +
        "<li>Inspired your community to adopt responsible recycling habits</li>" +
        "</ul>" +
        "<p>Here is the location of the centre: ${vendorlocation}</p> \n"+
        "<p>You can connect with the recycling centre through email or contact\n</p>"+
        "<p><strong>Email:</strong>"+ vendorEmail + ". </p>"+
        "<p><strong>Contact:</strong>" +  vendor.contact + " . </p>"+
        "<p>Check your <strong>leaderboard ranking</strong> and see how you're making a difference! 🎉</p>" +
        "<p>Thank you for being a sustainability champion! Together, we are building a waste-free world. 🌱♻️</p>" +
        "<p><strong>With gratitude,</strong><br>" +
        "<strong>Circular Economy Incentive Platform Team 💚</strong></p>" +
        "<p>🚀 <strong>Keep the impact going!</strong> Share your achievement on social media and inspire others to join the movement. #RecycleForGood #SustainableFuture</p>"
    );


    const vendorMail = await sendEmail(
        vendorEmail,
        "You’ve Received a Recycling Contribution! 🎉",
        "",
        "<p>Dear " + vendor.Name + ",</p>" +
        "<p>Exciting news! A responsible recycler has just contributed to your center through our platform. 🎉</p>" +
        "<p><strong>Recycling Details:</strong></p>" +
        "<ul>" +
        "<li><strong>Recycler Name:</strong> " + user.Name + "</li>" +
        "<li><strong>Material Type:</strong> " + typeOfMaterial + "</li>" +
        "<li><strong>Quantity:</strong> [" + quantity + "]</li>" +
        "<li><strong>Pick-up/Drop-off Details:</strong> [Scheduled Date & Time]</li>" +
        "</ul>" +
        "<p>Your commitment to sustainable waste management and circular economy principles is invaluable. This contribution helps reduce landfill waste and maximizes resource reuse.</p>" +
        "<p>📢 <strong>Next Steps:</strong> Please connect with the recycler if necessary to coordinate collection.</p>" +
        "<p>Thank you for being a crucial part of this sustainability movement! Your efforts are driving real change. 🌱♻️</p>" +
        "<p><strong>Best regards,</strong><br>" +
        "<strong>Circular Economy Incentive Platform Team 💚</strong></p>" +
        "<p>📢 <strong>Spread the word!</strong> Share your impact and encourage more recycling contributions. #CircularEconomy #RecycleResponsibly</p>"
    );

    return {userMail, vendorMail};
}

export const recycleProduct = async(req, res) => {
    try {

        const {userId, vendorId} = req.params;

        const user = await User.findById(userId);
        const vendor = await Vendor.findById(vendorId);
        const vendorlocation = vendor.location;

        if (!user || !vendor) return res.status(404).json({
            success: false,
            message: "Error 404! Either User or Vendor was not found!"
        });

        const {weightOfMaterial, typeOfMaterial, quantity, images} = req.body;

        if (!weightOfMaterial || !typeOfMaterial || !quantity || !images) return res.status(401).json({
            success: false,
            message: "Bad Gateway! Activity details were not provided, Please enter all of them correctly."
        });

        const activity = new Activity({weightOfMaterial, typeOfMaterial, quantity, images, userId, vendorId});
        await activity.save();

        const email = await sendEmailToUserAndVendor(user, vendor, typeOfMaterial, quantity, vendorlocation);
        console.log(`Email object : ${email}`);
        if (!email) return res.status(500).json({
            success: false,
            message: "Internal Server Error! " +
                "There was a problem sending email to the user! Please try again, we are sorry for the inconvenience!"
        });

        // const impactMetrics = CalculateEcoPoints(weightOfMaterial, typeOfMaterial, quantity);

        return res.status(200).json({
            success: true,
            message: "Congratulations!🎉 You have completed the recycling process successfully. You may have been received an email regarding the same.",
            data: {activity, vendorlocation},
            // data:{impactMetrics}
        });
    }catch(err){
        return res.status(500).json({message:`Some internal error occurred! It says: ${err.message}`});
    }
}