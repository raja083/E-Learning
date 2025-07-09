import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"

const COURSE_API = "https://e-learning-backend-lz6k.onrender.com/api/course"
export const courseApi = createApi({
    reducerPath:"courseApi",
    tagTypes:['Refetch_Creator_Course',"Refetch_Lecture"],//whenever a new course is created the getCourses should be refetched
    baseQuery:fetchBaseQuery({
        baseUrl:COURSE_API,
        credentials:'include'
    }),
    endpoints:(builder)=>({
        //mutation to create a course
        createCourse: builder.mutation({
            query:({courseTitle,category})=>({
                url:"/create-course",
                method:"POST",
                body:{courseTitle,category}
            }),
            invalidatesTags:['Refetch_Creator_Course']
        }),

        //mutation to get all the courses created by the admin
        getCreatorCourse: builder.query({
            query:()=>({
                url:"/get-courses",
                method:"GET",
            }),
            invalidatesTags:['Refetch_Creator_Course']
        }),

        editCourse: builder.mutation({
            query:({ formData,courseId })=>({
                url:`/update-course/${courseId}`,
                method:"PUT",
                body:formData
            }),
            invalidatesTags:['Refetch_Creator_Course']
        }),

        //to get the course details by id
        getCourseById: builder.query({
            query:(courseId)=>({
                url:`/get-course/${courseId}`,
                method:"GET",
            }),
            invalidatesTags:['Refetch_Creator_Course']
        }),
        //create a new lecture in the course
        createLecture: builder.mutation({
            query:({lectureTitle,courseId})=>({
                url:`/create-lecture/${courseId}`,
                method:"POST",
                body:{lectureTitle}
            }),
            invalidatesTags:['Refetch_Lecture']
        }),

        //get all the lectures of a particular course
        getLecturesById: builder.query({
            query:(courseId)=>({
                url:`/get-lectures/${courseId}`,
                method:"GET",
            }),
            invalidatesTags:['Refetch_Creator_Course']
        }),

        editLecture: builder.mutation({
            query:({lectureId,courseId,lectureTitle,videoInfo, isPreviewFree})=>({
                url:`/update-lecture/${courseId}/lecture/${lectureId}`,
                method:"POST",
                body:{lectureTitle, videoInfo, isPreviewFree}
            }),
            invalidatesTags:['Refetch_Creator_Course']
        }),

        removeLecture: builder.mutation({
            query:(lectureId)=>({
                url:`/remove-lecture/${lectureId}`,
                method:"DELETE",
            }),
            invalidatesTags:['Refetch_Lecture']
        }),
        //to get the course details by id
        getLectureById: builder.query({
            query:(lectureId)=>({
                url:`/get-lecture/${lectureId}`,
                method:"GET",
            }),
            invalidatesTags:['Refetch_Creator_Course']
        }),

        togglePublish: builder.mutation({
            query:({courseId,query})=>({
                url:`/${courseId}/?publish=${query}`,
                method:"PATCH"
            }),
            invalidatesTags:['Refetch_Creator_Course']
        }),

        //get all the published courses for home page
        getPublishedCourses: builder.query({
            query:()=>({
                url:"/allCourses",
                method:"GET"
            })
        }),

        //get the courses on searching
        getSearchCourse : builder.query({
            query:({searchQuery, categories, sortByPrice})=>{
                //build query string
                let queryString = `/search?query=${encodeURIComponent(searchQuery)}`
                //append category
                if(categories && categories.length>0){
                    const categoriesString = categories.map(encodeURIComponent).join(",")
                    queryString += `&categories=${categoriesString}`
                }
                //append sort by price
                if(sortByPrice){
                    queryString+= `&sortByPrice=${encodeURIComponent(sortByPrice)}`
                }

                return {
                    url:queryString,
                    method:"GET"
                }
            }
        })
    })
    


})

export const {useCreateCourseMutation ,useEditCourseMutation, useGetCreatorCourseQuery, useGetCourseByIdQuery, useCreateLectureMutation, useGetLecturesByIdQuery, useEditLectureMutation, useRemoveLectureMutation , useGetLectureByIdQuery , useTogglePublishMutation , useGetPublishedCoursesQuery,useGetSearchCourseQuery} = courseApi;
//useCreateCourseMutation is a hook automatically created by rtk query
