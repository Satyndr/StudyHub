const Category = require("../models/Category");

//create Category
exports.createCategory = async(req, res)=>{
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
        const CategoryDetails = await Category.create({
            name:name,
            description:description,
        })
        console.log(CategoryDetails);
        //send response
        return res.status(300).json({
            success:true,
            message:"Category created successfully",
        })
    }catch(error){
        console.log(error);
        return res.status(403).json({
            success:false,
            message:"Category creation failed, please try again.",
        })
    }
}

//get all Category
exports.showAllCategories = async(req, res) =>{
    try{
        const allCategories = Category.find({}, {name:true}, {description:true});
        res.status(200).json({
            success:true,
            message:"All Categorys returned successfully",
            allCategories,
        })
    }
    catch(error){
        console.log(error);
        return res.status(403).json({
            success:false,
            message:"Category access failed, please try again.",
        })
    }
}