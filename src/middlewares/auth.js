const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    //read the token from the req cookies
    //validate the token
    //find the user from the token hidden detail
    try {
        const { token } = req.cookies;
        if(!token){
            throw new Error("Token invalid")
        }
        const decodeObj = await jwt.verify(token, "devTinder192");
        const { _id } = decodeObj;

        const user = await User.findById({
            _id: _id
        })
 
        if (!user) {
            throw new Error("User doesn't exist")
        }
        //if you have find user and suppose any request want user data
        //then you can just attach the user data with the req
        req.user = user
        // res.send(user);
        //if the token is valid and the user is found 
        next();
    } catch (error) {
        res.status(404).send("Error : " + error.message)
    }
}

module.exports = {
    userAuth
}