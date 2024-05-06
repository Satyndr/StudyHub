const Course = require("../models/Course");
const Tag = require("../models/Tag");
const User = require("../models/User");
const uploadImageToCloudinary = require("../utils/ImageUploader");

//create course
exports.createCourse = async(req, res)=>{
    try{
        //data fetch
        const {
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            tag,
        } = req.body;
        //thumbnail fetch
        const thumbnail = req.files.thumbnailImage;
        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn ||!price ||!tag){
            return res.status(403).json({
                success:false,
                message:"All fields are required",
            })
        }
        //check for instructor to store in course schema
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log("Instructor details: ", instructorDetails);

        if(!instructorDetails){
            return res.status(403).json({
                success:false,
                message:"Instructor Details not Found"
            })
        }
        //check tag is valid or not
        const tagDetails = await Tag.findById(tag);
        if(!tagDetails){
            return res.status(403).json({
                success:false,
                message:"Enter valid Tag",
            })
        }
        //Upload Image top Cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.send.FOLDER_NAME);
        //create an entry for new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price: price,
            tag: tagDetails._id,
            thumbnail: thumbnailImage.secure_url,
        })

        //add new course to user Schema of Instructor
        await User.findByIdAndUpdate(
            {_id: instructorDetails._id},
            {
                $push:{
                    courses: newCourse._id,
                }
            },
            {new: true},
        );

        //update tag schema
        await Tag.findByIdAndUpdate(
            {_id: tagDetails._id},
            {
                $push:{
                    course: newCourse._id,
                }
            },
            {new : true}
        );

        //return response
        return res.status(300).json({
            success:true,
            message:"Course creates successfully",
            data:newCourse,
        });

    }catch(error){
        console.log(error);
        return res.status(403).json({
            success:false,
            message:"Course creation failed, please try again.",
        })
    }
}

//show all courses
exports.showAllCourses = async(req, res)=>{
    try{
        const allCourses = await Course.find({});

        return res.status(200).json({
            success:true,
            message:"Data for all courses fetched successfully",
            data:allCourses,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Cannot fetch course data",
            error:error.message,
        })
    }
}