const router = require('express').Router();
const User = require("../models/User")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const protect = require('../middleware/protect')

router.get('/',  async (req,res) => {
    try {
        const user = await User.find();
        if(user){
            res.status(200).json({
                success: true,
                data: user
            })
        }
    } catch (err) {
        return res.status(500).json({err: err.message});
    }
})

router.post('/register', async (req,res) => {
    try {
        const {name, email, password} = req.body;

        const hashPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            name: name, 
            email: email, 
            password: hashPassword
        });

        await newUser.save();

        sendTokenResponse(newUser, 200, res)

    } catch (err) {
        return res.status(500).json({err: err.message});
    }
})

router.post('/login', async (req,res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success: false,
                err: "Invalid Credentials"
            })
        }

        const matchPassword = await bcrypt.compare(password, user.password)
        if(!matchPassword){
            return res.status(401).json({
                success: false,
                err: "Invalid Credentials"
            })
        }else{
            sendTokenResponse(user, 200, res)
        }

    } catch (err) {
        return res.status(500).json({err: err.message});
    }
})

router.put('/logout', protect, async (req,res) => {
    try {
        res.cookie('token', 'none', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true
        })
        
        res.status(200).json({
            success: true,
            data: {}
        })
    } catch (err) {
        return res.status(500).json({err: err.message});
    }
})

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken()

    const options = {
        maxAge: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    if(process.env.NODE_ENV === 'production'){
        options.secure = true;
    }

    res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
        success: true,
        token,
        user
    })
}



module.exports = router;