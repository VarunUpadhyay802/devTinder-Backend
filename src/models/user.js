const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50
    },
    lastName: {
        type: String,

    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
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
        default: "https://www.refugee-action.org.uk/wp-content/uploads/2016/10/anonymous-user.png"
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