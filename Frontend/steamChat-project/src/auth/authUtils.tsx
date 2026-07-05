const TOKEN_KEY = "token";
const USER_KEY = "user";

export const authStorage = {
  // Get the token
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Save the token
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // Remove the token
  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  // Get the current user info
  getUser<T>(): T | null {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  // Save user info
  setUser(user: any): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // Clear all auth data (e.g., on logout)
  clearAuth(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};
