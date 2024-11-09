const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName : {
        type: String , 
    },
    lastName : {
        type : String 
    },
    emailId:{
        type : String 
    },
    password:{
        type: String
    },
    age : {
        type : Number 
    },
    gender : {
        type : String
    }

})
// how youi create a modal first you enter the namne of the modal and second thing is the schema
const User = mongoose.model("User" , userSchema)
module.exports = User ; 