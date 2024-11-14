const mongoose = require('mongoose');
const validator = require('validator')
const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        // minLength: 4,
        // maxLength: 50
    },
    lastName: {
        type: String,

    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is not valid")
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 18,
        default: 18
        //age should be greater then 18 to sign in on the tinder
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "other"].includes(value)) {
                throw new Error("Gender data is not valid")
            }
        },

    },
    photoUrl: {
        type: String,
        default: "https://www.refugee-action.org.uk/wp-content/uploads/2016/10/anonymous-user.png",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Not a valid profile url")
            }
        }
    },
    skills: {
        type: [String]
    },
    about: {
        type: String,
        default: "Hi everyone"
    }

}, {
    timestamps: true
}

)
// how youi create a modal first you enter the namne of the modal and second thing is the schema
const User = mongoose.model("User", userSchema)
module.exports = User; 