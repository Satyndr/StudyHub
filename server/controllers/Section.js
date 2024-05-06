const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req, res)=>{
    try{
        //fetch data
        const {sectionName, courseId} = req.body;
        //validate
        if(!sectionName || !courseId){
            return res.status(403).json({
                success:false,
                message:"All details required!",
            })
        }
        //create section
        const newSection = await Section.create({sectionName});
        //update course schema with section
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            {courseId},
            {
                $push:
                {
                    courseContent:newSection._id,
                }
            },
            {new: true},
        )
        //return response
        return res.status(200).json({
            success: true,
            message:"Section created Successfully",
            updatedCourseDetails,
        })

    }catch(error){
        console.log(error);
        return res.status(403).json({
            success:false,
            message:"Section creation failed, please try again.",
        })
    }
}

//update section
exports.updateSection = async(req, res)=>{
    try{
        //data input
        const {newSection, courseId} = req.body;
        //validate
        if(!newSection || !courseId){
            return res.status(403).json({
                success:false,
                message:"Fill details to update.",
            })
        }
        //update section
        const updatedSection = await Section.findByIdAndUpdate(
            courseId,
            {newSection},
            {new: true},
        )
        //return response
        return res.status(200).json({
            success:true,
            message:"Section updated successfully.",
            updatedSection,
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Unable to update section, please try again",
            error:error.message,
        });
    }
};

//delete section
exports.deleteSection = async(req, res)=>{
    try{
        //get id
        const {sectionId} = req.params;
        //TODO: delete from course schema

        //use findbyidanddelete
        await Section.findByIdAndDelete(sectionId);
        //return response
        return res.status(200).json({
            success:true,
            message:"Section deleted successfully.",
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Unable to delete section, please try again",
            error:error.message,
        });
    }
}