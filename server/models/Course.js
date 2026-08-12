import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
    {
        title:{
            type: String,
            required: [true, "Lesson title is required"],
            trim: true,
        },
        videoUrl:{
            type: String,
            required: [true, "Lesson video URL is required"],
        },
        duration:{
            type: String,
        },
    },
    { _id: true}
);

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    thumbnail: {
      url: {
        type: String,
        required: [true, "Thumbnail is required"],
      },
      publicId: {
        type: String,
        required: true,
      },
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    instructor: {
      type: String,
      required: [true, "Instructor name is required"],
      trim: true,
    },
    lessons: {
      type: [lessonSchema],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;