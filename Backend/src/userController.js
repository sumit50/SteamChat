import { User } from "./userModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const createUser = async (req, res) => {
  const { name, email, password, userName } = req.body

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    // Create the user
    const newUser = await User.create({
      name,
      email,
      password: passwordHash,
      userName,
     
    })

    if (newUser) {
      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          userName: newUser.userName,
        },
      })
    } else {
      res.status(400).json({
        success: false,
        message: "Error creating user",
      })
    }
  } catch (error) {
    console.error("Register error:", error.message)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body

  try {
    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    // Set token in HTTP-only cookie
    

    // Update online status
    user.isOnline = true
    user.lastSeen = new Date()
    await user.save()

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        userName: user.userName,
        avatar: user.avatar,
        status: user.status,
      },
    })
  } catch (error) {
    console.error("Login error:", error.message)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}