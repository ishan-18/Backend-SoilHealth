const mongoose = require('mongoose'); 
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        trim: true,
        minLength: [2, "Please Enter atleast 2 characters"],
        maxLength: [50, "Please Enter atmost 50 characters"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: [true, "User Already Exists"],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please Enter a valid Email"]
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    }
}, {
    timestamps: true
})

UserSchema.methods.getSignedJwtToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

module.exports = mongoose.model("User", UserSchema)