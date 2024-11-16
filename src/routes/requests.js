const express = require('express');
const ConnectionRequest = require('../models/connectionReques');
const { userAuth } = require('../middlewares/auth');
const requestRouter = express.Router();


 
requestRouter.post("/request/send/:status/:toUserId" ,userAuth, async (req,res)=>{
    try{
        //userauth will have logged in user details
        const fromUserId = req.user._id ; 
        //params will have the id whom we are sending request to 
        const toUserId = req.params.toUserId ; 
        //if the user is intereseted or not that is also in the url 
        const status = req.params.status  ;
        //create a new instance of the request 
        const connectionRequest = new ConnectionRequest({
            fromUserId ,
            toUserId ,
            status ,
        })
        const data = await connectionRequest.save();
        res.json({
            message : "Connection Request Sent Successfully",
            data : data
        })
    }catch(error){
        res.send("Connection request failed ! Try later")
    }
})


module.exports = requestRouter