const Profile = require("../models/Profile");
const User = require("../models/User");

//profile update 
exports.updateProfile = async(req, res)=>{
    try{
        //fetch data
        const {dateOfBirth="", about="", gender, contactNumber} = req.body;
        //get userId
        const id = req.user.id;
        //validate
        if(!gender || !contactNumber){
            return res.status(403).json({
                success:false,
                message:"Gender and Contact Number required",
            })
        }
        //find profile
        const userDetails = await User.findOne(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findOne(profileId);
        //update profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;

        await profileDetails.save();

        //return response
        return res.status(200).json({
            success:true,
            message:"Profile updated successfully",
            profileDetails,
        })

    }catch(err){
        console.log(err);
        return res.status(403).json({
            success:false,
            message:"Profile was not updated, please try again.",
        })
    }
}

//delete account
exports.deleteProfile = async(req, res)=>{
    try{
        //fetch id 
        const id = req.user.id;
        //validate
        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(403).json({
                success:false,
                message:"User not found",
            })
        }
        //first remove additional details////profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
        //find by id and delete user schema////user
        await user.findByIdAndDelete({_id:id});
        //return response
        return res.status(200).json({
            success:true,
            message:"User deleted Successfully",
        })
    }
    catch(err){
        console.log(err);
        return res.status(403).json({
            success:false,
            message:"Profile was not deleted, please try again.",
        })
    }
}

exports.getAllUserDetails = async(req, res)=>{
    try{
        //get id
        const id = req.user.id;
        //validation
        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        //return response
        return res.status(200).json({
            success:true,
            message:"User data fetched successfully",
        })
    }
    catch(error){
        console.log(err);
        return res.status(403).json({
            success:false,
            message:"Profile was not found, please try again.",
        })
    }
}