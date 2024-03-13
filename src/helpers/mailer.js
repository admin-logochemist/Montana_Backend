const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "montanaarms704@gmail.com",
      pass: "fgde sxar qmra wiwt",
    },
  });

const sendMail = async (userEmail,subject,emailTemplate)=>{
    try {
      const mailOptions = {
        from: "muhammadumar10293847@gmail.com",
        to: userEmail,
        subject: subject,
        text: emailTemplate,
      };
      await transporter.sendMail(mailOptions);
      console.log("email send from nodemailer")
    } catch (error) {
      console.log("Error sending email", error);
    }
  }
  
  module.exports = {
    sendMail
  };
    