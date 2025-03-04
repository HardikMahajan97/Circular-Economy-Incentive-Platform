import express from 'express';
const app = express();
const router = express.Router({mergeParams:true});

import {vendorSignup, vendorLogin, changePassword, updateUserInfo, validateAndGenerateOtp,} from "../controllers/vendor.controller.js";
import {verifyOtp} from "../controllers/user.controller.js";

router
    .route("/signup")
    .post(vendorSignup);

router
    .route("/login")
    .post(vendorLogin);

router
    .route("/update/:id")
    .post(updateUserInfo)

router
    .route("/forgotPassword")
    .post(validateAndGenerateOtp)

router
    .route("/verify")
    .post(verifyOtp)
router
    .route("/changePassword")
    .post(changePassword);


export default router;