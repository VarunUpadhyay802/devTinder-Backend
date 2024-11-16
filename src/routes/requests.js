const express = require('express');
const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest" ,userAuth, async (req,res)=>{
    const user = req.user ; 

    console.log("Connection req sent by " + user.firstName)
    res.send("Connection request sent successfully by "+user.firstName)
})


module.exports = requestRouter