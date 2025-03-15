import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const  Schema = mongoose.Schema;

const vendorSchema = new Schema({
    vendorType:{
        type:String,
        required:true,
    },
    Name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    organisation:{
        type:String,
        required:true,
    },
    contact:[
        {
            type:Number,
            required:true,
        },
    ],
    address:[
        {
            type:String,
            required:true,
        },
    ],
    city:[
        {
            type:String,
            required:true,
        },
    ],
    location:{
        type:String,
        required:true,
    },
});

vendorSchema.plugin(passportLocalMongoose, {
    usernameField : 'username',
    hashField:'hash',
    saltField:'salt'
});

const Vendor = mongoose.model("Vendor", vendorSchema);
export default Vendor;