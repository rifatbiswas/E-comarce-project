const express = require("express");

const router = express.Router();

// middleware ..
const {requireSign, isAdmin } = require ("../middlewares/auth.js");

//controller..
const {create,update,remove,list,read} = require ("../controllers/category.js");


//route
router.post("/category", requireSign, isAdmin, create);
router.put("/category/:categoryId", requireSign, isAdmin, update);
router.delete("/category/:categoryId", requireSign, isAdmin, remove);
router.get("/categories", list);
router.get("/category/:slug", read)



module.exports =router;