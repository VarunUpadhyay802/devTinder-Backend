const express = require("express")

const app = express();
const port = 4000
const {adminAuth} = require("./middlewares/auth")
//generally we use app.use for middlewares
app.use("/admin" ,adminAuth)
app.get("/admin/getAllData",(req,res,next)=>{
    //so here the express will come only when the auth is completed
    res.send("response sent ")
})

app.listen(4000, () => {
    console.log(`server is running on port ${port}`)
})