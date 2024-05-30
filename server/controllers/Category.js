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
        const allCategories = await Category.find({}, {name:true}, {description:true});
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
        //get categoryId
        const { categoryId } = req.body;
    
        // Get courses for the specified category
        const selectedCategory = await Category.findById(categoryId)
          .populate("courses")
          .exec();
        console.log(selectedCategory);
        // Handle the case when the category is not found
        if (!selectedCategory) {
          console.log("Category not found.");
          return res
            .status(404)
            .json({ success: false, message: "Category not found" });
        }
        // Handle the case when there are no courses
        if (selectedCategory.courses.length === 0) {
          console.log("No courses found for the selected category.");
          return res.status(404).json({
            success: false,
            message: "No courses found for the selected category.",
          });
        }
    
        const selectedCourses = selectedCategory.courses;
    
        // Get courses for other categories
        const categoriesExceptSelected = await Category.find({
          _id: { $ne: categoryId },
        }).populate("courses");
        let differentCourses = [];
        for (const category of categoriesExceptSelected) {
          differentCourses.push(...category.courses);
        }
    
        // Get top-selling courses across all categories
        const allCategories = await Category.find().populate("courses");
        const allCourses = allCategories.flatMap((category) => category.courses);
        const mostSellingCourses = allCourses
          .sort((a, b) => b.sold - a.sold)
          .slice(0, 10);
    
        return res.status(200).json({
          success: true,
          data: {
            selectedCourses: selectedCourses,
            differentCourses: differentCourses,
            mostSellingCourses: mostSellingCourses,
          },
        });
    }catch(error){
        return res.status(500).json({
          success: false,
          message: "Internal server error",
          error: error.message,
        });
    }
}

//add course to category
exports.addCourseToCategory = async (req, res) => {
	const { courseId, categoryId } = req.body;
	// console.log("category id", categoryId);
	try {
		const category = await Category.findById(categoryId);
		if (!category) {
			return res.status(404).json({
				success: false,
				message: "Category not found",
			});
		}
		const course = await Course.findById(courseId);
		if (!course) {
			return res.status(404).json({
				success: false,
				message: "Course not found",
			});
		}
		if(category.courses.includes(courseId)){
			return res.status(200).json({
				success: true,
				message: "Course already exists in the category",
			});
		}
		category.courses.push(courseId);
		await category.save();
		return res.status(200).json({
			success: true,
			message: "Course added to category successfully",
		});
	}
	catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
}