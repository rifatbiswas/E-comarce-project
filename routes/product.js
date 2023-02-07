const express = require('express');
const router = express.Router();
const formidabel = require('express-formidable');

//middleware..
const{requireSignin, isAdmin} = require("../middlewares/auth.js");


//controler
const{ create, list, read, photo, remove, update} = require("../controllers/product.js");


//all routes..

router.post("/product", requireSignin, isAdmin, formidabel(), create);
router.get("/product", list)
router.get("/product/:slug", read);
router.get("/product/photo/:productId", photo);
router.delete("/product/:productId", requireSignin, isAdmin, remove);
router.put("/product/:productId", requireSignin, isAdmin, formidabel(), update);


module.exports = router;