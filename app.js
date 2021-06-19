//jshint esversion:6
const express = require("express");
require('dotenv').config()
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongooseEncryption = require("mongoose-encryption")
const mongoose = require("mongoose");
const app = express();
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'));
app.set('view engine', 'ejs')

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({email:String, password:String});

const secret = process.env.PASS;
userSchema.plugin(mongooseEncryption, {secret:secret, encryptedFields:['password']});

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("home");
})

app.get("/login", function(req,res){

    res.render("login")
})

app.get("/register", function(req,res){

    res.render("register")
})

app.post("/register", function(req, res){

    const user = new User({email:req.body.username, password:req.body.password})
    user.save(function(err){

        if(!err){
            res.render("secrets")
        } else{
            res.render("register")
        }
    })
})

app.post("/login", function(req, res){

    User.findOne({email:req.body.username}, function(err, found){

        if (err){
        console.log(err)   
     } else{

        if(found){

            if (found.password===req.body.password){
                res.render("secrets")
            }

        } 
            
        }
    })
})

app.get("/logout", function(req, res){

    res.render("login")
})


app.listen(3000);