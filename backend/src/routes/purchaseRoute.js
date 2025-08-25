import express from 'express';
import isLoggedIn from '../middlewares/isLoggedIn.js';
import { createCheckoutSession, getAllPurchasedCourse, getCourseDetailWithPurchaseStatus, getMySales, stripeWebhook } from '../controllers/purchaseController.js';

const router = express.Router();

router.route("/checkout/create-checkout-session").post(isLoggedIn,createCheckoutSession)
// router.route("/webhook").post(express.raw({type:"application/json"}),stripeWebhook)
router.route("/course/:courseId/detail-with-status").get(isLoggedIn,getCourseDetailWithPurchaseStatus);
router.route("/").get(isLoggedIn,getAllPurchasedCourse);
router.route("/getRevenue").get(isLoggedIn,getMySales);

export default router;
