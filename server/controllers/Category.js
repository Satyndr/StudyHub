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

//category page details
exports.categoryPageDetails = async(req, res)=>{
    try{
        //fetch category id
        const {categoryId} = req.body;
        //get courses for specified category id
        const selectedCategory = await Category.findById(categoryId)
        .populate("courses").exec();
        //validation
        if(!selectedCategory){
            return res.status(404).json({
                success:false,
                message:"Data not found",
            });
        }
        //get courses for different categories
        const differentCategories = await Category.find({
            _id: {$ne: categoryId}
        }).populate("courses").exec();
        
        //get top selling courses
        
        //return response
        return res.status(200).json({
            success:true,
            data:{
                selectedCategory,
                differentCategories,
            },
        })
    }
    catch(error){
        console.log(error);
        return res.status(400).json({

        })
    }
}