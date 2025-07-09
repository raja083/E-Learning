import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectGroup,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useCreateCourseMutation } from "@/features/api/courseApi";
import { toast } from "sonner";

function AddCourse() {
  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("");
  const [createCourse, { data, error, isLoading, isSuccess }] =
    useCreateCourseMutation();

  const navigate = useNavigate();

  //get the category from select dropdown
  const getSelectedCategory = (value) => {
    setCategory(value);
  };

  //create the course
  const createCourseHandler = async () => {
    await createCourse({ courseTitle, category });
  };

  //for displaying the toast message
  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Course created successfully");
      navigate("/admin/course")
    } else if (error) {
      toast.error(error?.data?.message || "Error while creating course");
    }
  }, [isSuccess, error, data]);

  return (
    <div className="flex-1 mx-10">
      <div className="mb-4">
        <h1 className="font-bold">Let's add course.</h1>
        <p className="text-sm">
          Add some basic course details for your new course.
        </p>
      </div>
      <div className="space-y-4 ">
        <div>
          <Label className="pb-2">Title</Label>
          <Input
            type="text"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            placeholder="Enter course name"
          />
        </div>
        <div>
          <Label className="pb-2">Category</Label>
          <Select onValueChange={getSelectedCategory}>
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
        <div className="flex items-center gap-5">
          <Button variant="outline" onClick={() => navigate("/admin/course")}>
            Back
          </Button>

          {/* create a new course on the clicking of the button */}
          <Button disabled={isLoading} onClick={createCourseHandler}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please Wait
              </>
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AddCourse;
