import { Course } from "../models/courseModel.js";
import { CourseProgress } from "../models/courseProgressModel.js";

export const getCourseProgress = async (req,res) =>{
    try {
        const {courseId} = req.params;
        const userId = req.id;

        //step-1: Fetch the user course progress
        let courseProgress = await CourseProgress.findOne({courseId,userId}).populate("courseId");

        const courseDetails = await Course.findById(courseId).populate("lectures");

        if(!courseDetails){
            return res.status(404).json({
                message:"Course not found"
            })
        }

        //Step-2 : If no progress found. return course details with an empty progress.
        if(!courseProgress){
            return res.status(200).json({
                data:{
                    courseDetails,
                    progress:[],
                    completed:false
                }
            })
        }

        //step-3 return the user's course progress along with course details
          return res.status(200).json({
                data:{
                    courseDetails,
                    progress:courseProgress.lectureProgress,
                    completed:courseProgress.completed
                }
            })
        
    } catch (error) {
        console.log(error);
    }
}

export const updateLectureProgress = async(req,res)=>{
    try {
        const {courseId,lectureId} = req.params;
        const userId = req.id;
        //create course progress

        let courseProgress = await CourseProgress.findOne({courseId,userId})
          if(!courseProgress){

            //if no course progress exist,create a new progress
            courseProgress =  new CourseProgress({
                userId,
                courseId,
                completed:false,
                lectureProgress:[],
            })
        }
        //find lectures progress in the course progress
        const lectureindex = courseProgress.lectureProgress.findIndex((lecture)=> lecture.lectureId === lectureId)

        //IF LECTURE PROGRESS exists update its status
        if(lectureindex !==-1){
            courseProgress.lectureProgress[lectureindex].viewed=true;
        }else{
            //add new lecture progress
            courseProgress.lectureProgress.push({
                lectureId,
                viewed:true
            })
        }
        //if all lectures are viewed turn the course progress to complete

        //returns an array of viewed lectures
        const lectureProgressLength = courseProgress.lectureProgress.filter((lectureProg)=>lectureProg.viewed).length

        const course = await Course.findById(courseId);
        if(lectureProgressLength===course.lectures.length){
            courseProgress.completed = true;
        }
        await courseProgress.save();
        return res.status(200).json({
            message:"Lecture proress updated successfully",
        })

    } catch (error) {
        console.log(error);
    }
}

export const markAsCompleted = async (req,res) =>{
    try {
        const {courseId} = req.params;
        const userId = req.id;
        const courseProgress = await CourseProgress.findOne({courseId,userId});

        if(!courseProgress){
            return res.status(404).json({message:"Course Progress not found"})
        }

        //turn all the lectures in the course to viewed
        courseProgress.lectureProgress.map((lectureProgress)=>lectureProgress.viewed = true);
        courseProgress.completed=true;
        await courseProgress.save();
        return res.status(200).json({
            message:"Course marked as completed"
        })
    } catch (error) {
        console.log(error);
    }
}

export const markAsIncompleted = async (req,res) =>{
    try {
        const {courseId} = req.params;
        const userId = req.id;
        const courseProgress = await CourseProgress.findOne({courseId,userId});

        if(!courseProgress){
            return res.status(404).json({message:"Course Progress not found"})
        }

        //turn all the lectures in the course to viewed
        courseProgress.lectureProgress.map((lectureProgress)=>lectureProgress.viewed = false);
        courseProgress.completed = false;
        await courseProgress.save();
        return res.status(200).json({
            message:"Course marked as incompleted"
        })
    } catch (error) {
        console.log(error);
    }
}

