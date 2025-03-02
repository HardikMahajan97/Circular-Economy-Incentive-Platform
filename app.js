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

/****************File imports******************/
import User from "./models/User.model.js";
import userRoute from "./routes/user.route.js";


/****************Database connection*************************/
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
    await mongoose.connect(dbUrl);  
}

//************************************************************* */
let port = 5000;


app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));


//*****************************Configure sessions******************
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
//******************************************************************** */


//***************Passport Initialization****************
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//**************************************************** */

//************************** Routes ***************************/
app.listen(port, () => {
    console.log(`Listening on ${port}`);
});

app.get("/", (req, res) => {
    console.log("Hey! Welcome to Circular Economy Incentive Platform!");
    res.send("Hey! Welcome to Circular Economy Incentive Platform!");
});

app.use("/user", userRoute);

