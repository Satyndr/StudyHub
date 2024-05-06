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
        if(!title || !description || !videoUrl || !timeDuration ){
            return res.status(403).json({
                success:false,
                message:"All fields required!",
            })
        }
        //upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
        //create a sub section
        const subSectionDetails = await SubSection.create({
            title: title,
            description: description,
            timeDuration: timeDuration,
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
        )
        //return response
        return res.status(200).json({
            success:true,
            message:"Sub section created successfully"
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
        //data input
        const {newSubSection, sectionId} = req.body;
        //validate
        if(!newSubSection || !sectionId){
            return res.status(403).json({
                success:false,
                message:"Fill details to update",
            })
        }
        //update subsection
        const updatedSubSection = await SubSection.findByIdAndUpdate(
            sectionId,
            {newSubSection},
            {new:true},
        )
        //return ressponse
        return res.status(200).json({
            success:true,
            message:"Section updated successfully.",
            updatedSubSection,
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Unable to update sub section, please try again",
            error:error.message,
        });
    }
}

//delete sub section
exports.deleteSubSection = async(req, res)=>{
    try{
        //get id
        const {subSectionId} = req.params;
        //TODO: delete from section schema

        //use findbyidanddelete
        await SubSection.findByIdAndDelete(subSectionId);
        //return response
        return res.status(200).json({
            success:true,
            message:"Sub Section deleted successfully.",
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Unable to delete sub section, please try again",
            error:error.message,
        });
    }
}