const express = require("express")
const router = express.Router()

// Import the Controllers

const {
  createCourse,
  showAllCourses,
  getCourseDetails,
  editCourse,
  getInstructorCourses,
  getFullCourseDetails,
  markLectureAsComplete,
} = require("../controllers/Course")

const {
  showAllCategories,
  createCategory,
  categoryPageDetails,
  addCourseToCategory,
} = require("../controllers/Category")

const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section")

const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/SubSection")

const {
  createRating,
  averageRating,
  showAllRating,
} = require("../controllers/RatingAndReview")

// Importing Middlewares
const { auth, isInstructor, isStudent, isAdmin } = require("../middleware/auth")

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, createCourse)
// Edit a Course
router.post("/editCourse", auth, isInstructor, editCourse)
//Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection)
// Update a Section
router.post("/updateSection", auth, isInstructor, updateSection)
// Delete a Section
router.post("/deleteSection", auth, isInstructor, deleteSection)
// Edit Sub Section
router.post("/updateSubSection", auth, isInstructor, updateSubSection)
// Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)
// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubSection)
// Get all Registered Courses
router.get("/getAllCourses", showAllCourses)
// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails)
// Get all Courses of a Specific Instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
//Get full course details
router.post("/getFullCourseDetails", auth, getFullCourseDetails)
//mark lecture as complete
router.post("/updateCourseProgress", auth, isStudent, markLectureAsComplete);

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategories)
router.post("/getCategoryPageDetails", categoryPageDetails)
router.post("/addCourseToCategory", auth, isInstructor, addCourseToCategory);

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", averageRating)
router.get("/getReviews", showAllRating)

module.exports = router