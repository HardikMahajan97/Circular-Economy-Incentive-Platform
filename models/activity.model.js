import mongoose from "mongoose";
const Schema = mongoose.Schema;

const activitySchema = new Schema({
    activityType: {
        type: String,
        enum: ["Recycle", "Exchange", "Donation", "Buy", "Sell"],
        required: true,
    },
    typeOfProduct: {
        type: String,
        required: true,
    },
    weightOfMaterial: {
        type: Number,
    },
    quantity: {
        type: Number,
        required: true,
    },
    images: [
        {
            type: String,
            required: true,
            default: "https://images.pexels.com/photos/279906/pexels-photo-279906.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        },
    ],
    paymentMode: {
        type: String,
        enum: ["online", "offline"],
        required: true,
        default: "offline",
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },
    activityStatus: {
        type: String,
        enum: ["Pending", "Completed", "Cancelled"],
        default: "Pending",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Activity = mongoose.model("Activity", activitySchema);
export default Activity;
