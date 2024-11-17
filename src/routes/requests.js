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
            return res.status(400).json({
                message: ("Connection Request Already Exists"),
                data: existingConnectionRequest
            })
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
            message: `${fromUser.firstName} ${status}  ${toUser.firstName} `,
            data: data
        })


    } catch (error) {
        res.send(error.message)
    }
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        //validation of status
        const allowedStatus = ["accepted", "rejected"];
        const { status, requestId } = req.params;

        if (!allowedStatus.includes(status)) {
            return res.status(400).send(`Invalid Status : ${status}`)
        }
        const loggedInUser = req.user
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        })

        if (!connectionRequest) {
            return res.status(404).json({
                message: ("Connection Request Not Found"),
            })
        }  
        connectionRequest.status = status;
        console.log(connectionRequest);
        const data = await connectionRequest.save();       
        res.json({ message: "Connection request " + status, data });
    } catch (error) {
        res.json({
            message: error.message
        })
    }
})


module.exports = requestRouter