const OTP = require("../models/OTP");
const User = require("../models/User");
const Profile = require("../models/Profile");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const { otpTemplate } = require("../mail/templates/emailVerificationTemplate");
require("dotenv").config();

//sendOTP
exports.sendOTP = async (req, res)=>{
    try{
        //fetch email from request body
        let {email} = req.body;

        //check if the email/user is present or not
        let checkUserPresent = await User.findOne({email});

        //if user already present then send a response
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:"User already registered",
            })
        }

        //generate otp--------------------------------------------------
        let otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        console.log("OTP Generated: ", otp);

        //check if otp is unique
        let checkUniqueOtp = await OTP.findOne({otp: otp});
        while(checkUniqueOtp){
            otp = otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            });
            checkUniqueOtp = await OTP.findOne({otp: otp});
        }

        //send mail- 
        // const mailResponse = mailSender(email, "Email Verification from studynotion", otp);
        // console.log("Mail sent successfully", mailResponse);

        //sending otp in the database-----------------------------------
        const otpPayloader = {email, otp};

        //creating entry for otp
        const otpBody = await OTP.create(otpPayloader);
        console.log(otpBody);

        return res.status(200).json({
            success:true,
            message:"OTP sent Successfully",
            otp,
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

//signup
exports.signUp = async(req, res)=>{
    try{

        //data fetch from request body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body;

        //validate
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success:false,
                message:"All fields are required",
            })
        }

        //2 password match
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and Confirm password value does not match, please try again.",
            })
        }

        //check user already exist or not
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already registered",
            })
        }

        
        //find most recent otp and validate it
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp);
        if(recentOtp.length === 0){
            return res.status(400).json({
                success:false,
                message:"OTP not Found",
            })
        }
        else if(recentOtp[0].otp !== otp){
            return res.status(400).json({
                success:false,
                message:"Invalid OTP",
            })
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create entry in db

        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null
        })

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashedPassword,
            accountType,
            additionalDetails:profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        })

        //return response
        return res.status(200).json({
            success:true,
            message:"User is Registered Successfully",
            user,
        });

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User is not registered, please try again."
        })
    }
}

//Login
exports.login = async(req, res)=>{
    try{
        //fetch data from request body
        const {email, password} = req.body;

        //data validation
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"All fields are required"
            })
        }

        //check user exist or not
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered, SignUp first."
            })
        }

        //generate JWT, after matching password
        if(await bcrypt.compare(password, user.password)){
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }

            //token in made for getting authorization
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn:"2h",
            })

            user.token = token;
            user.password = undefined;

            //create cookie and send response
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true, //cookie is not changable in client side
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"Logged in successfully"
            })

        }
        else{
            return res.status(401).json({
                success:false,
                message:"Password is Incorrect",
            })
        }

    }
    catch(error){
        console.log(error);
        return res.status(401).json({
            success:false,
            message:"Login Failed",
        })
    }
}

//change Password
exports.changePassword = async(req, res)=>{
    try{
        //get data from request body
        const {oldPassword, newPassword, confirmNewPassword} = req.body;

        //get old password, new password , confirmNewPassword

        //validation
        if(!oldPassword || !newPassword || !confirmNewPassword){
            return res.status(403).json({
                success:false,
                message:"All fields are required!",
            })
        }  
        if(newPassword !== confirmNewPassword){
            return res.status(400).json({
                success:false,
                message:"Password and Confirm password value does not match, please try again.",
            })
        }
        if(newPassword == oldPassword){
            return res.status(400).json({
                success:false,
                message:"Enter new Password",
            })
        }

        //update pwd in DB
        const update = await User.findOneAndUpdate(
            {password: newPassword},
        );
        console.log(update);

        //send mail- password updated
        const mailResponse = mailSender(email, "Password Changed from studynotion", "Password Changed Successfully");
        console.log("Mail sent successfully", mailResponse);

        //return response
        return res.status(200).json({
            status:success,
            message:"Password changed successfully"
        })
    }
    catch(error){
        console.log(error);
        return res.status(401).json({
            success:false,
            message:"Password change failed",
        })
    }
}