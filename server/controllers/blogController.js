import Blog from "../models/Blog.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

// @desc   Create a new blog post (admin only)
// @route  POST /api/blogs
export const createBlog = async (req, res, next) => {
  try {
    const { title, content, category, tags } = req.body;

    if (!req.file) {
      const error = new Error("Image is required");
      error.statusCode = 400;
      throw error;
    }

    const image = await uploadToCloudinary(req.file.buffer, "qorzen/blogs");

    const blog = await Blog.create({
      title,
      content,
      image,
      category,
      tags,
      author: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Blog post created successfully",
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get all active blog posts (public)
// @route  GET /api/blogs
export const getBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({ isActive: true })
      .populate("author", "name email") // pulls in author's name/email instead of just an ID
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get single blog post by slug (public)
// @route  GET /api/blogs/:slug
export const getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug }).populate("author", "name email");

    if (!blog) {
      const error = new Error("Blog post not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Update a blog post (admin only)
// @route  PUT /api/blogs/:id
export const updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!blog) {
      const error = new Error("Blog post not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Blog post updated successfully",
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Delete a blog post (admin only)
// @route  DELETE /api/blogs/:id
export const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      const error = new Error("Blog post not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};