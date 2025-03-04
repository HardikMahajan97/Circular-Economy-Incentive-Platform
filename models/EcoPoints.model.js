import mongoose from "mongoose";
import User from "./User.model.js";
const Schema = mongoose.Schema;

const rewardDataSchema = new Schema({
    points:{
        type:Number,
        required:true,
        default:0,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
});

const EcoPoints = mongoose.model("EcoPoints", rewardDataSchema);

export default EcoPoints;