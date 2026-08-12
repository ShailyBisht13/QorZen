import "dotenv/config";
console.log("Cloudinary key loaded:", process.env.CLOUDINARY_API_KEY ? "YES" : "NO");
import connectDB from "./config/db.js";
import app from "./app.js";

const PORT = process.env.PORT 

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});