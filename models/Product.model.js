import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const productSchema = new Schema({
    Name:{
        type:String,
        required:true,
    },
    typeOfProduct:{
        type:String,
        required:true,
    },
    weightOfMaterial:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    images:[
        {
            type:String,
            required:true,
            default:"https://images.pexels.com/photos/279906/pexels-photo-279906.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        },
    ],
    price:{
        type:Number,
        required:true,
        default:0,
        min:0,
    },
    activityStatus: {
        type: String,
        enum: ["Available", "Pending", "Completed", "Unavailable"],
        default: "Available",
    },
    quantity:{
        type:Number,
        required:true,
        default:1
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },

});

const Product = mongoose.model("Product", productSchema);
export default Product;