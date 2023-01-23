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