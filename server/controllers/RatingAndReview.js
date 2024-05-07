const ratingAndReview = require("ratingAndReview");
const Course = require("../models/Course");
const User = require("../models/User");
const RatingAndReview = require("../models/RatingAndReview");

//createRating
exports.createRating = async(req, res)=>{
    try{

        //get user id
        const {userId} = req.user.id;
        //data fetch
        const {courseId, rating, review} = req.body;
        //check if user is enrolled or not
        const courseDetails = await Course.findOne(
            {_id:courseId,
                studentsEnrolled:{$elemMatch:{$eq: userId}},
            },)
        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:"Student is not enrolled in the course",
            })
        }
        //user already reviewed
        const alreadyReviewed = await RatingAndReview.findOne(
            {user:userId,
            course:courseId,
        })
        if(alreadyReviewed){
            return res.status(403).json({
                success:false,
                message:"Course is already reviewed by the user",
            });
        }
        //create rating
        const ratingReview = await RatingAndReview.create(
            {rating,
                review,
                course: courseId,
                user: userId,
            }
        );

        //update course schema
        await Course.findByIdAndUpdate({_id:courseId},
            {
                $push:{
                    ratingAndReviews: ratingReview
                }
            },
            {new:true}
        )
        //return response
        return res.status(200).json({
            success: true,
            message: "Rating created successfully"
        })

    }catch(error){
        return res.status(400).json({
            success:false,
            message:"Rating not created, please try again.",
            ratingReview,
        })
    }
}

//average rating
exports.averageRating = async(req, res)=>{
    try{
        //fetch id
        const courseId = req.body;
        //calculate average
        const result = await RatingAndReview.aggregate([
            {
                $match:{
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group:{
                    _id:null,
                    averageRating: { $avg: "$rating"},
                }
            }
        ])
        //return response
        if(result.length > 0 ){
            return res.status(200).json({
                success:true,
                averageRating: result[0].averageRating,
            })
        }

        //if no rating exists
        return res.status(200).json({
            success:true,
            message:"Average rating is 0",
        })

    }catch(error){
        console.log(error);
        return res.status(400).json({
            success:false,
            message:"Error in average rating.",
        })
    }
}

//get all rating
exports.showAllRating = async(req, res)=>{
    try{
        const allReviews = await RatingAndReview.find({}).sort({rating:"desc"})
                                                        .populate({
                                                            path:"User",
                                                            select:"firstName lastName email image"
                                                        })
                                                        .populate({
                                                            path:"Course",
                                                            select:"courseName",
                                                        })
                                                        .exec();

        return res.status(200).json({
            success:true,
            message:"Rating fetched successfully",
            allReviews,
        })
    }
    catch(error){
        console.log(error);
        return res.status(400).json({
            success:false,
            message:"Error in Showing all rating.",
        })
    }
}