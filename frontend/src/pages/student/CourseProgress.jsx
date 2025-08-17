import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  useCompleteCourseMutation,
  useGetCourseProgressQuery,
  useInCompleteCourseMutation,
  useUpdateLectureProgressMutation,
} from "@/features/api/courseProgressApi";
import { CheckCircle, CheckCircle2, CirclePlay } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const CourseProgress = () => {
  const params = useParams();
  const courseId = params.courseId;

  const { data, isLoading, isSuccess, error, isError, refetch } =
    useGetCourseProgressQuery(courseId);
  const [updateLectureProgress] = useUpdateLectureProgressMutation();
  const [
    completeCourse,
    { data: markCompleteData, isSuccess: completedSuccess },
  ] = useCompleteCourseMutation();
  const [
    inCompleteCourse,
    { data: markinCompleteData, isSuccess: inCompletedSuccess },
  ] = useInCompleteCourseMutation();
  const [currentLecture, setCurrentLecture] = useState(null);
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load course details</p>;

  const { courseDetails, progress, completed } = data.data;

  //initialize the first lecture if not exist
  const initailLecture =
    currentLecture || (courseDetails.lectures && courseDetails.lectures[0]);

  //check is a lecture is completed or not
  const isLectureCompleted = (lectureId) => {
    return progress.some((prog) => prog.lectureId === lectureId && prog.viewed);
  };

  //update lecture progress on clicking a lecture
  const handleLectureProgress = async (lectureId) => {
    //console.log(courseId, lectureId);
    await updateLectureProgress({ courseId, lectureId });
    refetch();
  };

  //select a specific video or lecture on clicking to watch
  const handleSelectLecture = (lecture) => {
    setCurrentLecture(lecture);
    handleLectureProgress(lecture?._id)
  };

  

  //handle course complete or incomplete
  const handleCompleteCourse = async () => {
    await completeCourse(courseId);
    refetch();
    if(completedSuccess){
      toast.success(markCompleteData.message);
    }
  };

  const handleInCompleteCourse = async () => {
    await inCompleteCourse(courseId);
    refetch();
    if(inCompletedSuccess){
      toast.success(markinCompleteData.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 mt-5">
      {/* Display Course Name */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">{courseDetails.courseTitle}</h1>
        <Button 
        variant={completed? "outline" :"default"}
        onClick={completed? handleInCompleteCourse : handleCompleteCourse}> {
          completed? <div className="flex items-center ">
          <CheckCircle className="h-4 w-4 mr-2"/><span>Completed</span>
          </div> : "Mark as completed"
        } </Button>
      </div>
      {/* Video Section */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4">
          {/* Yaha pe video ayega */}
          <div>
            <video
              src={currentLecture?.videoUrl || initailLecture.videoUrl}
              controls
              className="w-full h-auto md:rounded-lg"
              onPlay={() =>
                handleLectureProgress(currentLecture?._id || initailLecture._id)
              }
            />
          </div>
          {/* Display current watching lecture title */}
          <div className="mt-2">
            <h3 className="font-medium text-lg">{`Lecture ${
              courseDetails.lectures.findIndex(
                (lec) => lec._id === (currentLecture?._id || initailLecture._id)
              ) + 1
            } : ${
              currentLecture?.lectureTitle || initailLecture.lectureTitle
            }`}</h3>
          </div>
        </div>
        {/* Lecture sidebar */}
        <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-300 md:pl-4 pt-4 md:pt-0">
          <h2 className="font-semibold text-xl mb-4">Course Lectures</h2>
          <div className="flex-1 overflow-y-auto">
            {courseDetails?.lectures.map((lecture) => (
              <Card
                className={`mb-2 hover:cursor-pointer transition transform ${
                  lecture._id === currentLecture?._id
                    ? "bg-gray-200"
                    : "dark:bg-gray-800"
                }`}
                key={lecture._id}
                onClick={() => handleSelectLecture(lecture)}
              >
                <CardContent className="flex items-center justify-between ">
                  <div className="flex items-center">
                    {isLectureCompleted(lecture._id) ? (
                      <CheckCircle2 size={24} className="text-green-500 mr-2" />
                    ) : (
                      <CirclePlay className="text-gray-500 mr-2" />
                    )}
                    <div>
                      <CardTitle className="ml-3">
                        {lecture.lectureTitle}
                      </CardTitle>
                    </div>
                  </div>
                  {isLectureCompleted(lecture._id) && (
                    <Badge
                      variant={"outline"}
                      className="text-green-700 bg-green-200"
                    >
                      Completed
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
