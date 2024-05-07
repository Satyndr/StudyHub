const Course = require("../models/Course");
const Category = require("../models/Category");
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
            category,
        } = req.body;
        //thumbnail fetch
        const thumbnail = req.files.thumbnailImage;
        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn ||!price ||!category){
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
        //check category is valid or not
        const categoryDetails = await Category.findById(category);
        if(!categoryDetails){
            return res.status(403).json({
                success:false,
                message:"Enter valid Category",
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
            category: categoryDetails._id,
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

        //update category schema
        await Category.findByIdAndUpdate(
            {_id: categoryDetails._id},
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

//get courses details
exports.getCourseDetails = async(req, res)=>{
    try{
        //get course id
        const {courseId} = req.body;
        //get course details
        const courseDetails = await Course.find(
            {_id:courseId})
            .populate(
                {
                    path:"instructor",
                    populate:{
                        path:"additionalDetails",
                    },
                }
            )
            .populate("category")
            .populate("ratingAndReview")
            .populate({
                path:"courseContent",
                populate:{
                    path:"subSection",
                },
            })
            .exec();

        //validation
        if(!courseDetails){
            return res.status(400).json({
                success:false,
                message:`Could not find the course with course if ${courseId}`
            })
        }

        return res.status(200).json({
            success:true,
            message:"Coures Details fetched successfully",
            data:courseDetails,
        })

    }catch(error){
        console.log(error);
        return res.status(403).json({
            success:false,
            message:error.message,
        })
    }
}