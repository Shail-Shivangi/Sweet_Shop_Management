import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useMessages } from "../context/MessageContext";

// Password Validation Rules
const MIN_LENGTH = 8;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

function validatePassword(password) {
  if (password.length < MIN_LENGTH) {
    return `Password must be at least ${MIN_LENGTH} characters long.`;
  }
  if (!PASSWORD_REGEX.test(password)) {
    return 'Password must include at least one uppercase letter, one lowercase letter, and one number.';
  }
  return null; // Valid
}


export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const { showMessage } = useMessages();
  const [form, setForm] = useState({ name: "", email: "", mobile: "", password: "", confirmPassword: "" });
  const [errorMsg, setErrorMsg] = useState(""); 

  async function handle(e) { 
    e.preventDefault();
    setErrorMsg("");

    // 1. Check if passwords match (Existing logic)
    if (form.password !== form.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    
    // 2. Perform the new password complexity validation
    const passwordError = validatePassword(form.password);
    if (passwordError) {
      setErrorMsg(passwordError);
      return;
    }
    
    // Destructure necessary fields for API call
    const { name, email, mobile, password } = form;

    const res = await register({ name, email, mobile, password }); 
    
    if (res.ok) {
        showMessage("Registration successful! Welcome to the Sweet Shop.", 'success');
        nav("/dashboard");
    } else {
        // FAILURE: Display error message on the form
        setErrorMsg(res.message || "Registration failed. Please try again.");
    }
  }

  return (
    <>
      <Navbar />
      <div className="auth-container">
        <form className="card form" onSubmit={handle}>
          <h2>Register</h2>
          {/* Display error message if present */}
          {errorMsg && (
            <div className="error-message">
              {errorMsg}
            </div>
          )}
          <input 
            placeholder="Full name" 
            value={form.name} 
            onChange={e => setForm({...form, name: e.target.value})} 
          />
          <input 
            placeholder="Email" 
            value={form.email} 
            onChange={e => setForm({...form, email: e.target.value})} 
          />
          <input 
            placeholder="Mobile Number" 
            value={form.mobile} 
            onChange={e => setForm({...form, mobile: e.target.value})} 
            type="tel"
          />
          <input 
            placeholder="Password (Min 8 chars, including upper, lower, and number)" 
            type="password" 
            value={form.password} 
            onChange={e => setForm({...form, password: e.target.value})} 
          />
          <input 
            placeholder="Confirm Password" 
            type="password" 
            value={form.confirmPassword} 
            onChange={e => setForm({...form, confirmPassword: e.target.value})} 
          />
          <button className="btn">Register</button>
        </form>
      </div>
      <Footer/>
    </>
  );
}