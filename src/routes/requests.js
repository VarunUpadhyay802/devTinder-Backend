const express = require('express');
const ConnectionRequest = require('../models/connectionReques');
const { userAuth } = require('../middlewares/auth');
const User = require('../models/user');
const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        //userauth will have logged in user details
        const fromUserId = req.user._id;
        //params will have the id whom we are sending request to 
        const toUserId = req.params.toUserId;
        //if the user is intereseted or not that is also in the url 
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: `Invalid status type : ${status}` });

        }
        
        const toUser = await User.findById({
            _id: toUserId
        })
        if (!toUser) return res.status(404).json({ message: "User not found " })
        const fromUser = await User.findById({
            _id: fromUserId
        })
        if (!fromUser) throw new Error("User doesn't exist")
        //if there is an exisiting request 
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId: fromUserId, toUserId: toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ],
        })
       
        if (existingConnectionRequest) {
            return res.status(400).send("Connection Request Already Exists")
        }
        //create a new instance of the request 
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        })
        console.log("here");
        const data = await connectionRequest.save();
        
        res.json({
            message: "Connection Request Sent Successfully",
            data: data
        })
       

    } catch (error) {
        res.send(error.message)
    }
})


module.exports = requestRouter