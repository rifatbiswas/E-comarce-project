const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

exports.requireSign = (req,res,next) =>{
    try {
       const decoded = jwt.verify(
        req.headers.token,
        process.env.JWT_SECRET
       );
       req.user = decoded;
       console.log("decoded");
       next(); 
    } catch (err) {
        return res.status(404).json(err);
    }
};

exports.isAdmin = async (req, res, next)=>{
    try {
       const user = await User.findById(req.user._id);
       if(user.role != 1){
        return res.status(404).json({error:"Middleware Unauthirized"})
       } else{   
        next();
       }
    } catch (err) {
        console.log(err);
    }
};