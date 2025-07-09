import { createBrowserRouter } from "react-router-dom"
import MainLayout from "@/layout/MainLayout"
import HeroSection from "@/pages/student/HeroSection"
import Courses from "@/pages/student/Courses"
import Login from "@/pages/Login"
import MyLearning from "@/pages/student/MyLearning"
import Profile from "@/pages/student/Profile"
import Sidebar from "@/pages/admin/Sidebar"
import Dashboard from "@/pages/admin/Dashboard"
import CourseTable from "@/pages/admin/course/CourseTable"
import AddCourse from "@/pages/admin/course/AddCourse"
import EditCourse from "@/pages/admin/course/EditCourse"
import CreateLecture from "@/pages/admin/lecture/CreateLecture"
import EditLecture from "@/pages/admin/lecture/EditLecture"
import CourseDetail from "@/pages/student/CourseDetail"
import CourseProgress from "@/pages/student/CourseProgress"
import SearchPage from "@/pages/student/SearchPage"
import { AdminRoute, AuthenticatedUser, ProtectRoute } from "@/components/ProtectedRoutes"
import PurchasedCourseProtectedRoute from "@/components/PurchaseCourseProtectedRoute"


export const appRouter = createBrowserRouter([
    {
      path:"/",
      element:<MainLayout/>,
      children:[
        {
          path:"",
          element:(
          <>
            <HeroSection/>
            <Courses/>
          </>
          ),
        },
        {
          path:"login",
          element:<AuthenticatedUser><Login/></AuthenticatedUser>
        },
        {
          path:"my-learning",
          element: <ProtectRoute><MyLearning/></ProtectRoute>           
        },
        {
        path:"profile",
        element:<ProtectRoute><Profile/></ProtectRoute> 
        },
        {
        path:"course-details/:courseId",
        element: <ProtectRoute><CourseDetail/></ProtectRoute>              
        },
        {
          path:"course-progress/:courseId",
          element:<ProtectRoute>
          <PurchasedCourseProtectedRoute>
            <CourseProgress/>
          </PurchasedCourseProtectedRoute>
          </ProtectRoute>    
        },
        {
          path:"course/search",
          element:<ProtectRoute><SearchPage/></ProtectRoute> 
        }
        ,
        //admin routes here
        {
          path:"admin",
          element:<AdminRoute><Sidebar/></AdminRoute>,
          children:[
            {
              path:"dashboard",
              element:<Dashboard/>
            },
            {
              path:"course",
              element:<CourseTable/>,
            }
            ,
            {
              path:"course/create",
              element:<AddCourse/>,
            },
            {
              path:"course/:courseId",
              element:<EditCourse/>,
            },
            {
              path:"course/:courseId/lecture",
              element:<CreateLecture/>,
            },
            {
              path:"course/:courseId/lecture/:lectureId",
              element:<EditLecture/>,
            }
          ]
        }
      ]
    }
  ])