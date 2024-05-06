const Tag = require("../models/Tag");

//create tag
exports.createTag = async(req, res)=>{
    try{
        //fetch data
        const {name, description} = req.body;
        //validation
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            })
        }
        //create entry in database
        const tagDetails = await Tag.create({
            name:name,
            description:description,
        })
        console.log(tagDetails);
        //send response
        return res.status(300).json({
            success:true,
            message:"Tag created successfully",
        })
    }catch(error){
        console.log(error);
        return res.status(403).json({
            success:false,
            message:"Tag creation failed, please try again.",
        })
    }
}

//get all tag
exports.showAllTags = async(req, res) =>{
    try{
        const allTags = Tag.find({}, {name:true}, {description:true});
        res.status(200).json({
            success:true,
            message:"All tags returned successfully",
            allTags,
        })
    }
    catch(error){
        console.log(error);
        return res.status(403).json({
            success:false,
            message:"Tag access failed, please try again.",
        })
    }
}