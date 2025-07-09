import { useGetCourseByIdQuery } from "@/features/api/courseApi";
import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi";
import { useParams, Navigate } from "react-router-dom";

const PurchasedCourseProtectedRoute = ({children}) =>{
    const {courseId} = useParams();
    const {data, isLoading} = useGetCourseDetailWithStatusQuery(courseId);
    if(isLoading) return <p>Loading...</p>

    return data?.purchased ? children : <Navigate to={`/course-details/${courseId}`} />
}

export default PurchasedCourseProtectedRoute;