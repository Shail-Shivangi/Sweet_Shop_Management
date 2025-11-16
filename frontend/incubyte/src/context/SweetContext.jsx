import React, { createContext, useContext, useEffect, useState } from "react";
import API from "../api";
import { useMessages } from "./MessageContext";
import { useAuth } from "./AuthContext"; 

const SweetContext = createContext();

export function SweetProvider({ children }) {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showMessage } = useMessages();
  const { user } = useAuth(); // Get user context for auth check

  async function loadSweets() {
    setLoading(true);
    try {
      const res = await API.get("/sweets/search"); 
      setSweets(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function addSweet(payload) {
    const res = await API.post("/sweets", payload); 
    setSweets((p) => [res.data, ...p]);
  }

  async function updateSweet(id, payload) {
    const res = await API.put(`/sweets/${id}`, payload); 
    setSweets((p) => p.map((s) => (s.id === id ? res.data : s)));
  }

  async function deleteSweet(id) {
    await API.delete(`/sweets/${id}`); 
    setSweets((p) => p.filter((s) => s.id !== id));
  }

  async function purchaseSweet(id, qty = 1) {
    // NOT LOGGED IN MESSAGE: Check for logged-in user
    if (!user) {
        showMessage("Please log in to purchase sweets.", 'error');
        return { ok: false, message: "User not logged in" };
    }
    
    try {
      const res = await API.post(`/sweets/${id}/purchase`, { quantity: qty }); 
      if (res && res.data) {
        // UI STOCK UPDATE: Immediately update the state with the new quantity
        setSweets((p) => p.map((x) => (x.id === id ? res.data : x)));
        
        // SUCCESS MESSAGE: Display confirmation to the user
        showMessage(`Successfully purchased ${qty} kg of ${res.data.name}.`, 'success'); 
      }
      return { ok: true };
    } catch (error) {
      // HANDLE OTHER ERRORS (e.g., Insufficient stock from backend)
      const message = error.response?.data?.message || "Purchase failed. Check stock or try again.";
      showMessage(message, 'error');
      return { ok: false, message };
    }
  }

  async function restockSweet(id, qty) {
    const res = await API.post(`/sweets/${id}/restock`, { quantity: qty }); 
    setSweets((p) => p.map((x) => (x.id === id ? res.data : x)));
  }

  useEffect(() => {
    loadSweets();
    // eslint-disable-next-line
  }, []);

  return (
    <SweetContext.Provider value={{ sweets, loading, loadSweets, addSweet, updateSweet, deleteSweet, purchaseSweet, restockSweet }}>
      {children}
    </SweetContext.Provider>
  );
}

export function useSweets() {
  return useContext(SweetContext);
}