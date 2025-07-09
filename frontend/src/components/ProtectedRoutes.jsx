import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom";

//if user is not logged in he can only visit the homepage
export const ProtectRoute = ({children})=>{
    const {isAuthenticated} = useSelector(store=>store.auth);
    if(!isAuthenticated){
        return <Navigate to="/login" />
    }

    return children;
}

//a logged in user should not go to the login page
export const AuthenticatedUser = ({children}) =>{
    const {isAuthenticated} = useSelector(store=>store.auth);
    if(isAuthenticated){
        return <Navigate to="/" />
    }

    return children;
}

//a normal user cannot go to dashboard
export const AdminRoute = ({children}) =>{
    const {user, isAuthenticated} = useSelector(store=>store.auth)
    if(!isAuthenticated){
        return <Navigate to="/login" />
    }

    if(user.role !== "Instructor"){
        return <Navigate to="/" />
    }

    return children;
}