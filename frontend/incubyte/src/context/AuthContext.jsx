import React, { createContext, useContext, useState } from "react";
import API from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Store user object parsed from local storage
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("ss_user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  // Helper to save token and user data returned by the server
  function saveAuthData(data) {
    localStorage.setItem("ss_token", data.token);
    localStorage.setItem("ss_user", JSON.stringify(data.user));
    setUser(data.user);
  }

  async function register(payload) {
    try {
      const res = await API.post("/auth/register", payload); // POST /api/auth/register
      saveAuthData(res.data);
      return { ok: true };
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      return { ok: false, message };
    }
  }

  async function login(payload) {
    try {
      const res = await API.post("/auth/login", payload); // POST /api/auth/login
      saveAuthData(res.data);
      return { ok: true };
    } catch (error) {
      const message = error.response?.data?.message || "Invalid credentials";
      return { ok: false, message };
    }
  }
  async function fetchPurchaseHistory() {
    try {
        // CRITICAL: Ensure the endpoint URL is correct
        const res = await API.get("/profile/history"); 
        return { ok: true, history: res.data };
    } catch (error) {
        // ADDED DEBUG LOGGING
        console.error("API Error fetching history:", error.response || error);
        const message = error.response?.data?.message || "Failed to load history due to a server error.";
        return { ok: false, message };
    }
  }
  function logout() {
    localStorage.removeItem("ss_token");
    localStorage.removeItem("ss_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout, fetchPurchaseHistory }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}