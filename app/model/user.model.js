const mongoose=require('mongoose')

const User= new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    username:{type: String, required: true},
    password: {type: String, required: true},
    isAdmin: {type: Boolean, default: false}
})

module.exports=mongoose.model("User", User)
