const db = require("../models")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const saltRounds = 10;
const { sendMail } = require("../helpers/mailer");
const lipseysApi = require("lipseys-api");

const signup = async (req, res) => {
    try {
        const {
            firstName, secondName, email, password
        } = req.body;
        // Check if the user already exists
        const existingUser = await db.UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new db.UserModel({ firstName, secondName, email, password: hashedPassword });
        await newUser.save();
        
        // Generate JWT token
        const token = await jwt.sign({ userId: newUser._id }, process.env.SECRET_KEY, {
            expiresIn: '1h',
        });
        

        
        return res.status(200).json({
            success: true,
            token,
            data: { firstName, secondName, email },
            message: 'User registered successfully'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Error while registering the user"
        })
    }
}
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "developer@seniorresidencemap.com",
        pass: "xtap wkcy bihr zmqx",
    },
});
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("start")
        const user = await db.UserModel.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: true,
                message: "User not exist with this email"
            })
        }
        const isPassword = await bcrypt.compare(password, user.password);

        if (!isPassword) {
            return res.status(401).json({
                success: true,
                message: "Password is incorrect"
            })
        }
        // Generate JWT token
        const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
            expiresIn: '1h',
        });

        return res.status(200).json({
            success: true,
            token,
            data: user,
            message: "Login Successfull"

        })
    } catch (error) {
        // console.log(error)
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Error while Login"
        })
    }
}
// demo Login
const demoLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("start")
        const user = await db.DemoUserModel.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: true,
                message: "User not exist with this email"
            })
        }
        const isPassword = await bcrypt.compare(password, user.password);

        if (!isPassword) {
            return res.status(401).json({
                success: true,
                message: "Password is incorrect"
            })
        }
        // Generate JWT token
        const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
            expiresIn: '1h',
        });

        return res.status(200).json({
            success: true,
            token,
            data: user,
            message: "Login Successfull"

        })
    } catch (error) {
        // console.log(error)
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Error while Login"
        })
    }
}

// demo signup
const demoSignup = async (req, res) => {
    try {
        const {
            name, contact, email, password
        } = req.body;
        // Check if the user already exists
        const existingUser = await db.DemoUserModel.findOne({ email });
        if (existingUser) {
            return res.status(200).json({success:false, message: 'Email already exists' ,  type: "email" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new db.DemoUserModel({ name, email, contact, password: hashedPassword });
        await newUser.save();

        // Generate JWT token
        const token = await jwt.sign({ userId: newUser._id }, process.env.SECRET_KEY, {
            expiresIn: '1h',
        });
        // send mail
        let info = await transporter.sendMail({
            from: "muhammadumar10293847@gmail.com",
            to: email,
            subject: "Senior Residence Registration",
            html: `  <table cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
            <tr>
                <td bgcolor="#4B266A" style="padding: 20px; text-align: center;">
                    <img with="120" src="https://firebasestorage.googleapis.com/v0/b/landingpages-d5920.appspot.com/o/images%2Flogo.png?alt=media&token=9a446a17-8fb2-462e-87c2-1ea875eda322" alt="Your Brand Logo" style="max-width: 150px; height: auto;">
                    <h2 style="color: #ffffff;">User Registration Confirmation</h2>
                    <p style="color: #ffffff;">Thank you for registering! Your account has been successfully created.</p>
                </td>
            </tr>
            <tr>
                <td bgcolor="#ffffff" style="padding: 20px;">
                    <table cellpadding="10" cellspacing="0" width="100%" style="border-collapse: collapse; border: 1px solid #dddddd;">
                        <tr>
                            <td><strong style="color: #4B266A;">Name:</strong></td>
                            <td>${name}</td>
                        </tr>
                        <tr>
                            <td><strong style="color: #4B266A;">Email:</strong></td>
                            <td>${email}</td>
                        </tr>
                        <!-- Add more user details as needed -->
                    </table>
                </td>
            </tr>
            <tr>
                <td bgcolor="#4B266A" style="padding: 20px; text-align: center;">
                    <p style="color: #ffffff;">Thank you for choosing our platform!</p>
                </td>
            </tr>
        </table>`,
        });
        return res.status(200).json({
            success: true,
            token,
            info,
            data: { name, email, contact },
            message: 'User registered successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Error while registering the user"
        })
    }
}

// Generate random OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  
const sendOtp = async (req, res) => {
    try {
      const userEmail = req.body.email;
      const user = await db.UserModel.findOne({ email: userEmail });
  
      if (!user) {
        return res.status(404).json({success: false, message: "User not registered with this email" });
      }
  
      const otpCode = generateOTP();
      console.log("otpCode-->", otpCode);
  
      await sendMail(user.email, "OTP Code",  `Your OTP code is: ${otpCode}`)
  
      user.otp = {
        type: "forgetPassword",
        value: otpCode,
        isVerified: false,
      };
  
      await user.save();
  
      res.status(200).json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
      console.error("Error sending OTP:", error);
      res.status(500).json({ success:false, message:error.message , error: "Internal server error" });
    }
  };
  
  const varifyOtp = async (req,res) => {
    try {
      const userEmail = req.body.email;
      const userOtp = req.body.otp;
      const user = await db.UserModel.findOne({ email: userEmail });
      if (!user) {
        return res.status(404).json({success: false, message: "User not registered with this email" });
      }
  
      if (user.otp.value == userOtp) {
        user.otp.isVerified = true;
        await user.save();
        res.status(200).json({ success: true, message: "OTP verified successfully" });
      } 
      else {
        res.status(400).json({success: false, message: "Invalid OTP" });
      }
  
    } catch (error) {
      console.log("Error while verifying OTP:", error);
      res.status(500).json({ success:false, message:error.message , error: "Internal server error"})
    }
  }
  
  const changePassword = async (req,res) =>{
    try {
      const userEmail = req.body.email;
      const userNewPassword = req.body.password;
      const user = await db.UserModel.findOne({ email: userEmail });
      if (!user) {
        return res.status(404).json({success: false, message: "User not registered with this email" });
      }
      const hashedPassword = await bcrypt.hash(userNewPassword, saltRounds);
      user.password = hashedPassword;
      await user.save();
      res.status(200).json({ success: true, message: "Password changed successfully" });
  
    } catch (error) {
      console.log("Error while changing Password:", error);
      res.status(500).json({ success:false, message:error.message , error: "Internal server error"})
    }
  }

const lipseysLogin = async (req,res)=>{
    const {email , password} = req.body;
    try {    
        lipseysApi.Init(email,password,function (resp) {
            console.log(res);
            res.status(200).json({ success: true, message: "token generated", data : resp });
          })
    } catch (error) {
        res.status(500).json({ success:false, message:error.message , error: "Internal server error"})
    }

}
module.exports = {
    signup, lipseysLogin, login, demoSignup, demoLogin, sendOtp, varifyOtp, changePassword
}