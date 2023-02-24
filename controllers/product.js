const Product = require("../models/product.js");// product Schema require frome models
const fs = require ("fs");
const slugify = require('slugify');
const braintree = require('braintree');
require("dotenv").config();


exports.create = async (req, res) => {
  try {
    console.log(req.fields); // fields for details writing
    console.log(req.files); // files for photo upload

    const {name, description, price, category, quantity, shiping } = req.fields;
    const {photo} = req.files;

    switch(true) {

        case !name.trim():
            return res.json({error:"Please add Nmae"});
        case !description.trim():
            return res.json({error:"Please add description"});
        case !price.trim():
            return res.json({error:"Please add Price"});
        case !category.trim():
            return res.json({error:"Please add categoyy"});
        case !quantity.trim():
            return res.json({error:"Pease add quantity"});
        case !shiping.trim():
            return res.json({error:"Please add shiping"});
        case !photo && photo.size > 1000000:
            return res.json({error:"Image should be less than 1MB in size"});    
    }

    // create product 
    const product = new Product({...req.fields, slug: slugify(name)});
    if(photo) {
        product.photo.data = fs.readFileSync(photo.path);
        product.photo.contentType = photo.type;
    }
    await product.save();
    res.json(product);
  } catch (err) {
    return res.status(400).json({error:"product create fail"})
  }
};

exports.list = async (req,res)=>{
    try {
        const product = await Product.find({})
        .populate("category")
        .select("-photo")
        .limit (12)
        .sort({ createAt: -1})

        res.json(product);
    } catch (error) {
        res.status(400).json({error:"Product list not found"});
    }
}

exports.read = async (req, res)=>{
    try {
        const product = await Product.findOne({ slug: req.params.slug })
        .select("-photo")
        .populate("category");

        res.json(product)
    } catch (err) {
       console.log(err);
    }
};

exports.photo = async (req,res)=>{
    try {
        const product = await Product.findById(req.params.productId).select("photo");
        console.log(product);
        if(product.photo.data){
            res.set("Content-Type", product.photo.contentType);
            return res.send(product.photo.data);
        }
    } catch (error) {
       res.status(400).json({error:"photo not found"}) 
    }
}

exports.remove = async (res,req)=>{
    try {
        const product = await Product.findByIdAndDelete(req.params.prodctId)
        .select("-photo")
        res.json(product)
    } catch (error) {
      res.status(400).json({error:"Remove Unsuccess"})  
    }
}

exports.update = async (req,res)=>{
    try {
        const {name, description, price, category, quantity, shiping} =req.fields;
        const{photo} = req.files;


        switch(true) {

            case !name.trim():
                return res.json({error:"Please add Nmae"});
            case !description.trim():
                return res.json({error:"Please add description"});
            case !price.trim():
                return res.json({error:"Please add Price"});
            case !category.trim():
                return res.json({error:"Please add categoyy"});
            case !quantity.trim():
                return res.json({error:"Pease add quantity"});
            case !shiping.trim():
                return res.json({error:"Please add shiping"});
            case !photo && photo.size > 1000000:
                return res.json({error:"Image should be less than 1MB in size"});    
        }

        //update product
        const product = await Product.findByIdAndUpdate(req.params.prodctId,{...req.fields, slug:slugify(name)}, {new:true});

        if(photo){
            product.photo.data =fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }
        await product.save();
        res.json(product);
          
    } catch (error) {
      res.status(400).json({error:"Update Unsuccess"})  
    }
};

exports.filteredProducts = async (req, res) => {
    try {
      const { checked, radio } = req.body;
      
      let args = {};
      if (checked.length > 0) args.category = checked
      if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
      console.log("args => ", args);
  
      const products = await Product.find(args);
      console.log("filtered products query => ", products.length);
      res.json(products);
    } catch (err) {
      console.log(err);
    }
  };
  
  exports.productsCount = async (req, res) => {
    try {
      const total = await Product.find({}).estimatedDocumentCount();
      res.json(total);
    } catch (err) {
      console.log(err);
    }
  };
  
  exports.listProducts = async (req, res) => {
    try {
      const perPage = 2;
      const page = req.params.page ? req.params.page : 1;
  
      const products = await Product.find({})
        .select("-photo")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ createdAt: -1 });
  
      res.json(products);
    } catch (err) {
      console.log(err);
    }
  };
  
  exports.productsSearch = async (req, res) => {
    try {
      const { keyword } = req.params;
      const results = await Product.find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } }        
        ],
      }).select("-photo");
  
      res.json(results);
    } catch (err) {
      console.log(err);
    }
  };
  
  exports.relatedProducts = async (req, res) => {
    try {
      const { productId, categoryId } = req.params;
      
      const related = await Product.find({
        category: categoryId,
        _id: { $ne: productId },
      })
        .select("-photo")
        .populate("category")
        .limit(3);
  
      res.json(related);
    } catch (err) {
      console.log(err);
    }
  };