const express = require('express');
const { userAuth } = require('../middlewares/auth');
const User = require('../models/user');
const { validateEditProfileData } = require('../utils/validation');

const profileRouter = express.Router();


profileRouter.get("/view", userAuth, async (req, res) => {

    const user = req.user;
    res.send(user);
    try {
        res.send("User profile successful")
    } catch (error) {
        res.status(500).send("Internal Server Error")
    }
})

profileRouter.patch("/edit", userAuth, async (req, res) => {
  
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("Invalid Edit request");
        }
        //auth middleware has attached the user with this
        const loggedInuser = req.user;
        // loggedInuser.firstName = req.body.firstName
        Object.keys(req.body).forEach((key)=>(
            loggedInuser[key] = req.body[key]
        ))
        // console.log(user);
        await loggedInuser.save();
        res.json({
            message : `${loggedInuser.firstName}, your Updation successful` ,
            data : loggedInuser
        })


    } catch (error) {
        res.status(400).send(`Error :  ${error.message}`)
    }


})

profileRouter.patch("/password" , (req,res)=>{
    //forgot password api 
    //first user should know that 
})

module.exports = profileRouter