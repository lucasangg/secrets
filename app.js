//jshint esversion:6
//first method of security is just checkin if username and password are correct
//  storing passwords in plain text
//second method involved encrypting the db (database encryption)
//third method will cover environment variables (hashing passwords)

//for environment variables. Should be on top
//also need to create a .env file
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser")
const ejs = require("ejs");
const mongoose = require("mongoose")
//for encrypting the db
const encrypt = require("mongoose-encryption")

const app = express()

app.use(express.static("public"))
app.set("view engine", "ejs")
mongoose.set('strictQuery', false);
app.use(bodyParser.urlencoded({
    extended:true
}))

mongoose.connect("mongodb://127.0.0.1:27017/userDB", { useNewUrlParser: true })

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
})

const secret = process.env.SECRET
//only encrypt password
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema)

app.get("/", function name(req, res) {
    res.render("home")
})

app.get("/login", function name(req, res) {
    res.render("login")
})

app.post("/login", function name(req, res) {
    const username = req.body.username
    const password = req.body.password

    User.findOne({email: username}, function name(err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundUser);
            if(foundUser) {
                if(foundUser.password === password){
                    res.render("secrets")
                }
                else (
                    res.send("wrong password")
                )
            }
        }
    })
})

app.get("/register", function name(req, res) {
    res.render("register")
})

app.post("/register", function name(req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })

    newUser.save(function name(err) {
        if (err) {
            console.log(err);
        } else {
            res.render("secrets")
        }
    })
})

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000
}

app.listen(port, function () {
    console.log("Server started on port 3000");
});
