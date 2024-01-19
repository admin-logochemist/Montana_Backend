const db = require('../models');

const contactUs = async (req,res)=>{
    
    try {
        const {name,email,phone,message} = req.body;
        if([name,email,phone,message].some((field)=> field?.trim() === "")){
            return res.status(400).json({
                success:true,
                message: "All fields must be required"
            })
        }
        const contact = await db.ContactModel.create({
            name,email,phone,message
        })

        if(contact){
            return res.status(200).json({
                success:true,
                message: "Submitted Successfull"
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Error while registering the user"
        })
    }
}
module.exports = {contactUs}
