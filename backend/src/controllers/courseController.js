import { User } from "../models/userModel.js";
import { Course } from "../models/courseModel.js";
import { deleteMediaFromCloudinary, deleteVideoFromCloudinary, uploadMedia } from "../utils/cloudinary.js";
import { Lecture } from "../models/lectureModel.js";
//controller to create a course
export const createCourse = async (req, res) => {
  try {
    //user id is provided to the req by the isLoggedIn middleware
    const userId = req.id;
    const user = await User.findById(userId).select(-"password");
    const role = user.role;

    // check if the user is an instructor
    if (role !== "Instructor") {
      return res.status(400).json({
        success: false,
        message: "You are not authorised to create a course",
      });
    }

    const { courseTitle, category } = req.body;

    if (!courseTitle || !category) {
      return res.status(400).json({
        success: false,
        message: "Both course title and category required",
      });
    }

    const course = await Course.create({
      courseTitle,
      category,
      creator: userId,
    });

    return res.status(200).json({
      course,
      success: true,
      message: "Course created successfully",
    });
  } catch (error) {
    console.log("Error in createCourse controller", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create course",
    });
  }
};

//controller to get the courses created by the instructor

export const getCourses = async (req, res) => {
  try {
    const userId = req.id;

    const courses = await Course.find({ creator: userId });
    if (!courses) {
      return res.status(404).json({
        courses: [],
        success: true,
        message: "Courses not found",
      });
    }
    return res.status(200).json({
      courses,
      success: true,
      message: "Fetched the courses created by user",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in get courses controller",
    });
  }
};

//update a course
export const updateCourse = async (req, res) => {
  //get the id of the course from params

    try {
        const courseId = req.params.id;
        const {
        courseTitle,
        subTitle,
        description,
        category,
        courseLevel,
        coursePrice,
        } = req.body;
        const thumbnailPhoto = req.file;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(400).json({
                message: "Course not found",
                success: false,
            });
        }

        //to update profile photo we need to delete the previous one
        //extract publicId of the old image from the url if it exists
        //for every image or video uploaded on cloudinary , it has a unique public id
        let courseThumbnail;
        if (thumbnailPhoto) {
            if(course.courseThumbnail){
                const publicId = course.courseThumbnail.split("/").pop().split(".")[0]; //extract public id from the string of photo url
                await deleteMediaFromCloudinary(publicId);
            }
            //upload the thumbnail on cloudinary
            courseThumbnail = await uploadMedia(thumbnailPhoto.path);

        }
    
        const updatedData = {
        courseTitle,
        subTitle,
        description,
        category,
        courseLevel,
        coursePrice,
        courseThumbnail:courseThumbnail?.secure_url,
        };

        const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        updatedData,
        { new: true }
        ).select("-password");


        return res.status(200).json({
        success: true,
        user: updatedCourse,
        message: "Course updated successfully",
        });

    } catch (error) {
        console.log("Error in updateCourse controller",error);
        return res.status(500).json({
            success:false,
            message:"Failed to update course"
        })
    }
};


//controller to get the course details by its id
export const getCourseById = async (req,res) =>{
  try {

    const courseId = req.params.id;
    const course= await Course.findById(courseId);

    if(!course){
      return res.status(404).json(
        {
          message:"Course not found",
          success:false
        }
      )
    }
    //if got the course return it

    return res.status(200).json({
      course,
      success:true,
      message:"Course fetched successfully"
    })

  } catch (error) {
    console.log("Error in getCourseById controller",error);
      return res.status(500).json({
          success:false,
          message:"Failed to get course by id"
      })
  }
}

//controller to create a new lecture
export const createLecture = async (req,res) =>{

  try {
    //find the course in which lecture is to be uploaded
    const courseId = req.params.id;
    const course = await Course.findById(courseId);
    const {lectureTitle} = req.body;
    
    

    if(!course || !lectureTitle){
      return res.status(401).json({
        message:"Lecture title is required",
        success:false
      })
    }


    //create lecture
    const lecture = await Lecture.create({lectureTitle});
    //put the lecture inside the course model
    if(course){
      course.lectures.push(lecture._id);
      await course.save();
    }

    return res.status(201).json({
      lecture,
      message:"Lecture created successfully",
      success:true
    })


  } catch (error) {
    console.log("Error in createLecture controller",error);
      return res.status(500).json({
          success:false,
          message:"Failed to create lecture"
      })
  }
}


//get Lectures of a course

export const getLectures = async (req,res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId).populate("lectures")
    //if not populate only id of lecturs will be fetched. If populate all the details of each lecture is got.
    if(!course){
      return res.status(401).json({
        message:"Course not found",
        success:false
      }
      )
    }
    const lectures = course.lectures;
    //get the courses
    return res.status(200).json({
      lectures,
      success:"true",
      message:"Lectures fetched successfully"
    })

  } catch (error) {
    console.log("Error in getLectures controller",error);
      return res.status(500).json({
          success:false,
          message:"Failed to get lectures"
      })
  }
}


//update lecture and upload video of lecture 

export const updateLecture = async (req,res) =>{
   try {
    const lectureId =req.params.lectureId;
    const courseId = req.params.id;
    const lecture = await Lecture.findById(lectureId);
    if(!lecture){
      return res.status(401).json({
        success:false,
        message:"lecture not found"
      })
    }
    const {lectureTitle,videoInfo, isPreviewFree} = req.body;
    if(lectureTitle) lecture.lectureTitle = lectureTitle;
    if(videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
    if(videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
    if(isPreviewFree) lecture.isPreviewFree = isPreviewFree;
    await lecture.save();

    // Add the lecture in the course if it doesn't exist

    const course = await Course.findById(courseId);
    if(course && !course.lectures.includes(lecture._id)){
      course.lectures.push(lecture._id);
      await course.save();
    }

    return res.status(200).json({
      lecture,
      message:"Lecture updated successfully",
      success:true
    })

   } catch (error) {
    console.log("Error in updateLecture controller",error);
    return res.status(500).json({
          success:false,
          message:"Failed to update lecture"
      })
   }

}

//remove a lecture from a course
export const removeLecture = async (req,res) =>{
  try {
    const lectureId = req.params.lectureId;
    const lecture = await Lecture.findByIdAndDelete(lectureId);
    if(!lecture){
      return res.status(401).json({
        message:"Lecture already removed",
        success:false
      })
    }
    //now delete the videos uploaded in the lecture in cloudinary
    if(lecture.publicId){
      await deleteVideoFromCloudinary(lecture.publicId);
    }

    // Remove the lecture refernence from the associated course
    await Course.updateOne(
      {lectures:lectureId}, //find the course containing the lecture
      {$pull:{lectures:lectureId}} //remove the lecture id from the lecture array
    )

    return res.status(200).json({
      message:"Lecture removed successfully."
    })
  } catch (error) {
    console.log("Error in removeLecture controller",error);
    return res.status(500).json({
        success:false,
        message:"Failed to remove lecture"
    })
  }
}


//get a lecture by its id
export const getLectureById = async (req,res) =>{
  try {
    const lectureId = req.params.lectureId;
    const lecture = await Lecture.findById(lectureId);
    if(!lecture){
      res.status(404).json({
        message:"Lecture not found"
      })
    }

    return res.status(200).json({
      lecture,
      success:true,
      message:"Lecture found"
    })
  } catch (error) {
    console.log("Error in getLectureById controller",error);
    return res.status(500).json({
        success:false,
        message:"Failed to get lecture by id"
    })
  }
}

//toggle publish a course
export const togglePublish = async(req,res) =>{
  try {
    const courseId = req.params.id;
    const {publish} = req.query;
    const course = await Course.findById(courseId);
    if(!course){
      return res.status(404).json({
        message:"Course not found"
      })
    }
    course.isPublished = publish ==="true";
    await course.save();
    return res.status(200).json({
      course,
      message:"Course publish toggled",
      success:true
    })
  } catch (error) {
     console.log("Error in togglePublish controller",error);
    return res.status(500).json({
        success:false,
        message:"Failed to toggle publish"
    })
  }
}

//get all the published courses for homepage

export const getAllPublishedCourse = async (req,res) =>{
  try {
    const publishedCourses = await Course.find({isPublished:true}).populate({path:"creator", select:"name photoUrl"})
    return res.status(200).json({
      publishedCourses,
      message:"Fetched all the published courses",
      success:true
    })
  } catch (error) {
     console.log("Error in getAllPublishedCourse controller",error);
    return res.status(500).json({
        success:false,
        message:"Failed to get published courses"
    })
  }
  
}


//sending search result
export const searchCourse = async (req,res) =>{
  try {
    const {query="" , categories=[], sortByPrice=""} = req.query;
    //create search query 

    const searchCriteria = {
      isPublished:true,
      $or:[
        {courseTitle:{$regex:query, $options:"i"}},
        {subTitle:{$regex:query, $options:"i"}},
        {category:{$regex:query, $options:"i"}},

      ]
    }
    //if categories selected
    if(categories.length > 0){
      searchCriteria.category = {$in: categories}
    }

    //define sorting order
    const sortOptions = {};
    if(sortByPrice==="low"){
      sortOptions.coursePrice = 1;//sort by price in ascending order
    }
    else if(sortByPrice==="high"){
      sortOptions.coursePrice=-1; //descending order sorting
    }

    let courses = await Course.find(searchCriteria).populate({path:"creator", select:"name photoUrl"}).sort(sortOptions)

    return res.status(200).json({
      courses:courses || [],
      success:true
    })
  } catch (error) {
    console.log(error);
  }
}