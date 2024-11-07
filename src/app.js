const express = require("express")

const app = express();
const port = 4000

// handling the requests
app.use("/test",(req,res)=>{
    res.send("hello from the server")
})

app.listen(4000,()=>{
    console.log(`server is running on port ${port}`)
})