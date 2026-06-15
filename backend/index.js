import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./src/db.js";
import cors from "cors";
import userRoute from "./src/routes/userRoute.js";
import courseRoute from "./src/routes/courseRoute.js";
import cookieParser from "cookie-parser";
import mediaRoute from "./src/routes/mediaRoute.js";
import purchaseRoute from "./src/routes/purchaseRoute.js";
import courseProgressRoute from "./src/routes/courseProgressRoute.js";
import { stripeWebhook } from "./src/controllers/purchaseController.js";
import path from "path";

const app = express();
const port = process.env.PORT || 4000;
const _dirname = path.resolve();

// CORS configuration
app.use(
  cors({
    origin: "https://e-learning-kgkm.onrender.com",
    credentials: true,
  })
);

// Stripe webhook MUST come before express.json() so it can parse the raw body
app.use(
  "/api/purchase/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

// Default middlewares
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/user", userRoute);
app.use("/api/course", courseRoute);
app.use("/api/media", mediaRoute);
app.use("/api/purchase", purchaseRoute);
app.use("/api/progress", courseProgressRoute);

// Serve frontend files
app.use(express.static(path.join(_dirname, "/frontend/dist")));

// Catch-all route to serve the React app
app.get("*", (_, res) => {
  res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});

// Establish database connection FIRST, then start the server
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Database connected successfully. Server listening at port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed. Server not started.", err);
  });
