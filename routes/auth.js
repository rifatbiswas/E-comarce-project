
const express = require('express')
const router = express.Router();


//controllers....
const {
 register,
 login,
 requireSignin,
 isAdmin,
 updateProfile,
} = require("../controllers/auth.js");
const { requireSign } = require('../middlewares/auth.js');


router.post("/register",register);
router.post("/login",login);
router.get("/auth-cheak", requireSignin);
router.get("/admin-cheak",requireSignin, isAdmin);
router.put("/updateProfile",requireSign,updateProfile);


module.exports = router;