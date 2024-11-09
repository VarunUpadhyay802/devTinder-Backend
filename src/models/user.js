const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName : {
        type: String , 
        required:true,
        minLength:4,
        maxLength:50
    },
    lastName : {
        type : String 
    },
    emailId:{
        type : String ,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    password:{
        type: String,
        required:true
    },
    age : {
        type : Number 
    },
    gender : {
        type : String
    },
    photoUrl:{
        type : String,
        default:"https://www.refugee-action.org.uk/wp-content/uploads/2016/10/anonymous-user.png"
    },
    skills:{
        type : [String]
    },
    about:{
        type: String,
        default:"Hi everyone"
    }

})
// how youi create a modal first you enter the namne of the modal and second thing is the schema
const User = mongoose.model("User" , userSchema)
module.exports = User ; 