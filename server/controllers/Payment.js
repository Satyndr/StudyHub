const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");

//capture the razorpay order and initiate the razorpay order
exports.capturePayment = async(req, res)=>{
    //get courseid and userID
    const {course_id} = req.body;
    const userId = req.user.id;
    //valid courseid
    if(!courseId){
        return res.status(403).json({
            success:false,
            message:"Enter valid detail",
        })
    }
    //valid coursedetail
    let course;
    try{
        course = await Course.findById(course_id);
        if(!course){
            return res.json({
                success:false,
                message:"Could not find the Course",
            })
        }
        //user already paid for the same course
        const uid = new mongoose.Types.ObjectId(userId);
        if(course.studentEnrolled.includes(uid)){
            return res.status(200).json({
                success:false,
                message:"Student is already enrolled",
            })
        }


    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
    //order create
    const amount = course.price;
    const currency = "INR";

    const options = {
        amount: amount*100,
        currency,
        receipt: Math.random(Date.now()).toString(),
        notes:{
            courseId: course_id,
            userId,
        }
    };

    try{
        //initiate the paymment using razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);

        //return response
        return res.json({
            success:true,
            courseName:course.courseName,
            courseDescription:course.courseDescription,
            thumbnail:course.thumbnail,
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount,
        });
    }catch(error){
        console.log(error);
        return res.json({
            success:false,
            message:"Payment not initiatied",
        })
    }
}


//verify signature
exports.verifySignature = async(req, res)=>{
    
    //server signature
    const webhookSecret = "12345678";

    //signature from razorpay
    const signature = req.header["x-razorpay-signature"];

    const shasum = crypto.createHmac("sha256", webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if(signature === digest){
        console.log("Payment is Authorized");
        
        const {courseId, userId} = req.body.payload.payment.entity.notes;
        
        try{
            //find the course and enroll the student in it.
            const enrolledCourse = await Course.findOne(
                {_id: courseId},
                {
                    $push:{
                        studentsEnrolled: userId
                    }
                },
                {new:true},
            );

            if(!enrolledCourse){
                return res.status(500).json({
                    success:false,
                    message:"Course not found",
                })
            }
            console.log(enrolledCourse);

            //find the student and add the course to list of enrolledcourses
            const enrolledStudent = await User.findOneAndUpdate(
                {_id: userId},
                {
                    $push:{
                        courses:courseId
                    }
                },
                {new: true},   
            )

            //send confirmation mail to student
            const emailResponse = await mailSender(
                enrolledCourse.email,
                "Congratulations you are enrolled in course",
                "Congratulations bro you are now part of StudyHub . Enjoy learning with us."
            );

            console.log(emailResponse);

            return res.status(200).json({
                success:true,
                message:"Signature verified and Course enrolled Successfully",
            })
        }catch(error){
            console.log(error);
            return res.status(500).json({
                success:false,
                message:error.message,
            });
        }

    }else{
        return res.status(400).json({
            success:false,
            message:"Invalid request",
        })
    }
};