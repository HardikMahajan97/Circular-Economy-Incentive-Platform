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
        type:Number,
        required:true,
    },
    quantity:{
        type:Number,
        required:true,
    },
    images:[
        {
            type:String,
            required:true,
            default:"https://images.pexels.com/photos/279906/pexels-photo-279906.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        },
    ],
    paymentMode:{
        type:String,
        enum:["online", "Online", "Offline", "offline"],
        required:true,
        default:"offline",
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
    },
    createdAt:{
        type:Date,
        default:Date.now
    },

});

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;


