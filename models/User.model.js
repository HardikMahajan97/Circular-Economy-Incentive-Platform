import mongoose from "mongoose";
const Schema = mongoose.Schema;
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new Schema({
    Name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    contact:{
        type:Number,
        required:true,
    },
    age:{
        type:Number,
        required:true,
    },
    location:{
        type:String,
        required:true,
    },
    address:{
        city:{
            type:String,
            required:true,
        },
        street:{
            type:String,
            required:true,
        },
        flatNumberOrBuildingName:{
            type:String,
            required:true,
        },
        landmark:{
            type:String,
        },
    },
    ecopointsId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"EcoPoints",
    }

});

userSchema.plugin(passportLocalMongoose, {
    usernameField : 'username',
    hashField:'hash',
    saltField:'salt'
});
const User = mongoose.model("User", userSchema);
export default User;