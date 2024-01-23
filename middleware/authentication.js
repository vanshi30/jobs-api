const User = require('../models/User')
const {UnauthenticatedError} = require('../errors')
const jwt = require('jsonwebtoken')

const auth = (req,res,next)=>{
    // checking headers.authorization
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        throw new UnauthenticatedError("authentication invalid")
    }   

    const token = authHeader.split(' ')[1]
    try{
        const payload = jwt.verify(token,process.env.JWT_SECRET)
        req.user = {userId:payload.userId,name:payload.name}
        next()
    }catch(err){
        throw new UnauthenticatedError("authentication error")
    }
}
module.exports = auth