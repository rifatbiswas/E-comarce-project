const Category = require("../models/category.js");//model take Schema niya asce
const slugify = require('slugify');
const router = require("../routes/cetagory.js");//routes thake url 


exports.create = async (req,res) =>{
    try {
        const {name} = req.body;
        if(!name.trim()){
            return res.json({error:"Please add name"});
        };

  const existingCategory = await Category.findOne({name});
        if(existingCategory) {
            return res.json({error:"Aleady exists"});
        }

        const category = await new Category ({name, slug:slugify(name)}).save();
        res.json(category);
    } catch (err) {
        return res.status(400).json({error:"Error"})
    }
};

exports.update = async(req,res)=>{
    try {
        const {name} = req.body;
    const {categoryId} = req.params;
    const category = await Category.findByIdAndUpdate(
        categoryId,
        {
            name,
            slug: slugify(name)
    },
    {new:true}
    );
    res.json(category);
    } catch (err) {
        console.log(err);
        res.status(400).json({err:"Cetagory not found"});
    }
};

exports.remove = async(req,res)=>{
    try {
        const removed = await Category.findByIdAndDelete(req.params.categoryId);
    res.json(removed)

    } catch (err) {
        console.log(err);
        res.status(400).json({Error:"Delet Unsuccess"})
    }
};

exports.list = async (req,res)=>{
    try {
        const all = await Category.find({})
        res.json(all);
    } catch (err) {
        console.log(err);
        res.status(400).json({Error:" Not findCatagory"})
    }
};

exports.read = async (req,res)=>{
    try {
        const category = await Category.findOne({slug: req.params.slug});
        res.json(category);
    } catch (error) {
        console.log(err);
        res.status(400).json({Error:"Category name is not found"})
    };
};