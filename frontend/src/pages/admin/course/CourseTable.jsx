//contains all the courses created by the instructor and gives options to edit or modify them.

import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { redirect, useNavigate } from 'react-router-dom'
import { useGetCreatorCourseQuery } from '@/features/api/courseApi'


//sample data for table

const CourseTable = () => {
  const {data,isLoading, refetch} = useGetCreatorCourseQuery();
  const navigate = useNavigate();

  useEffect(()=>{
    refetch();
  },[])

  if(isLoading) return <h1>Loading...</h1>
  return (
    <div>
      <Button onClick={()=>navigate("/admin/course/create")}>Create New Course</Button>
        <Table>
      <TableCaption>A list of your recent courses.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="text-gray-500">Title</TableHead>
          <TableHead className="text-gray-500">Price</TableHead>
          <TableHead className="text-gray-500">Status</TableHead>
          <TableHead className="text-right text-gray-500">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.courses.map((course) => (
          <TableRow key={course._id}>
            <TableCell className="font-medium">{course.courseTitle}</TableCell>
            <TableCell>{course?.coursePrice || "NA"}</TableCell>
            <TableCell>{
              course.isPublished ? <><Button className="bg-green-200 text-green-700 hover:bg-green-200 h-6 shadow-md">Published</Button></> : <Button className="bg-red-200 text-red-700 hover:bg-red-200 h-6 shadow-md">Draft</Button>
            }</TableCell>


            <TableCell className="text-right"><Button className=
            "bg-white shadow-sm text-black hover:bg-gray-200" onClick={()=>navigate(`${course._id}`)}>Edit</Button></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </div>
  )
}

export default CourseTable
