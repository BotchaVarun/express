

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
app.get('/users/:fullname',bodyparser.json(),async(req,res)=>{
  try{
    const users=await User.find({fullname:req.params.fullname});
    if(!users)
    {
        return res.status(404).json({message:"user not found"});
    }
    res.status(200).json(users);
  }
  catch(err)
  {
    res.status(500).json({message:"error"});
  }
})
app.put('/users/:email', async (req, res) => {
    try {
        const userExists = await User.find({ fullname: req.params.email });
        if (!userExists) {
            return res.status(404).json({ message: "User not found" });
        }

        const updatedUser = await User.updateOne(
            { fullname: req.params.email },
            { $set: req.body }
        );

        if (updatedUser.modifiedCount === 0) {
            return res.status(400).json({ message: "No changes made" });
        }

        res.status(200).json({ message: "User updated successfully!" });
    } catch (err) {
        console.error("Error updating user:", err);
        res.status(500).json({ message: "Error updating user" });
    }
});



app.post('/add',bodyparser.json(),async( req,res)=>{
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

app.use(express.static(path.join(__dirname, 'public')));

// Redirect "/" to serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`meghana is good girl`);
}); 