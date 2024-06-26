const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    courseName:{
        type:String,
    },
    courseDescription:{
        type:String,
        required:true
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    whatYouWillLearn:{
        type:String,
    },
    courseContent:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Section",
        }
    ],
    ratingAndReviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"RatingAndReview"
        }
    ],
    price:{
        type:Number,
        requied:true
    },
    thumbnail:{
        type:String,
    },
    tag:{
        type:[String],
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
    },
    studentEnrolled:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    instructions:{
        type:[String],
    },
    status:{
        type:String,
        enum:["Draft", "Published"],
    }
},
{ timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);