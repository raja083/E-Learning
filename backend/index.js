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
import path from "path";

connectDB();
const app = express();
//default middlewares
const port = process.env.PORT || 4000;

const _dirname = path.resolve();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://e-learning-kgkm.onrender.com",
    credentials: true,
  })
);
//apis
app.use("/api/user", userRoute); //if user hits /api/user redirect him to userRoute
app.use("/api/course",courseRoute);
app.use("/api/media",mediaRoute);  //route to upload video on cloudinary
app.use("/api/purchase",purchaseRoute);
app.use("/api/progress",courseProgressRoute);


//serve frontend files
app.use(express.static(path.join(_dirname, "/frontend/dist")))
app.get('/{*any}',(_,res)=>{
  res.sendFile(path.resolve(_dirname,"frontend","dist","index.html"))
})
app.listen(process.env.PORT, () => {
  console.log(`Listening at port ${process.env.PORT}`);
});
