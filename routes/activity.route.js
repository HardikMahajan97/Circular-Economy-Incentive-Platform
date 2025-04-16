import express from 'express';
const app = express();
const router = express.Router({mergeParams:true});

import {donateProducts} from "../controllers/Activities/dontate.controller.js";
import {recycleProduct} from "../controllers/Activities/recycle.controller.js";
import {addProduct} from "../controllers/Activities/addProduct.controller.js";
import {getAllProducts} from "../controllers/Activities/getAllProduct.controller.js";
import {exchangeProduct} from "../controllers/Activities/Exchange/exchange.controller.js";

router
    .route("/donate/:vendorId")
    .post(donateProducts);

router
    .route("/recycle/:vendorId")
    .post(recycleProduct);

router
    .route("/add-product")
    .post(addProduct);

router
    .route("/get-all-products")
    .get(getAllProducts);

router
    .route("/exchange-product/:productId")
    .post(exchangeProduct)

export default router;