const mongoose = require('mongoose')

const JobSchema = new mongoose.Schema(
    {
    company:{
        type:String,
        required:[true,"Provide company name"],
        maxlength:[50,"no more than 50 characters"]
    },
    position:{
        type:String,
        required:[true,"please enter position"],
        maxlength:[100,"no more than 100"]
    },
    status:{
        type:String,
        enum:["interview","pending","declined"],
        default:'pending'
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:[true,'please provide user']
    },

},{timestamps:true}
)

module.exports = mongoose.model('Job',JobSchema)