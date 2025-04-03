const User = require('../models/user');
const bycrpt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const {sendOTP} = require('../utils/emailService');
const user = require('../models/user');

// generate otp
const generateOTP = () => crypto.randomInt(100000, 999999).toString();

//register user
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        const otp = generateOTP();
        const otpExpiry = Date.now() + 10 * 60 * 1000;

        const user = await User.create({ username, email, password, otp, otpExpiry });

        // 🔹 Fix: Call sendOTP function to send email
        await sendOTP(email, otp);  

        res.status(201).json({ message: "OTP sent. Verify to activate your account" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//verify otp
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() }).lean();

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        console.log("Stored OTP:", user.otp, "Length:", user.otp.length);
        console.log("Entered OTP:", otp, "Length:", otp.length);
        console.log([...user.otp].map(c => c.charCodeAt(0))); // Debug character codes
        console.log([...otp].map(c => c.charCodeAt(0)));

        if (String(user.otp).trim() !== String(otp).trim() ) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        await User.updateOne({ email }, { $set: { isVerified: true, otp: null, otpExpiry: null } });

        res.status(200).json({ message: "Email verified. You can now log in" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Login user
exports.loginUser = async(req,res)=>{
    const {email,password} = req.body;

    try {
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message:"Invalid credentials"})
        
        if (!user.isVerified) return res.status(400).json({ message: "Verify your email first" });
        
        const isMatch = await bycrpt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1d'});

        res.status(200).json({token , user:{id:user._id,username:user.username , email:user.email}});

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const otp = generateOTP();
        user.otp = otp;
        user.otpExpiry = Date.now() + 10 * 60 * 1000;
        await user.save();

        await sendOTP(email, otp);

        res.status(200).json({ message: "OTP sent for password reset" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        user.password = newPassword;
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get User Profile

exports.getUserProfile = async (req,res)=>{
    try {
        const user = await User.findById(req.user.id).select('-password');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.userCheck = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password"); // Exclude password field
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found." });
      }
  
      res.status(200).json({ success: true, user });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ success: false, message: "Server error." });
    }
  }