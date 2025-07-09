import { combineReducers } from "@reduxjs/toolkit"
import authReducer from "../features/authSlice.js"
import { authApi } from "@/features/api/authApi"
import { courseApi } from "@/features/api/courseApi.js"
import { purchaseApi } from "@/features/api/purchaseApi.js"
import { courseProgressApi } from "@/features/api/courseProgressApi.js"
//since there will be multiple reducers across different slices and rtk query reducers So we need to combine them for easier export and import

const rootReducer = combineReducers({
    [authApi.reducerPath]:authApi.reducer, // rtk query reducer
    [courseApi.reducerPath]:courseApi.reducer, // rtk query reducer
    [purchaseApi.reducerPath]:purchaseApi.reducer,
    [courseProgressApi.reducerPath]:courseProgressApi.reducer,
    auth: authReducer             //authSlice reducer
})

export default rootReducer;