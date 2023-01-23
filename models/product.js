const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;


const productSchema = new mongoose.Schema(
    {
        name: {
            type:String,
            trim:true,
            required:true,
            maxlenght:160
        },
        slug:{
            type:String,
            lowercase:true
        },
        description:{
            type:{},
            required:true
        },
        price:{
            type:Number,
            trim:true,
            required:true
        },
        category:{
            type:ObjectId,
            ref:"Category",
            required:true
        },

        quantity:{
            type:Number
        },
        sold:{
            type:Number,
            default:0,
        },
        photo:{
            data:Buffer,
            contentType:String,
        },
        shiping:{
            required:false,
            type:Boolean
        },        
    },
    {timestamps:true, versionKey:false},
);

const Product = mongoose.model("Product",productSchema);
module.exports = Product;