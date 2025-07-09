import { configureStore } from "@reduxjs/toolkit";

import rootReducer from "./rootReducer.js";
import { authApi } from "@/features/api/authApi.js";
import { courseApi } from "@/features/api/courseApi.js";
import { purchaseApi } from "@/features/api/purchaseApi.js";
import { courseProgressApi } from "@/features/api/courseProgressApi.js";


export const appStore = configureStore({ //create the store named appStore

    reducer: rootReducer, //combining all the reducers inrootReducer
    middleware:(defaultMiddleware) => defaultMiddleware().concat(authApi.middleware , courseApi.middleware, purchaseApi.middleware , courseProgressApi.middleware) // Add RTK Query's middleware for caching, subscriptions, etc.
})

const initialiseApp = async ()=>{
    await appStore.dispatch(authApi.endpoints.loadUser.initiate({},
        {forceRefetch:true}
    ))
}

initialiseApp();