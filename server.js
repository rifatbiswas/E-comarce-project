const {readdirSync} = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const helmet = require('helmet');
const mongoose = require('mongoose');
const morgan = require('morgan');
require("dotenv").config();
const cors = require('cors');
const { config } = require('dotenv');
const router=express.Router()



// Midlware.....
app.use(cors());
app.use(morgan());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(helmet());
app.use(morgan("dev"))

//Route midleware
readdirSync("./routes").map(r=>app.use("/api/v1",require(`./routes/${r}`)))



// server......
const port =process.env.PORT || 8000;

//Connect mongodb and satrt server

mongoose
    .set('strictQuery', false)
    .connect(process.env.DATABASE)    
    .then(()=>{
        app.listen(port,()=>{
            console.log(`Server Running on port ${port}`);
        });
    })
    .catch((err)=> console.log(err));