import Course from "../models/Course.js";
import User from "../models/User.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";
import razorpay from "../config/razorpay.js";
import crypto from "crypto";

// @desc   Create a new course (admin only)
// @route  POST /api/courses
export const createCourse = async (req, res, next) => {
  try {
    const { title, description, price, instructor, lessons } = req.body;

    if (!req.file) {
      const error = new Error("Thumbnail is required");
      error.statusCode = 400;
      throw error;
    }

    const thumbnail = await uploadToCloudinary(req.file.buffer, "qorzen/courses");

    const course = await Course.create({
      title,
      description,
      thumbnail,
      price,
      instructor,
      lessons,
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get all active courses (public) - lessons hidden, preview info only
// @route  GET /api/courses
export const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ isActive: true })
      .select("-lessons") // strip lesson content from the list view entirely
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get single course by ID
// @route  GET /api/courses/:id
// @access Public preview info always visible; lessons only visible if
//         the requester is logged in AND (has purchased OR is admin)
export const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      const error = new Error("Course not found");
      error.statusCode = 404;
      throw error;
    }

    const courseObj = course.toObject();

    const isAdmin = req.user?.role === "admin";
    const hasPurchased = req.user?.purchasedCourses?.some(
      (id) => id.toString() === course._id.toString()
    );

    if (!isAdmin && !hasPurchased) {
      delete courseObj.lessons; // hide locked content
    }

    res.status(200).json({
      success: true,
      hasAccess: isAdmin || hasPurchased,
      data: courseObj,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Update a course (admin only)
// @route  PUT /api/courses/:id
export const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!course) {
      const error = new Error("Course not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Delete a course (admin only)
// @route  DELETE /api/courses/:id
export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      const error = new Error("Course not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};


export const createOrder = async(req,res,next)=>{
  try {
    const course = await Course.findById(req.params.id)
    if(!course){
      const error = new Error("Course not found");
      error.statusCode = 404;
      throw error;
    }

    const alreadyPurchased = req.user.purchasedCourses.some(
      (id) => id.toString() === course._id.toString()
    );
    if (alreadyPurchased){
      const error = new Error("You already own this course")
      error.statusCode = 400;
      throw error
    }

    const options = {
      amount: course.price * 100,
      currency: "INR",
      receipt: `course_${course._id}_user_${req.user._id}`,
    };

    let order;
    try {
      order = await razorpay.orders.create(options);
    } catch (razorpayError) {
      const error = new Error("Payment gateway error - could not create order");
      error.statusCode = 502;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Order created successfully",
      data:{
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        courseId: course._id,
        key: process.env.RAZORPAY_KEY_ID,
      }
    })
  } catch (error) {
    next(error)
  }
}


export const verifyPayment = async (req,res,next) =>{
  try {
    const { razorpay_order_id, razorpay_payment_id, rayzorpay_signature}= req.body;

    const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

    if (generatedSignature !== rayzorpay_signature){
      const error = new Error("Payment verification failed");
      error.statusCode = 400;
      throw error
    }

    const course =  await Course.findById(req.params.id);

    if(!course){
      const error= new Error("Course not found")
      error.statusCode = 404;
      throw error;
    }

    const alreadyPurchased = req.user.purchasedCourses.some(
      (id) => id.toString() === course._id.toString()
    );

    if(!alreadyPurchased){
      req.user.purchasedCourses.push(course._id);
      await req.user.save()
    }

    res.status(200).json({
      success: true,
      message: "Payment verifies, course unlocked successfully",
      data: {
        courseId: course._id 
      },
    })
  } catch (error) {
    next(error)
  }
}