import Testimonial from "../models/Testimonial.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

// @desc   Create a new testimonial (admin only)
// @route  POST /api/testimonials
export const createTestimonial = async (req, res, next) => {
  try {
    const { clientName, message } = req.body;

    if (!req.file) {
      const error = new Error("Photo is required");
      error.statusCode = 400;
      throw error;
    }

    const photo = await uploadToCloudinary(req.file.buffer, "qorzen/testimonials");

    const testimonial = await Testimonial.create({ clientName, message, photo });

    res.status(201).json({
      success: true,
      message: "Testimonial created successfully",
      data: testimonial,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get all active testimonials (public)
// @route  GET /api/testimonials
export const getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Update a testimonial (admin only)
// @route  PUT /api/testimonials/:id
export const updateTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!testimonial) {
      const error = new Error("Testimonial not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Testimonial updated successfully",
      data: testimonial,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Delete a testimonial (admin only)
// @route  DELETE /api/testimonials/:id
export const deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

    if (!testimonial) {
      const error = new Error("Testimonial not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};