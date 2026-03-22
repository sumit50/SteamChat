import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import userRouter from "./src/userRoute.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/steamchat"

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // update to match frontend URL
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.get("/", (req, res) => {
  res.send("🚀 Server is running")
})

app.use("/api/users", userRouter)

// Connect to MongoDB and start server
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB")

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`)
    })
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error.message)
    process.exit(1)
  })
