import { io, Socket } from "socket.io-client";

// Dynamically resolve the backend host to support local network testing
const backendHost = typeof window !== "undefined" ? window.location.hostname : "localhost";

// In production, use VITE_API_URL (excluding the '/api' suffix) as the socket host
const socketUrl = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "")
  : `http://${backendHost}:5000`;

export const socket: Socket = io(socketUrl, {
  withCredentials: true,
});

