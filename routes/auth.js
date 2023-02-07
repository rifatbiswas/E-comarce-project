
const express = require('express')
const router = express.Router();

//middleware
const{requireSignin, isAdmin}=require ("../middlewares/auth.js");

//controller..
const{register, login, updateProfile}=require("../controllers/auth.js")



router.post("/register",register);
router.post("/login",login);
router.get("/auth-cheak", requireSignin, (req,res)=>{res.json({ok:"You are loging person"})});
router.get("/admin-cheak",requireSignin,isAdmin,(req,res)=>{res.json({ok:"You admin"})});
router.put("/updateProfile",requireSignin,updateProfile);


module.exports = router;