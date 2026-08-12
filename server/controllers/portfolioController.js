import Portfolio from "../models/Portfolio.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js"

// @desc   Create a new portfolio project (admin only)
// @route  POST /api/portfolio
export const createPortfolio = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;

    if (!req.file) {
      const error = new Error("Image is required");
      error.statusCode = 400;
      throw error;
    }

    const image = await uploadToCloudinary(req.file.buffer, "qorzen/portfolio");

    const project = await Portfolio.create({ title, description, image, category });

    res.status(201).json({
      success: true,
      message: "Portfolio project created successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get all active portfolio projects (public)
// @route  GET /api/portfolio
export const getPortfolios = async (req, res, next) => {
  try {
    const projects = await Portfolio.find({ isActive: true }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get single portfolio project by ID (public)
// @route  GET /api/portfolio/:id
export const getPortfolioById = async (req, res, next) => {
  try {
    const project = await Portfolio.findById(req.params.id);

    if (!project) {
      const error = new Error("Portfolio project not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Update a portfolio project (admin only)
// @route  PUT /api/portfolio/:id
export const updatePortfolio = async (req, res, next) => {
  try {
    const project = await Portfolio.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      const error = new Error("Portfolio project not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Portfolio project updated successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Delete a portfolio project (admin only)
// @route  DELETE /api/portfolio/:id
export const deletePortfolio = async (req, res, next) => {
  try {
    const project = await Portfolio.findByIdAndDelete(req.params.id);

    if (!project) {
      const error = new Error("Portfolio project not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Portfolio project deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};