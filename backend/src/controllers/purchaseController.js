import Stripe from "stripe";
import { Course } from "../models/courseModel.js";
import { Lecture } from "../models/lectureModel.js";
import { CoursePurchase } from "../models/coursePurchase.js";
import { User } from "../models/userModel.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(400).json({
        message: "Course not found",
      });
    }

    //create a new course purchase record
    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "pending",
    });

    //create a stripe checkout session
    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: course.courseTitle,
              images: [course.courseThumbnail],
            },
            unit_amount: course.coursePrice * 100, // Amount in paise (lowest denomination)
          },
          quantity: 1,
        },
      ],
      mode: "payment",

      success_url: `${process.env.FRONTEND_URL}/course-progress/${courseId}`, // once payment successful redirect to course progress page
      // //bad mein change krna hai jab host krenge to `${process.env.FRONTEND_URL}/course-progress/${courseId}`
      cancel_url: `${process.env.FRONTEND_URL}/course-detail/${courseId}`,
      ////bad mein change krna hai jab host krenge to `${process.env.FRONTEND_URL}/course-detail/${courseId}`
      metadata: {
        courseId: courseId,
        userId: userId,
      },
      shipping_address_collection: {
        allowed_countries: ["IN"], // Optionally restrict allowed countries
      },
    });

    if (!session.url) {
      return res
        .status(400)
        .json({ success: false, message: "Error while creating session" });
    }

    //save the purchase record
    newPurchase.paymentId = session.id;
    await newPurchase.save();
    return res.status(200).json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.log(error);
  }
};

//stripe web hooks returns an object containing  the payment details like pending,success ,etc. and based on this we can redirect to the success or failure route
export const stripeWebhook = async (req, res) => {
  let event;

  try {
    // ✅ Use Stripe's actual signature header (not generateTestHeaderString)
    const sig = req.headers["stripe-signature"];

    // req.body is still raw buffer here because in routes you used express.raw()
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.WEBHOOK_ENDPOINT_SECRET
    );
  } catch (error) {
    console.error("❌ Webhook signature verification failed:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // ✅ Handle checkout.session.completed
  if (event.type === "checkout.session.completed") {
    console.log("✅ Checkout session completed event received");

    try {
      const session = event.data.object;

      // Find the purchase by Stripe session ID
      const purchase = await CoursePurchase.findOne({ paymentId: session.id })
        .populate({ path: "courseId" });

      if (!purchase) {
        console.error(`❌ No purchase found for session ID: ${session.id}`);
        return res.status(404).end();
      }

      // Update purchase status and amount
      purchase.status = "completed";
      if (session.amount_total) {
        purchase.amount = session.amount_total / 100; // Convert from paise
      }

      // Unlock all lectures for this course
      if (purchase.courseId?.lectures?.length > 0) {
        await Lecture.updateMany(
          { _id: { $in: purchase.courseId.lectures } },
          { $set: { isPreviewFree: true } }
        );
        console.log("🎯 Lectures unlocked for course:", purchase.courseId._id);
      }

      await purchase.save();

      // Add course to user's enrolled courses
      await User.findByIdAndUpdate(
        purchase.userId,
        { $addToSet: { enrolledCourses: purchase.courseId._id } }
      );

      // Add user to course's enrolled students
      await Course.findByIdAndUpdate(
        purchase.courseId._id,
        { $addToSet: { enrolledStudents: purchase.userId } }
      );

      console.log("✅ Purchase marked completed & course unlocked");
    } catch (error) {
      console.error("❌ Error processing webhook event:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    console.log(`ℹ️ Event type ${event.type} received but not handled`);
  }

  // Stripe requires a 200 response to acknowledge receipt
  res.status(200).send();
};

export const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const course = await Course.findById(courseId)
      .populate({ path: "creator" })
      .populate({ path: "lectures" });

    //check if the user has purchase or not
    const purchased = await CoursePurchase.findOne({userId, courseId});
    if(!course){
      return res.status(404).json({
        success:false,
        message:"Course not found"
      })
    }
    return res.status(200).json({
      course,
      purchased: purchased?true:false
    })
  } catch (error) {
    console.log(error);
  }
};

export const getAllPurchasedCourse = async (req,res)=>{
  try {
    const purchasedCourse = await CoursePurchase.find({status:"completed"}).populate("courseId")

    if(!purchasedCourse){
      return res.status(400).json({
        purchasedCourse:[]
      })
    }
    return res.status(200).json({
      purchasedCourse,
    })
  } catch (error) {
    console.log(error)
  }
}
