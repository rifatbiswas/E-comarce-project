const express = require('express');
const router = express.Router();
const formidabel = require('express-formidable');

//middleware..
const{requireSign, isAdmin} = require("../middlewares/auth.js");


//controler
const{ create} = require("../controllers/product.js");



//all routes..

router.get("/product", requireSign, isAdmin, formidabel(), create);


module.exports = router;