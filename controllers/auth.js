const User = require("../models/user.js");
const{comparePassword, hashPassword} = require ("../helpers/auth.js");
const jwt  = require("jsonwebtoken");
const { use } = require("../routes/auth.js");
require("dotenv").config();
const {requireSign,isAdmin} = require("../middlewares/auth.js")



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

// Ekhen thake login function start hoice
exports. login =  async (req,res)=>{
    try {
        // email and password destructure korabo 
        const {email, password} = req.body;
        //email and password thik moto dilo kina cheak korbo
        if(!email){
            return res.json({error:"Please add email"});
        }
        if(!password || password.length < 6){
            return res.json({error:"password must be at last 6 character"});
        }
        //ei email diya age login kora ace naki cheak korbo
        const user = await User.findOne({email});
        if (!user){
            return res.json({error:"User alredy login"})
        }
        //compare password
        const match = await comparePassword(password,user.password);
        if(!match){
            return res.json({error:"Wrong password"});
        }
        // creat signed jwt
        const token = jwt.sign({_id:user._id}, process.env.JWT_SECRET ,{
            expiresIn: "7d",
        });
        //send response
        res.json({
            user: {
                name:user.name,
                email:user.email,
                role:user.role,
                address:user.address,
            },
            token,
        });  
       
    } catch (err) {
        console.log(err);
    }
};

//user authorized 
exports.requireSignin = async (req,res)=>{
    res.send({ok:"You are authorized"})
}
// user Admin  kina
    exports.isAdmin = async (req,res)=>{
        res.send({ok:"You are admin "})
    };


//user jodi ter kono  information update kora
exports.updateProfile = async (req,res)=>{
    try {
        const {name, password, address} = req.body;
        const user = await User.findById(req.user._id);

        //cheak password..
        if(password && password.length < 6){
            return res.json({ error:"password must 6 chratcers"});                           
        };

        //hash the password ...
        const hashPassword = password ? await hashPassword(password):undefined;

        const update = await User.findByIdAndUpdate(
            req.user._id,
            {
                name : name || user.name,
                password :hashPassword || user.password,
                address : address || user.address,
            },
            {new:true},
        );
        update.password = undefined;
        res.json(update);
    } catch (err) {
        console.log(err);
    }
}