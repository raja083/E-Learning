import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateLectureMutation, useGetLecturesByIdQuery } from "@/features/api/courseApi";
import { toast } from "sonner";
import Lecture from "./Lecture";

const CreateLecture = () => {
  const navigate = useNavigate();
  const [lectureTitle, setLectureTitle] = useState("");
  const params = useParams();
  const courseId = params.courseId;

  const [createLecture, { error, isLoading, data , isSuccess}] =
    useCreateLectureMutation();

  //get all the lectures of the course
  const {data:lectureData , isLoading:lectureLoading ,isError:lectureError, refetch} = useGetLecturesByIdQuery(courseId);

  

  //create a new lecture
  const createLectureHandler = async () => {
    await createLecture({ lectureTitle, courseId });
  };


  useEffect(()=>{
    if(isSuccess) toast.success(data.message || "Lecture created");
    refetch();
    if(error) toast.error(error.data.message || "Could not create lecture")
  },[isSuccess, error])

  return (
    <div className="flex-1 mx-10">
      <div className="mb-4">
        <h1 className="font-bold">Let's add lectures to your course.</h1>
        <p className="text-sm"></p>
      </div>
      <div className="space-y-4 ">
        <div>
          <Label className="pb-2">Title</Label>
          <Input
            type="text"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            placeholder="Enter video title"
          />
        </div>
        <div className="flex items-center gap-5">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/course/${courseId}`)}
          >
            Back to course
          </Button>

          {/* create a new course on the clicking of the button */}
          <Button disabled={isLoading} onClick={createLectureHandler}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please Wait
              </>
            ) : (
              "Create Lecture"
            )}
          </Button>
        </div>

        <div>
          {
            lectureLoading?( <p>Loading lectures..</p> ): lectureError ? ( <p>Failed to load lectures</p>) :
            lectureData.lectures.length === 0?( <p>"No lectures available"</p>) : (
              lectureData.lectures.map((lecture, index) =>(
                <Lecture key={lecture._id} lecture ={lecture} index = {index}  courseId = {courseId}/>
              ))
            )
          }
        </div>
      </div>
    </div>
  );
};

export default CreateLecture;
