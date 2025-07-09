import express from 'express'
import isLoggedIn from "../middlewares/isLoggedIn.js"
import { getCourseProgress, markAsCompleted, markAsIncompleted, updateLectureProgress } from '../controllers/courseProgressController.js';


const router = express.Router();
router.route("/:courseId").get(isLoggedIn,getCourseProgress)
router.route("/:courseId/lecture/:lectureId/view").post(isLoggedIn,updateLectureProgress)

router.route("/:courseId/complete").post(isLoggedIn,markAsCompleted)
router.route("/:courseId/incomplete").post(isLoggedIn,markAsIncompleted)

export default router;