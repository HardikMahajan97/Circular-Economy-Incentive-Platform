import express from 'express';
const app = express();
const router = express.Router({mergeParams:true});

import {donateProducts} from "../controllers/Activities/dontate.controller.js";
import {recycleProduct} from "../controllers/Activities/recycle.controller.js";
import {addProduct} from "../controllers/Activities/addProduct.controller.js";

router
    .route("/donate/:vendorId")
    .post(donateProducts);

router
    .route("/recycle/:vendorId")
    .post(recycleProduct);

router
    .route("/add-product")
    .post(addProduct);

export default router;