import Service from "../models/Service.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

// @desc   Create a new service (admin only)
// @route  POST /api/services
export const createService = async (req, res, next) => {
  try {
    const { title, description, features, priceStartingFrom } = req.body;

    if (!req.file) {
      const error = new Error("Image is required");
      error.statusCode = 400;
      throw error;
    }

    const image = await uploadToCloudinary(req.file.buffer, "qorzen/services");

    const service = await Service.create({
      title,
      description,
      image,
      features,
      priceStartingFrom,
    });

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: service,
    });
  } catch (error) {
    next(error);
  }
};


// @desc   Get all active services (public)
// @route  GET /api/services
export const getServices = async (req, res, next) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get single service by ID (public)
// @route  GET /api/services/:id
export const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      const error = new Error("Service not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};


// @desc   Update a service (admin only)
// @route  PUT /api/services/:id
export const updateService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return the updated document, not the old one
      runValidators: true, // re-run schema validation on update
    });

    if (!service) {
      const error = new Error("Service not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: service,
    });
  } catch (error) {
    next(error);
  }
};


// @desc   Delete a service (admin only)
// @route  DELETE /api/services/:id
export const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      const error = new Error("Service not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};