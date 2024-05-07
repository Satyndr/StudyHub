const express = require("express");
const router = express.Router();

const {
    updateProfile,
    deleteProfile,
    getAllUserDetails,
    updateDisplayPicture,
    getEnrolledCourses
} = require("../controllers/Profile");
const {auth} = require("../middleware/auth");

router.delete("/deleteProfile", auth, deleteProfile)

router.put("/updateProfile", auth, updateProfile)

router.get("/getUserDetails", auth, getAllUserDetails)

//courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses)

router.put("/updateDisplayPicture", auth, updateDisplayPicture)