const nodemailer = require("nodemailer");
const express = require('express');
require('dotenv').config();
const generatedOTP = {};

const router = express.Router();

const getOTPTemplate = (otp) => {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>You have an OTP</title>
  <style>
    body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; }
    .email-business { 
      padding: 30px; 
      background-color: #f7f7f7; 
    }
    .header { 
      font-size: 24px; 
      font-weight: bold; 
      color: #333;
      
    }
    .subheader { 
      font-size: 18px; 
      color: #666; 
      margin-top: 10px;
      
    }
    .content { 
      margin-top: 20px; 
      color: #444; 
      line-height: 1.5;
      
    }
    .cta-button { 
      display: inline-block; 
      padding: 12px 24px; 
      background-color: #89c9e1; 
      color: white; 
      text-decoration: none; 
      border-radius: 4px; 
      font-weight: 500;
      margin-top: 25px;
    }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #888; font-size: 12px; text-align: center; }
    
    
    
    
    
  </style>
</head>
<body>
  <div class="container">
    <div class="email-business">
    <div style="text-align: center; margin-bottom: 25px;">
        <div style="display: inline-block; width: 60px; height: 60px; background-color: #ddd; border-radius: 50%; line-height: 60px; text-align: center; font-size: 24px; font-weight: bold;"></div>
      </div>
      <div class="content">
        You have an OTP<br/><br/>You got an OTP from BlogMind for resetting your password.  This is a crucial step in securing your BlogMind account.<br/><br/>Your OTP is: <strong> ${otp} <strong/>.  Please enter this code within the next 10 minutes to reset your password and regain access to your account.  This ensures the safety and security of your valuable content and data.<br/><br/>Resetting your password is quick and easy.  Learn More to securely update your password and continue enjoying the benefits of BlogMind.<br/>Thanks for using BlogMind<br/>
      </div>
      <div style="text-align: center;">
        <a href="https://blog-mind.vercel.app" class="cta-button" style="display: inline-block; padding: 12px 24px; background-color: #89c9e1; color: white; text-decoration: none; border-radius: 4px; font-weight: 500; margin-top: 25px;">Learn More</a>
      </div>
      <div class="footer">Thanks for using BlogMind</div>
    </div>
  </div>
</body>
</html>`
}

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD,
    },
});

function generateNewOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const sendMail = async (mailDetails, callback) => {
    try {
        const info = await transporter.sendMail(mailDetails)
        callback(info);
    } catch (error) {
        console.log(error);
    }
};

router.post('/send-otp', (req, res) => {

    const { recipient } = req.body;
    const otp = generateNewOTP();
    console.log(otp);
    
    generatedOTP[recipient] = otp;

    const mailDetails = {
        from: process.env.EMAIL_ID,
        to: recipient,
        subject: 'OTP for new password',
        html: getOTPTemplate(otp)
    }

    sendMail(mailDetails, (info) => {
        res.status(200).json(info);
    })

})

router.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    
    if (generatedOTP[email] === otp) {
        res.status(200).json({ message: "OTP Verified" });
    }else{
        res.status(400).json({ message: "Invalid OTP" });
    }
})

module.exports = router;