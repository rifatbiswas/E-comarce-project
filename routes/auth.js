
const express = require('express')
const router = express.Router();


//controllers....
const controler= require("../controllers/auth.js");
const midll = require('../middlewares/auth.js');


router.post("/register",controler.register);
router.post("/login",controler.login);
router.get("/auth-cheak", controler.requireSignin);
router.get("/admin-cheak",midll.requireSign, controler.isAdmin);
router.put("/updateProfile",midll.requireSign,controler.updateProfile);


module.exports = router;