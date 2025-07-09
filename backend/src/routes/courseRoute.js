import express from "express";
import { createCourse, createLecture, getAllPublishedCourse, getCourseById, getCourses, getLectureById, getLectures, removeLecture, searchCourse, togglePublish, updateCourse, updateLecture } from "../controllers/courseController.js";
import isLoggedIn from "../middlewares/isLoggedIn.js";
import upload from "../utils/multer.js";
const router = express.Router();

router.route("/create-course").post(isLoggedIn ,createCourse);
router.route("/search").get(isLoggedIn,searchCourse)
router.route("/get-courses").get(isLoggedIn ,getCourses);
router.route("/update-course/:id").put(isLoggedIn,upload.single("courseThumbnail"),updateCourse)
router.route("/get-course/:id").get(isLoggedIn,getCourseById)

router.route("/create-lecture/:id").post(isLoggedIn,createLecture)
router.route("/get-lectures/:id").get(isLoggedIn,getLectures)
router.route("/get-lecture/:lectureId").get(isLoggedIn,getLectureById)
router.route("/update-lecture/:id/lecture/:lectureId").post(isLoggedIn,updateLecture)
router.route("/remove-lecture/:lectureId").delete(isLoggedIn,removeLecture)
router.route("/:id").patch(isLoggedIn,togglePublish)
router.route("/allCourses").get(getAllPublishedCourse)

export default router;

