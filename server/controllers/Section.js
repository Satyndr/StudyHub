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
            courseId,
            {
                $push:
                {
                    courseContent:newSection._id,
                }
            },
            {new: true},
        )
        .populate({
            path: "courseContent",
            populate: {
              path: "subSection",
            },
          })
          .exec();


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

// UPDATE a section
exports.updateSection = async (req, res) => {
    try {
      const { sectionName, sectionId } = req.body;
      const section = await Section.findByIdAndUpdate(
        sectionId,
        { sectionName },
        { new: true }
      );
      res.status(200).json({
        success: true,
        message: section,
      });
    } catch (error) {
      console.error("Error updating section:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
};
  
// DELETE a section
exports.deleteSection = async (req, res) => {
    try {
      const { sectionId } = req.body;
      await Section.findByIdAndDelete(sectionId);
      res.status(200).json({
        success: true,
        message: "Section deleted",
      });
    } catch (error) {
      console.error("Error deleting section:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
};