import { io, Socket } from "socket.io-client";

// Dynamically resolve the backend host to support local network testing
const backendHost = typeof window !== "undefined" ? window.location.hostname : "localhost";

export const socket: Socket = io(`http://${backendHost}:5000`, {
  withCredentials: true,
});

