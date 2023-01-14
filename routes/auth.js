
const express = require('express')
const router = express.Router();

router.post("/",(req,res)=>{
//res.send("ami valo aci")
res.status(200).json({status:"success"})
console.log("route found");
})


module.exports = router;