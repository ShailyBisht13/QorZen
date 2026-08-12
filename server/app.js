import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";
import errorMiddleware from "./middleware/errorHandler.js";
import serviceRoutes from "./routes/serviceRoutes.js"
import portfolioRoutes from "./routes/portfolioRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";

const app = express();

app.use(helmet());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: "Too many requests, please try again later.",
  },
});

app.use(limiter);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("QorZen API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes)
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/courses", courseRoutes);

app.use(errorMiddleware);

export default app;