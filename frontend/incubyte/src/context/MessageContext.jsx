// src/context/MessageContext.jsx

import React, { createContext, useContext, useState } from "react";
import { useEffect } from "react";

const MessageContext = createContext();

export function MessageProvider({ children }) {
  const [message, setMessage] = useState(null); // { text, type: 'success' | 'error' }

  // Automatically clear the message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
  };

  return (
    <MessageContext.Provider value={{ message, showMessage }}>
      {children}
      {message && <Toast message={message} />}
    </MessageContext.Provider>
  );
}

export function useMessages() {
  return useContext(MessageContext);
}

// Toast Component (Rendered directly in the Provider)
function Toast({ message }) {
  // FIXED: Removed all the invalid Tailwind-style utility classes.
  const typeClass = message.type === 'success' 
    ? "toast-success" 
    : "toast-error";
  
  return (
    // Combines the base positioning class with the type-specific color class
    <div className={`toast ${typeClass}`}>
      {message.text}
    </div>
  );
}