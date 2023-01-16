const User = require("../models/user.js");
const{comparePassword, hashPassword} = require ("../helpers/auth.js");
const jwt  = require("jsonwebtoken");
require("dotenv").config();




exports.register = async (req,res)=>{
    try {
        //model thake destructering kora nialm
        const { name, email, password} = req.body;

        //user sobkicu thik na dile return kora dibo
        if(!name.trim()){
            return res.json({error:"Name is Required"});
        }
        if(!email){
            return res.json({error:"Email is Require"});
        }
        if(!password || password.length < 6){
            return res.json({error:"Password is Required & Length must be 6 character"});
        }

        // Jodi ei email a allredy register thake tahole return kora dibo
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.json({error:"This email is allready taken"})
        }
        
    //hash password ta niya asbo  helper thake
       const hashedPassword = await hashPassword(password);

       //user register korbo
       const user = await new User({
        name,
        email,
        password: hashedPassword,
       }).save();

       //creat JWT singed 
       const token = jwt.sign({_id:user._id}, process.env.JWT_SECRET,{
        expiresIn : "7d",
       });
       // aber amra respond sent korbo..
       res.json ({
        user:{ 
        name : user.name,
        email: user.email,
        role: user.role,
        address: user.address,
       },
       token,
       });

    } catch (err) {
      console.log(err);  
    }
};