import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import userRoute from "./src/userRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/steamchat";

// Middleware
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());

// Routes
app.use("/api/users", userRoute);

// Test route
app.get("/", (req, res) => {
  res.send("🚀 Server is running");
});

//  Create HTTP server
const server = http.createServer(app);

// ✅ Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  },
});

// Active user tracking broadcast helper
const broadcastActiveUsers = async (chatId) => {
  try {
    const sockets = await io.in(chatId).fetchSockets();
    // Filter and map socket users
    const activeUsers = Array.from(
      new Map(
        sockets
          .map((s) => s.user)
          .filter(Boolean)
          .map((u) => [u._id || u.userName, u])
      ).values()
    );
    io.to(chatId).emit("activeUsers", activeUsers);
  } catch (err) {
    console.error("Error broadcasting active users:", err.message);
  }
};

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // Join chat room with user metadata
  socket.on("join", ({ chatId, user }) => {
    socket.join(chatId);
    socket.user = user; // Store user details in socket connection
    socket.currentChatId = chatId;
    console.log(`👤 User ${user?.userName || socket.id} joined room: ${chatId}`);

    // Broadcast system message that user joined
    if (user) {
      socket.to(chatId).emit("receiveMessage", {
        message: `${user.name || user.userName} joined the chat`,
        time: new Date(),
        isSystem: true,
      });
    }

    // Update active users lists
    broadcastActiveUsers(chatId);
  });

  // Send message with rich sender metadata
  socket.on("sendMessage", ({ chatId, message, user }) => {
    socket.to(chatId).emit("receiveMessage", {
      message,
      time: new Date(),
      senderName: user?.name,
      senderUserName: user?.userName,
      senderAvatar: user?.avatar,
      isSystem: false,
    });
  });

  // Typing indicator
  socket.on("typing", ({ chatId, userName }) => {
    socket.to(chatId).emit("typing", userName);
  });

  // Disconnection handler
  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
    const chatId = socket.currentChatId;
    const user = socket.user; 
    if (chatId && user) {
      // Send system message that user left
      socket.to(chatId).emit("receiveMessage", {
        message: `${user.name || user.userName} left the chat`,
        time: new Date(),
        isSystem: true,
      });
      // Update active users list
      broadcastActiveUsers(chatId);
    }
  });
});

// Connect DB + start server
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log(" Connected to MongoDB");

    server.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(" DB Error:", err.message);
  });