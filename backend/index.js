import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./src/db.js";
import cors from "cors";
import userRoute from "./src/routes/userRoute.js";
import courseRoute from "./src/routes/courseRoute.js"
import cookieParser from "cookie-parser";
import mediaRoute from "./src/routes/mediaRoute.js"
import purchaseRoute from "./src/routes/purchaseRoute.js"
import courseProgressRoute from "./src/routes/courseProgressRoute.js"
connectDB();
const app = express();
//default middlewares

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
//apis
app.use("/api/user", userRoute); //if user hits /api/user redirect him to userRoute
app.use("/api/course",courseRoute);
app.use("/api/media",mediaRoute);  //route to upload video on cloudinary
app.use("/api/purchase",purchaseRoute);
app.use("/api/progress",courseProgressRoute);


app.listen(process.env.PORT, () => {
  console.log(`Listening at port ${process.env.PORT}`);
});
