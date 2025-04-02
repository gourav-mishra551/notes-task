const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service:'Gmail',
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
})

exports.sendOTP = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP for verification is ${otp}. It is valid for 10 minutes.`,
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log("Email sent: ", info.response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};