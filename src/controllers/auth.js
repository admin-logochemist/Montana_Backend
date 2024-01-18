const db = require("../models")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
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
        const token = jwt.sign({ userId: newUser._id }, process.env.SECRET_KEY, {
            expiresIn: '1h',
        });

      return  res.status(200).json({
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
const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        console.log("start")
        const user = await db.UserModel.findOne({email});
    
        if(!user){
            return res.status(401).json({
                success: true,
                message: "User not exist with this email"
            })
        }
        const isPassword = await bcrypt.compare(password, user.password);
      
        if(!isPassword){
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
           success:true,
           token,
        user,
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

module.exports = {
    signup, login
}