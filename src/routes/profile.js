const express = require('express');
const { userAuth } = require('../middlewares/auth');
const User = require('../models/user');
const { validateEditProfileData } = require('../utils/validation');
const validator = require('validator')
const profileRouter = express.Router();
const bcrypt = require('bcrypt')

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
        Object.keys(req.body).forEach((key) => (
            loggedInuser[key] = req.body[key]
        ))
        // console.log(user);
        await loggedInuser.save();
        res.json({
            message: `${loggedInuser.firstName}, your Updation successful`,
            data: loggedInuser
        })


    } catch (error) {
        res.status(400).send(`Error :  ${error.message}`)
    }


})

profileRouter.patch("/password", userAuth, async (req, res) => {
    //forgot password api 
    //first user should be logged in 
    //logged in user password update to the req.body.password

    try {
        // if (!validator.isPassword(loggedInuser.password)) {
        //     throw new Error("Password is not strong enough")
        // }
        //if strong enough 
        const loggedInuser = req.user;
        //password hashing of req.body
        const passwordHash = await bcrypt.hash(req.body.password, 10);
        //updating the hash in db 
        loggedInuser.password = passwordHash;
        await loggedInuser.save();
        res.json({
            message: "Password updated successfully"
        })
    } catch (error) {
        res.status(500).send("Internal Server error")
    }
})

module.exports = profileRouter