const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {BadRequestError,UnauthenticatedError} = require("../errors");



const register = async (req, res) => {
  // const {name,email,password} = req.body
  // const salt = await bcrypt.genSalt(10)
  // const hashPassword = await bcrypt.hash(password,salt)
  // tempUser = {name,email,password:hashPassword}
  // const user = await User.create({...tempUser})
  const user = await User.create({ ...req.body });
  // const token = jwt.sign({userId:user._id,name:user.name},process.env.JWT_SECRET,{expiresIn:'30d'})
  // const token = jwt.sign({userId:user._id,name:user.name},process.env.JWT_SECRET,{expiresIn:'30d'})
  // res.status(StatusCodes.CREATED).json({user:{name:user.getName()},token})
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
  // res.status(StatusCodes.CREATED).json({user})
};

const login = async (req, res) => {
  const {email,password} = req.body

    if(!email || !password){
        throw new BadRequestError("provide email and password")
    }
    const user = await User.findOne({email})
    if(!user){
        throw new UnauthenticatedError('user not found')
    }
    const isPasswordCorrect = await user.comparePassword(password) 
    if(!isPasswordCorrect){
        throw new UnauthenticatedError(`password didn't match`)
    }
    const token = user.createJWT()

    res.status(StatusCodes.OK).json({user:{name:user.name},token})
};
module.exports = { register, login };
