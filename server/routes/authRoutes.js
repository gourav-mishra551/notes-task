const express = require('express');
const {registerUser,loginUser,getUserProfile, verifyOTP,forgotPassword,resetPassword,userCheck} = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware');
const {authenticateUser} = require('../middleware/authMiddleware') ;

const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-otp', verifyOTP);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile', protect, getUserProfile);
router.get("/user", authenticateUser, userCheck);

module.exports = router;
