const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"name is required"],
        minlength:[3,'min 3 characters needed'],
        maxlength:[50,'no more than 50 characters allowed']
    },
email:{
    type:String,
    required:[true,'email needed'],
    match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,"Enter proper email"],
    unique:true
},
password:{
    type:String,
    required:[true,"password needed"],
    minlength:[6,"min 6 characters needed in password"]
}
})

// mongoose middleware .pre()
UserSchema.pre('save',async function(next){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
    next()
})

// schema instance
// UserSchema.methods.getName = function(){
//     return this.name
// }
// schema instance
UserSchema.methods.createJWT = function(){
    return jwt.sign({userId:this._id,name:this.name},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
}
//schema instance
UserSchema.methods.comparePassword = async function(candidatePassword){
    const pass = await bcrypt.compare(candidatePassword,this.password)
    return pass
}
module.exports = mongoose.model('User',UserSchema)