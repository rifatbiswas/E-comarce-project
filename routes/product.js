const express = require('express');
const router = express.Router();
const formidabel = require('express-formidable');

//middleware..
const{requireSign, isAdmin} = require("../middlewares/auth.js");


//controler
const{ create, list} = require("../controllers/product.js");



//all routes..

router.post("/product", requireSign, isAdmin, formidabel(), create);
router.get("/product", list)


module.exports = router;