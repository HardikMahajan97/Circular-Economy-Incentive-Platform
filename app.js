import express from 'express';
const app = express();
import mongoose from "mongoose";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import mongoStore from "connect-mongo";
import LocalStrategy from "passport-local";
import passportLocalMongoose from "passport-local-mongoose";
import cors from 'cors';
dotenv.config();

/*********************** File imports ************************/
import User from "./models/User.model.js";
import Vendor from "./models/Vendor.model.js";
import userRoute from "./routes/user.route.js";
import activityRoutes from "./routes/activity.route.js";
import vendorRoutes from "./routes/vendor.route.js";
import sendEmail from "./utils/sendEmail.js";

/**************** Database connection ************************/
const dbUrl = process.env.MONGO_URI || 5000;

// console.log(dbUrl);
main() 
    .then(() =>{
        console.log("Connected to CEP DATABASE!");  
    })
    .catch((err) => {
        console.log(err);
    });
async function main() {

    try{
        await mongoose.connect(dbUrl);
    }
    catch(err){
        console.log(`Your error is due to database connection failure: ${err}`);
    }
}

//********************************************************** */
let port = 5000;

app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

//************************* Configure sessions *****************
const store = mongoStore.create({
    mongoUrl : dbUrl,
    crypto: {
        secret : process.env.SESSION_KEY,
    },
    touchAfter : 24 * 3600,  // It is nothing but updating itself after how many time if session is not updated or database has not interacted with the server.
});
store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", err);
});
app.use(
    session({
        store,
        secret: process.env.SESSION_KEY,
        resave: false,
        saveUninitialized: true,
        cookie:{        //Cookie expiry date is the deletion of the data stored. For eg. github login: Asks every one week to login again.
            expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // There default expiry is one week and hence deletes the cookie with the login credentials.
            maxAge : 7 * 24 * 60 * 60 * 1000,
            httpOnly:true, // Only for security purposes.
        },
    })
);

//************** Passport Initialization **********************
app.use(passport.initialize());
app.use(passport.session());

passport.use("user-local", new LocalStrategy(User.authenticate()));

passport.use("vendor-local", new LocalStrategy(Vendor.authenticate()));

passport.serializeUser((entity, done) => {
    done(null, { id: entity.id, type: entity.constructor.modelName });
});

passport.deserializeUser((obj, done) => {
    const Model = obj.type === "User" ? User : Vendor;
    Model.findById(obj.id)
        .then(user => done(null, user))
        .catch(err => done(err));
});

//*********************************************************** */

//************************** Routes ***************************/
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

app.get("/", (req, res) => {
    console.log("Hey! Welcome to Circular Economy Incentive Platform!");
    res.send("Hey! Welcome to Circular Economy Incentive Platform!");
});

app.use("/user", userRoute);

app.use("/activity/:userId", activityRoutes);

app.use("/vendor", vendorRoutes);

// app.get("/send-email", async (req, res) => {

//     try{
//         const mail = await sendEmail(
//             "hardikmahajan97@gmail.com",
//             "Testing out",
//             "Test text for email"
//         );
//         return res.status(200).json({message:"Just check your mail"});
//     }catch(e){
//         return res.status(500).json({message:`Obviously some error. it says: ${err.message}`});
//     }

// });

app.all("*", (req,res,next) => {
    return res.status(401).send("Bad request the page does not exist!");
});

