import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectGroup,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React from "react";

import { Textarea } from "@/components/ui/textarea";
import { Loader, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEditCourseMutation, useGetCourseByIdQuery, useTogglePublishMutation } from "@/features/api/courseApi";
import { toast } from "sonner";
import { useParams } from 'react-router-dom';


const CourseTab = () => {
  const params = useParams();
  const navigate  = useNavigate();
  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: "",
  })

  const courseId = params.courseId; //mind the spelling 

  const [editCourse, {data,error,isLoading,isSuccess}] = useEditCourseMutation();
  const {data:courseData, isLoading:courseIsLoading, refetch} = useGetCourseByIdQuery(courseId,{refetchOnMountOrArgChange:true});
  const [togglePublish]=useTogglePublishMutation();

  
  
   
  //change the status of publish whenever publish button is pressed
  const changePublishHandler = async (action) =>{
    try {
      const response = await togglePublish({courseId,query:action})
      if(response.data){
        refetch();
        toast.success(response.data.message)
      }
    } catch (error) {
      toast.error("Failed to toggle publish")
    }
  }
  
  const changeHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const selectCategory = (value) => {
    setInput({...input, category: value });
  };

  const selectCouseLevel = (value) => {
    setInput({...input, courseLevel: value });
  };

  //get thumbnail
  const selectThumbnail = (e) =>{
    const file = e.target.files?.[0];
    //convert the file to url
    if(file) {
        setInput({...input,courseThumbnail:file})
        const fileReader = new FileReader();
        fileReader.onloadend = () => setPreviewThumbnail(fileReader.result)
        fileReader.readAsDataURL
    }
  }



  //change the course details in backend
  const updateCourseHandler = async () =>{
    const formData = new FormData();
    formData.append("courseTitle" , input.courseTitle)
    formData.append("subTitle" , input.subTitle)
    formData.append("courseLevel" , input.courseLevel)
    formData.append("description" , input.description)
    formData.append("category" , input.category)
    formData.append("coursePrice" , input.coursePrice)
    formData.append("courseThumbnail" , input.courseThumbnail)
    await editCourse({formData, courseId});
  }



  

  //this useEffect is used to show the already present dat ain the inputs before editting the course
  useEffect(()=>{
    if(courseData?.course){
      const course = courseData?.course; //taking out the course from the response object
      setInput({
        courseTitle: course.courseTitle,
        subTitle: course.subTitle,
        description: course.description,
        category: course.category,
        courseLevel: course.courseLevel,
        coursePrice: course.coursePrice,
        courseThumbnail: "",
        })
    }
  },[courseData])


  useEffect(()=>{
    if(isSuccess){
      toast.success(data.message || "Course updated successfully")
    }
    if(error){
      toast.error(error.message || "Failed to update course")
    }
  },[isSuccess,error])

  if(courseIsLoading) return <Loader2 className="h-4 w-4 animate-spin"/>
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle>Basic Course Information</CardTitle>
            <CardDescription>
              Make changes to your courses here. Click save when done.
            </CardDescription>
          </div>
          <div className="space-x-2">
            <Button
              disabled={courseData?.course.lectures.length === 0}
              onClick={() =>
                changePublishHandler(courseData?.course.isPublished ? "false" : "true")
              }
              className={
                courseData?.course.isPublished
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-black text-white hover:bg-gray-900"
              }
            >
              {courseData?.course.isPublished ? "Unpublish" : "Publish"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4 mt-5">
          <div>
            <Label>Title</Label>
            <Input
              type="text"
              placeholder="Ex. Fullstack Development"
              name="courseTitle"
              value={input.courseTitle}
              onChange={changeHandler}
              className="mt-2"
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              type="text"
              placeholder="Become a full stack developer from zero to hero in two months"
              value={input.subTitle}
              onChange={changeHandler}
              name="subTitle"
              className="mt-2"
            />
          </div>

          <div>
            <Label>Desrcription</Label>
            <Textarea
            type="text"
              name="description"
              placeholder="Write the description of course...."
              className="mt-2"
              value={input.description}
              onChange={changeHandler}
            />
          </div>

          <div className="flex items-center gap-5">
            <div>
              <Label className="mb-2">Category</Label>
              <Select onValueChange={selectCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Next JS">Next JS</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Frontend Development">
                      Frontend Development
                    </SelectItem>
                    <SelectItem value="Fullstack Development">
                      Fullstack Development
                    </SelectItem>
                    <SelectItem value="Backend Development">
                      Backend Development
                    </SelectItem>
                    <SelectItem value="MERN Stack Development">
                      MERN Stack Development
                    </SelectItem>
                    <SelectItem value="Javascript">Javascript</SelectItem>
                    <SelectItem value="Python">Python</SelectItem>
                    <SelectItem value="Docker">Docker</SelectItem>
                    <SelectItem value="MongoDB">MongoDB</SelectItem>
                    <SelectItem value="HTML">HTML</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="mb-2">Course Level</Label>
            <Select onValueChange={selectCouseLevel}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a course level" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2">Price (in INR)</Label>
            <Input
              type="number"
              name="coursePrice"
              value={input.coursePrice}
              onChange={changeHandler}
              placeholder="Ex- 499"
            />
          </div>
          <div className="mt-2">
            <Label className="mb-2">Course Thumbnail</Label>
            <Input
            onChange={selectThumbnail} type="file" accept="image/*" className="w-fit" />
          </div>
        </div>
      </CardContent>

      <div className="mt-2 ml-5 flex gap-4">
            <Button onClick = {()=>navigate("/admin/course")} variant="outline">Cancel</Button>
            <Button disabled = {isLoading} onClick={updateCourseHandler}>
                {
                    isLoading?(
                        <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Please wait
                        </>
                    ): "Submit"
                }
            </Button>
          </div>
    </Card>
  );
};

export default CourseTab;
