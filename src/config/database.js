const mongoose = require("mongoose")



// mongoose.connect("mongodb+srv://varun802vu:39U7f6wtuffmzS2b@cluster0.7pjgm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
//as mongoose.connect returns a promise so it's better to wrap around async await
const connectDB = async () => {
    await mongoose.connect("mongodb://localhost:27017/devTinder")
}
// //now you know it returns a promise so we use then and catch 
// connectDB().then(() => {
//     console.log("Connected to the DB Successfully")
// }).catch((err) => {
//     console.log(err)
//     console.error("Problem connecting to the DB")
// })
module.exports = connectDB 