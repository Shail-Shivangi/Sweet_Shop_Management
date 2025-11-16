import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";
import { useMessages } from "../context/MessageContext"; // <-- 1. NEW IMPORT

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const { showMessage } = useMessages(); // <-- 2. INITIALIZE useMessages
  const [form, setForm] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState(""); // State for error messages

  async function handle(e) {
    e.preventDefault();
    setErrorMsg(""); // Clear previous errors

    const res = await login(form); 
    
    if (res.ok) {
        // 3. CALL showMessage on successful login
        showMessage("Successfully logged in!", 'success');
        nav("/dashboard");
    } else {
        // Show the user the error message returned from AuthContext
        setErrorMsg(res.message || "Login failed due to an unexpected error.");
    }
  }

  return (
    <>
      <Navbar />
      <div className="auth-container">
        <form className="card form" onSubmit={handle}>
          <h2>Login</h2>
          {/* Display error message if present */}
          {errorMsg && (
            <div className="error-message">
              {errorMsg}
            </div>
          )}

          <input 
            placeholder="Email (e.g., admin@shop.com)" 
            value={form.email} 
            onChange={e => setForm({...form, email: e.target.value})} 
          />
          <input 
            placeholder="Password (e.g.,wxyz@123)" 
            type="password" 
            value={form.password} 
            onChange={e => setForm({...form, password: e.target.value})} 
          />
          <button className="btn">Login</button>
        </form>
      </div>
      
      {/* Adding CSS style for the error message, since alerts are forbidden */}
      <style>{`
        .error-message {
          padding: 10px;
          background-color: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
          border-radius: 8px;
          font-size: 14px;
        }
      `}</style>
      <Footer/>
    </>
  );
}