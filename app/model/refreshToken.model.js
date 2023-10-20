const mongoose= require('mongoose')

const RefreshToken= new mongoose.Schema({
    token:{type: String, required: true},
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

module.exports=mongoose.model('RefreshToken', RefreshToken)