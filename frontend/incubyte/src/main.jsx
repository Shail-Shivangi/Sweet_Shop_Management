// src/main.jsx

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { SweetProvider } from "./context/SweetContext";
import { MessageProvider } from "./context/MessageContext";
import { CartProvider } from "./context/CartContext"; // <-- NEW IMPORT
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    
    <MessageProvider>
      <AuthProvider>
        <SweetProvider>
          <CartProvider> {/* <-- ADDED CART PROVIDER */}
            <App />
          </CartProvider>
        </SweetProvider>
      </AuthProvider>
    </MessageProvider>
    
  </React.StrictMode>
);