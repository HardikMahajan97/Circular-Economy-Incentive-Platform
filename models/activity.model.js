import mongoose from "mongoose";
const Schema = mongoose.Schema;

import User from "./User.model.js";
import Vendor from "./Vendor.model.js";

const activitySchema = new Schema({
    typeOfMaterial : {
        type: String,
        required: true,
    },
    weightOfMaterial : {
        type:String,
        required:true,
    },
    quantity:{
        type:Number,
        required:true,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    vendorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Vendor",
        required:true,
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now
    },

});

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;


