import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import {
  useEditLectureMutation,
  useGetCourseByIdQuery,
  useGetLectureByIdQuery,
  useRemoveLectureMutation,
} from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
const MEDIA_API = "https://e-learning-kgkm.onrender.com/api/media";

const LectureTab = () => {
  const [title, setTitle] = useState("");
  const params = useParams();

  const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
  const [isFree, setIsFree] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); //video kitna percent upload ho gya h
  const [btnDisable, setBtnDisable] = useState(true); //button inside video enabled only when the video is uploaded

  const [editLecture, { data, error, isSuccess }] = useEditLectureMutation();

  const [
    removeLecture,
    {
      isSuccess: removeIsSuccess,
      error: removeError,
      data: removeData,
      isLoading: removeLoading,
    },
  ] = useRemoveLectureMutation();
  const {
    getLectureById,
    isSuccess: lectureSuccess,
    data: lectureData,
    error: lectureError,
  } = useGetLectureByIdQuery(params.lectureId);

  const lecture = lectureData?.lecture;

  //to upload the video
  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      setMediaProgress(true);

      try {
        const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
          //to show how much percent uploaded
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total));
          },
        });

        if (res.data.success) {
          setUploadVideoInfo({
            videoUrl: res.data.data.url,
            publicId: res.data.data.public_id,
          });
          setBtnDisable(false);
          toast.success(res.data.message);
        }
      } catch (error) {
        console.log("Error:", error);
        toast.error("Video upload failed");
      } finally {
        setMediaProgress(false);
      }
    }
  };

  // to edit the lecture in backend
  const editLectureHandler = async () => {
    await editLecture({
      lectureTitle: title,
      videoInfo: uploadVideoInfo,
      courseId: params.courseId,
      lectureId: params.lectureId,
      isPreviewFree: isFree,
    });
  };

  // to remove a lecture from a course
  const removeLectureHandler = async () => {
    await removeLecture(params.lectureId);
  };

  useEffect(() => {
    if (lecture) {
      setTitle(lecture.lectureTitle);
      setIsFree(lecture.isPreviewFree);
      setUploadVideoInfo(lecture.videoInfo);
    }
  }, [lecture]);
  useEffect(() => {
    if (removeIsSuccess) {
      toast.success(removeData.message || "Lecture removed");
    }
    if (removeError) {
      toast.error(removeError.data.message || "Can't remove lecture");
    }
  }, [lectureSuccess, lectureError]);
  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Lecture updated");
    }
    if (error) {
      toast.error(error.data.message);
    }
  }, [isSuccess, error]);
  return (
    <Card>
      <CardHeader className="flex justify-between">
        <div>
          <CardTitle>Edit Lecture</CardTitle>
          <CardDescription>
            Make changes and click save when done.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="destructive" onClick={removeLectureHandler}>
            {removeLoading ? (
              <>
                <Loader2 className="mr-2 h-4 animate-spin" /> Please Wait
              </>
            ) : (
              "Remove Lecture"
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Label className="mb-2">Title</Label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex. Introduction to Javascript"
          />
        </div>
        <div className="mb-4">
          <Label className="mb-2">
            Video<span className="text-red-500">*</span>
          </Label>
          <Input
            className="w-fit"
            type="file"
            accept="video/*"
            onChange={fileChangeHandler}
          />
        </div>
        <div className="flex items-center space-x-2 my-5">
          <Switch
            checked={isFree}
            onClick={() => {
              setIsFree(!isFree);
            }}
            id="free-video"
          />
          <Label>Is this video FREE?</Label>
        </div>
        {mediaProgress && (
          <div className="my-4">
            <Progress value={uploadProgress} />
            <p>{uploadProgress}% uploaded</p>
          </div>
        )}
        <div className="mt-4">
          <Button onClick={editLectureHandler}>Update Lecture</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LectureTab;
