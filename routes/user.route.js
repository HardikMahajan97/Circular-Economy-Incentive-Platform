import express from 'express';

const router = express.Router({mergeParams: true});
import {
    userSignup,
    userLogin,
    updateUserInfo,
    validateAndGenerateOtp,
    verifyOtp,
    changePassword
} from "../controllers/Customers/user.controller.js";

router
    .route("/signup")
    .post(userSignup);

router
    .route("/login")
    .post(userLogin);


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