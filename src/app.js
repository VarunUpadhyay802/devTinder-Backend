const express = require("express")

const app = express();
const port = 4000;
const connectDB = require("./config/database");
const User = require("./models/user")
app.use(express.json())

app.post("/signup", async (req, res) => {
    // //creating a new instance of the User model || just creating  a new user with the data we are getting
    const user = new User(req.body);
    try {
        await user.save();
        res.send("User added successfully")
    } catch (err) {
        res.status(400).send("Error saving the error:" + err.message)
    }

})

app.get("/userByEmail", async (req, res) => {

    //extract email from the req 
    const userEmail = req.body.emailId;
    console.log(userEmail)

    try {
        const user = await User.findOne({
            emailId: userEmail
        });

        // if (user.length === 0) {
        //     res.status(404).send("User not found ")
        // } else {
        //     res.send(user);
        // }

        if (user) {
            res.send(user)
        } else {
            res.status(404).send("User not found ");
        }


    } catch (error) {
        console.log("Error fetching users" + error)
    }
})
app.get("/byId", async (req, res) => {
    const userId = req.body._id;
    console.log(userId);

    try {
        const user = await User.findById({ _id: userId })
        if (user) {
            res.send(user);
        } else {
            res.status(404).send("User not found ")
        }

    } catch (error) {

    }
})
app.get("/feed", async (req, res) => {
    const userEmail = req.body.emailId;
    try {
        const user = await User.find({});
        res.send(user);
    } catch (error) {
        console.log("Error fetching users" + error)
    }
})

app.delete("/delete", async (req, res) => {
    const userId = req.body._id;
    console.log(userId);
    const user = await User.findById({ _id: userId })
    try {
        if (user) {
            await User.findByIdAndDelete({ userId });
            res.send("User deleted successfully")
        } else {
            res.status(404).send("No user with this Id ")
        }

    } catch (error) {
        res.status(500).send("something went wrong")
    }
})


app.patch("/user", async (req, res) => {
    //data that needs to be updated
    const data = req.body;
    const userId = req.body._id;
    try {
        const user = await User.findByIdAndUpdate({ _id: userId }, data, {
            returnDocument: "before"
        });
        console.log(user);
        res.send("user updated succesfully")
    } catch (error) {
        res.status(400).send("Something went wrong")
    }

})

connectDB().then(() => {
    console.log("Connected to the DB Successfully")
    app.listen(4000, () => {
        console.log(`server is running on port ${port}`)
    })
}).catch((err) => {
    console.log(err)
    console.error("Problem connectin g to the DB")
})


