import express from 'express';
const app = express();
const router = express.Router({mergeParams:true});

import {donateProducts} from "../controllers/activity.controller.js";

router
    .route("/donate/:vendorId")
    .post(donateProducts);


export default router;