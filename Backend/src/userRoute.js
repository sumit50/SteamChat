import { Router } from "express"
import { createUser, loginUser } from "./userController.js"

const router = Router()

router.post("/register", createUser)
router.post("/login", loginUser)

// Simple GET endpoint to test connectivity and authorization
router.get("/profile", (req, res) => {
  res.json({
    success: true,
    message: "Profile data fetched successfully!",
    data: {
      id: "test-123",
      role: "User",
      permissions: ["read", "write"]
    }
  })
})

export default router

