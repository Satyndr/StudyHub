const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

//auth
exports.auth = async(req, res, next) =>{
    try{
        //extract token
        const token = req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer ", "");

        //if token is missing then return response
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is missing",
            })
        }

        //verify the token
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }
        catch(error){
            console.log(error);
            return res.status(401).json({
                success:false,
                message:"token is valid",
            });
        }
        next();

    }catch(error){
        console.log(error);
        return res.status(403).json({
            success:false,
            message:"Authorization Failed",
        })
    }
}

//is student
exports.isStudent = async(req, res, next) =>{
    try{
        //check account type
        if(req.user.accountType !== "Student"){
            res.status(401).json({
                success:false,
                message:"This is a protected route for Students",
            })
        }
        next();

    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Student request access failed",
        })
    }
}

//is instructor
exports.isInstructor = async(req, res, next) =>{
    try{
        //check account type
        if(req.user.accountType !== "Instructor"){
            res.status(401).json({
                success:false,
                message:"This is a protected route for Instructor",
            })
        }
        next();

    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Instructor request access failed",
        })
    }
}

//is admin
exports.isAdmin = async(req, res, next) =>{
    try{
        //check account type
        if(req.user.accountType !== "Admin"){
            res.status(401).json({
                success:false,
                message:"This is a protected route for Admin only ",
            })
        }
        next();

    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Admin request access failed",
        })
    }
}
