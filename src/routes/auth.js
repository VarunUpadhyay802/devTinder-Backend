const express = require('express');
const { validateSignUpData } = require('../utils/validation');
const User = require('../models/user');
const bcrypt = require('bcrypt')
const authRouter = express.Router();
const jwt = require('jsonwebtoken')
const validator = require('validator')
authRouter.post('/signup', async (req,res) => {
    try {
        //validation of data
        validateSignUpData(req);

        const { firstName, lastName, emailId, password } = req.body;

        //encrypting the password
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName, lastName, emailId, password: passwordHash,

        });
        //always validate inside try catch , because if something fails your code will not be broken
        console.log(user)
        const data = await user.save();
        res.json({
            message : "User added successfully",
            data : data 
        })
      

    } catch (err) {
        res.status(400).send("Error signing up  the user:" + err.message)
    }
})


authRouter.post("/login", async (req, res) => {

    try {
        const { emailId, password } = req.body;
        //email sanitization 
        if (!validator.isEmail(emailId)) {
            throw new Error("not a chance")
        }
        const user = await User.findOne({
            emailId: emailId
        })
        if (!user) {
            throw new Error("Invalid credentials")
        }
        //comparing the password and password store in db 
        const isPasswordValid = await bcrypt.compare(password, user?.password);
        if (isPasswordValid) {
            //create a JWT token
            //information to hide is user id and secret key is devtinder one
            const token =  jwt.sign({ _id: user._id }, "devTinder192");
            console.log(token);
            res.cookie("token", token,{
                expires : new Date (Date.now() + 8*3600000)
            })
            res.json({
                messsage : "Login successful",
                data : user
            })
         
        } else {
            res.status(401).send("Details Invalid")
        }

    } catch (error) {
        res.status(400).send("Error signing up  the user:" + error);
    }

})


//setting the token to null 
authRouter.post("/logout",async (req,res)=>{
    res.cookie("token", null,{
        expires : new Date (Date.now())
    }) 
    res.status(200).send("User succesfully Logged out ")
})



module.exports = authRouter;