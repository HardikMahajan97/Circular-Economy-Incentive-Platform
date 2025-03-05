import express from 'express';
const app = express();
import sendEmail from "../utils/sendEmail.js"
import User from "../models/User.model.js";
import Vendor from "../models/Vendor.model.js";
import Activity from "../models/activity.model.js";
import Product from "../models/product.model.js";
import otpModel from "../models/Otp.Model.js";
import client from "../utils/twilioclient.js";
import EcoPoints from "../models/EcoPoints.model.js";



async function sendEmailToUserAndVendor(user, vendor, typeOfMaterial, quantity){

    const userEmail = user.email;
    const vendorEmail = vendor.email;

    const userMail = await sendEmail(
        userEmail,
        'Donation Success, Thank You for a contributing in a healthier planet!',
        `<p>Dear ${user.Name},\n` +
            '\n' +
            'We are thrilled to inform you that your donation has been successfully processed! 🌟 Your generosity is making a real impact in building a more sustainable, waste-free world.\n' +
            '\n' +
            'By contributing, you are not only supporting the circular economy but also inspiring others to take meaningful action. Your donation helps reduce waste, empower communities, and create a greener future for everyone.\n' +
            '\n' +
            'As a token of appreciation, you have earned [Eco Points] towards your sustainability journey! Keep making a difference, and don’t forget to check your impact on the leaderboard.\n' +
            '\n' +
            'Thank you for being a changemaker! 🌱♻️ Together, we can make sustainability the norm.\n' +
            '\n' +
            'With gratitude,\n' +
            'Circular Economy Incentive Platform Team 💚\n' +
            '\n' +
            '🚀 Keep the momentum going! Share your donation on social media and inspire others to join the movement. #SustainableFuture #CircularEconomy' +
            '</p>'
    );

    const vendorMail = await sendEmail(
        vendorEmail,
        'You have received donation! 🎉',
        '<p>\n' +
            `Dear ${vendor.Name} \n` +
            '\n' +
            `Great news! A generous donor, has just contributed to your donation center through our platform. 🎉\n` +
            '\n' +
            'Donation Details:\n' +
            '\n' +
            `Donor Name: ${user.Name} \n` +
            `Donation Type: ${typeOfMaterial} \n` +
            `Quantity: [${quantity}] \n` +
            'Pick up/Drop-off Details (if applicable): [Scheduled Date & Time]\n' +
            'This donation helps advance the circular economy by reducing waste and supporting those in need. Please connect with the donor if necessary to coordinate the collection.\n' +
            '\n' +
            'Thank you for being a vital part of this movement! Your efforts in driving sustainability and community support are truly making a difference. 🌱♻️\n' +
            '\n' +
            'Best regards,\n' +
            'Circular Economy Incentive Platform Team 💚\n' +
            '\n' +
            '📢 Let’s spread the impact! Feel free to share this success and encourage more donations. #CircularEconomy #DonateForGood\n' +
            '\n' +
            '\n' +
            '\n</p>'
    );

    return {userMail, vendorMail};
}

// function CalculateEcoPoints(weightOfMaterial, typeOfMaterial, quantity){
//
// }

export const donateProducts = async (req, res) => {
    try{
        const {userId, vendorId} = req.params;

        const user = await User.findById(userId);
        const vendor = await Vendor.findById(vendorId);
        // const product = await Product.findById(productId);

        if(!user || !vendor) return res.status(404).json({
            success:false,
            message:"Error 404! Either User or Vendor was not found!"
        });

        const {weightOfMaterial, typeOfMaterial, quantity} = req.body;

        if(!weightOfMaterial || !typeOfMaterial || !quantity) return res.status(401).json({
            success:false,
            message:"Bad Gateway! Activity details were not provided, Please enter all of them correctly."
        });

        //Check whether the quantity is valid or the activity on that product is already performed or not;
        // if(product.isActivityDone || product.quantity < quantity){
        //     return res.status(401).json({
        //         success:false,
        //         message:"Your product's activity is already completed, or you are demanding more quantity than the stock!"
        //     });
        // }
        // //update the quantity of the product in database.
        // const updatedQuantity = product.quantity - quantity;
        // const updatedProduct = await Product.findByIdAndUpdate(
        //     productId,
        //     {quantity:updatedQuantity},
        //     { new: true, runValidators: true }
        // );,

        //Save the activity details in the database
        const activity = new Activity({weightOfMaterial, typeOfMaterial, quantity, userId, vendorId});
        await activity.save();

        const email = await sendEmailToUserAndVendor(user, vendor, typeOfMaterial, quantity);

        if(!email) return res.status(500).json({
            success:false,
            message:"Internal Server Error! There was a problem sending email to the user! Please try again, we are sorry for the inconvenience!"
        });

        // const impactMetrics = CalculateEcoPoints(weightOfMaterial, typeOfMaterial, quantity);

        return res.status(200).json({
            success:true,
            message:"Congratulations!🎉 You have made your donation successfully. You may have been received an email regarding the same.",
            // data:{impactMetrics}
        });

    }catch(err){
        return res.status(500).json({success:false, message:`Internal Error occurred! It says: ${err.message}!`});
    }
}
