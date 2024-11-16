const express = require('express');
const { validateEditProfileData } = require('../utils/validation');
const User = require('../models/user');
const userRouter = express.Router();

userRouter.patch("/user/:userId", async (req, res) => {
    //data that needs to be updated
    const data = req.body;
    const userId = req.params?.userId;

    try {
        //validation 
        if (!validateEditProfileData(data)) {
            throw new Error("Update not allowed");
        }

        const user = await User.findByIdAndUpdate({ _id: userId }, data, {
            returnDocument: "before",
            runValidators: true,
        });
        // console.log(user);
        res.send("user updated succesfully");
    } catch (error) {
        res.status(400).send("Something went wrong " + error)
    }
})

module.exports = userRouter