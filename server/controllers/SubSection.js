const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/ImageUploader");

exports.createSubSection = async(req, res)=>{
    try{
        //fetch data
        const {sectionId, title, timeDuration, description} = req.body;
        //get file
        const video = req.files.videoFile;
        //validate data
        if(!title || !description || !video || !timeDuration ){
            return res.status(403).json({
                success:false,
                message:"All fields required!",
            })
        }
        //upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
        console.log(uploadDetails);
        //create a sub section
        const subSectionDetails = await SubSection.create({
            title: title,
            description: description,
            timeDuration: `${uploadDetails.duration}`,
            videoUrl: uploadDetails.secure_url,
        })
        //update section schema
        const updatedSection = await Section.findByIdAndUpdate(
            {_id: sectionId},
            {
                $push:
                {
                    subSection:subSectionDetails._id,
                }
            },
            {new : true}
        ).populate("subSection")
        //return response
        return res.status(200).json({
            success:true,
            message:"Sub section created successfully",
            data:updatedSection,
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Unable to create sub section, please try again",
            error:error.message,
        });
    }
}

//update subsection
exports.updateSubSection = async(req, res)=>{
    try{
        const { sectionId, title, description } = req.body
        const subSection = await SubSection.findById(sectionId)
    
        if (!subSection) {
          return res.status(404).json({
            success: false,
            message: "SubSection not found",
          })
        }
    
        if (title !== undefined) {
          subSection.title = title
        }
    
        if (description !== undefined) {
          subSection.description = description
        }
        if (req.files && req.files.video !== undefined) {
          const video = req.files.video
          const uploadDetails = await uploadImageToCloudinary(
            video,
            process.env.FOLDER_NAME
          )
          subSection.videoUrl = uploadDetails.secure_url
          subSection.timeDuration = `${uploadDetails.duration}`
        }
    
        await subSection.save()
    
        return res.json({
          success: true,
          message: "Section updated successfully",
        })
      } catch (error) {
        console.error(error)
        return res.status(500).json({
          success: false,
          message: "An error occurred while updating the section",
        })
    }
}

//delete sub section
exports.deleteSubSection = async(req, res)=>{
    try{
        const { subSectionId, sectionId } = req.body
        await Section.findByIdAndUpdate(
          { _id: sectionId },
          {
            $pull: {
              subSection: subSectionId,
            },
          }
        )
        const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })
    
        if (!subSection) {
          return res
            .status(404)
            .json({ success: false, message: "SubSection not found" })
        }
    
        return res.json({
          success: true,
          message: "SubSection deleted successfully",
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
          success: false,
          message: "An error occurred while deleting the SubSection",
        })
    }
}