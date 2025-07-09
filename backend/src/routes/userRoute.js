import express from "express";
import { getuserProfile, login, logout, register, updateProfile } from "../controllers/userController.js";
import isLoggedIn from "../middlewares/isLoggedIn.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/profile").get(isLoggedIn,getuserProfile) //isLoggedIn is the middleware
router.route("/logout").get(logout);
router.route("/profile/update").put(isLoggedIn,upload.single("profilePhoto"),updateProfile);

export default router;