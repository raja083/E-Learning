import { Badge } from "@/components/ui/badge";
import React from "react";
import { Link } from "react-router-dom";

const SearchResult = ({ course }) => {
    
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-300 py-4 gap-4">
      <Link
        to={`/course-details/${course._id}`}
        className="flex flex-col md:flex-row gap-4 w-full md:w-auto "
      >
        <img src={course?.courseThumbnail }  alt="course-thumbnail"
            className="h-32 w-full md:w-56 object-cover rounded"
        />
        <div className="flex flex-col gap-2">
        <h1 className="font-bold text-lg md:text-xl">{course.courseTitle}</h1>
        <p className="text-sm text-gray-600"> {course.subTitle}</p>
        <p className="text-sm text-gray-700">Instructor : <span className="font-bold">{course?.creator?.name}</span></p>
        <div className="flex gap-5">
          <Badge className="w-fit mt-2 md:mt-0">{course.courseLevel}</Badge>
          <p className="font-bold">₹{course?.coursePrice}</p>
        </div>
        
        </div>
      </Link>
    </div>
  );
};

export default SearchResult;
