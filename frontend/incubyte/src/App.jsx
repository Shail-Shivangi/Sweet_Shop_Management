import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SweetDetails from "./pages/SweetDetails";
import AdminPanel from "./pages/AdminPanel";
import AddSweet from "./pages/AddSweet";
import EditSweet from "./pages/EditSweet";
import ProtectedRoute from "./components/ProtectedRoute";
import Cart from "./pages/Cart"; // <-- NEW IMPORT
import Profile from "./pages/Profile"; // <-- NEW IMPORT
import { useAuth } from "./context/AuthContext";

export default function App() {
  // simple guard: only show admin pages if auth user is admin
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sweet/:id" element={<SweetDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route 
          path="/profile" 
          element={<ProtectedRoute><Profile /></ProtectedRoute>} 
        />

        <Route
          path="/admin"
          element={<ProtectedRoute adminOnly={true}><AdminPanel /></ProtectedRoute>}
        />
        <Route
          path="/admin/add"
          element={<ProtectedRoute adminOnly={true}><AddSweet /></ProtectedRoute>}
        />
        <Route
          path="/admin/edit/:id"
          element={<ProtectedRoute adminOnly={true}><EditSweet /></ProtectedRoute>}
        />
      </Routes>
    </BrowserRouter>
  );
}
