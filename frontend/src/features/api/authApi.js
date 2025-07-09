//rtk query function is data fetching and caching responses automatically for faster response to api calls.

import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import { userLoggedIn, userLoggedOut } from "../authSlice";
//userLogged in is the instance or state of the logged in user

const USER_API = "https://e-learning-backend-lz6k.onrender.com/api/user"
export const authApi = createApi ({
    reducerPath:"authApi",
    baseQuery:fetchBaseQuery({
        baseUrl:USER_API,
        credentials: "include"
    }),

    endpoints:(builder) =>({   //routes
        registerUser : builder.mutation({ //query is used to fetch data while mutation is used to post data.
            query:(inputData) =>({
                url:"/register",  //USER_API/register
                method:"POST",
                body:inputData
            })
        }),
        loginUser : builder.mutation({
            query:(inputData) =>({
                url:"/login",
                method:"POST",
                body:inputData
            }),
            // function to execute when the query is started
            async onQueryStarted(arg, {queryFulfilled,dispatch}){
                try {
                    const result = await queryFulfilled;
                    dispatch(userLoggedIn({user:result.data.user}))
                    //dispatch the user slice and change the logged in user from null to result.data.user
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        loadUser : builder.query({ //query is used to fetch (get) data while mutation is used to post data.
            query:() =>({
                url:"/profile",  //USER_API/profile
                method:"GET",
            }),
             async onQueryStarted(_, {queryFulfilled,dispatch}){
                try {
                    const result = await queryFulfilled;
                    dispatch(userLoggedIn({user:result.data.user}))
                    //dispatch the user slice each time the page is reloaded of refreshed.
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        updateUser : builder.mutation({ //query is used to fetch (get) data while mutation is used to post data.
            query:(formData) =>({
                url:"/profile/update",  //USER_API/profile/update
                method:"PUT",
                body:formData
            })
        }),
        logOutuser: builder.mutation({  //logout is mutation because we are updating the state
            query:()=>({
                url:"/logout",
                method:"GET"
            }),

            async onQueryStarted(arg, {queryFulfilled,dispatch}){
                try {
                    dispatch(userLoggedOut())
                    //dispatch the user slice and change the logged in user to null
                } catch (error) {
                    console.log(error);
                }
            }
        })

    })
})


//The registerUser, loginUser, and loadUser are endpoint definitions, not reducers.
export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useLoadUserQuery,
    useUpdateUserMutation,
    useLogOutuserMutation
} = authApi; // both useRegisterUsermutation and useLoginuserMutation are hooks

// RTK Query returns an object with:
// {
//   data,
//   error,
//   isLoading,
//   isFetching,
//   isSuccess,
//   isError,
//   refetch,
//   ...
// }
// and all these data can be accessed while the api call is made and after it is completed.
