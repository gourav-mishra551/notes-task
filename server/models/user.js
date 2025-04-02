const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const USerSchema = new mongoose.Schema({
    username: {type: String , require: true , unique:true},
    email:{type: String, require:true, unique:true},
    password:{type: String,require:true},
    isVerified: {type: Boolean , default:false},
    otp:{type:String},
    otpExpiry:{type:Date},
    resetToken:{type:String},
    resetTokenExpiry:{type: Date}
}, {timestamps:true});

// Hash Password
USerSchema.pre('save' , async function(next){
    if(!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model("User",USerSchema);