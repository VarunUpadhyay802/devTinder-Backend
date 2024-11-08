const adminAuth = (req,res,next)=>{
    //logic for token checking
    const token = "tye12"
    const isAuthorized = token === "ty1e12"
    if(!isAuthorized){
        //not authorized don't send response further
        res.send("not authorized")
    }else{
        next();
    }
}
module.exports = {
    adminAuth
}