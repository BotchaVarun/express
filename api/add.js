

const express = require("express");
const mongoose = require("mongoose");
const cors=require("cors");
const path = require("path");
const bodyparser=require('body-parser');

const app = express();
const port=process.env.PORT||8080;


app.use(cors());
require('dotenv').config();

const URL = process.env.MONGO_URI;

mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB Atlas successfully!');
})
.catch((err) => {
    console.error('MongoDB connection error:', err);
});

const userSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});
const User = mongoose.model("user", userSchema);
app.post('/api/add',bodyparser.json(),async( req,res)=>{
 try{
    console.log(req.body.fullname);
    const {fullname,email,password}=req.body;
    const newUser= new User({fullname,email,password});
    await newUser.save();
    res.status(201).json({message:'User registered'});
 }
 catch(err)
 {
    res.status(500).json({message:'error in registering'});
 }
});