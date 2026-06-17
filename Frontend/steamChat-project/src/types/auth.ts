export interface User {
  _id: string;
  name: string;
  email: string;
  userName: string;
  avatar?: string;
  status?: string;
  isOnline?: boolean;
  lastSeen?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password?: string;
  userName: string;
}

export interface LoginData {
  email: string;
  password?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  data?: User;
}
