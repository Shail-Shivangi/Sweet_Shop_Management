// src/pages/Cart.jsx

import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useSweets } from "../context/SweetContext";
import { useAuth } from "../context/AuthContext";
import { useMessages } from "../context/MessageContext";
import API from "../api"; // For direct API call during checkout
import { Link, useNavigate } from "react-router-dom";

export default function Cart() {
  const { user } = useAuth();
  const nav = useNavigate();
  const { cartItems, cartTotal, removeFromCart, clearCart } = useCart();
  const { loadSweets } = useSweets(); // Needed to refresh global sweet stock
  const { showMessage } = useMessages();
  const [isProcessing, setIsProcessing] = React.useState(false); // New state for processing

  async function handlePurchase() {
    if (!user) {
        showMessage("Please log in to complete your purchase.", 'error');
        nav('/login');
        return;
    }
    
    setIsProcessing(true);

    try {
      // 1. Process each item in the cart sequentially
      for (const item of cartItems) {
        const payload = { quantity: item.quantity };
        
        // Call the existing protected purchase endpoint for each item
        const res = await API.post(`/sweets/${item.id}/purchase`, payload);

        // NOTE: Backend returns 200 on success. If it fails due to insufficient stock, 
        // it returns 400 with a message, which is caught below.
      }

      // 2. Clear the cart state locally
      clearCart();

      // 3. Update the global sweet inventory state on the UI
      // This ensures the stock on Dashboard/Details pages is immediately accurate.
      await loadSweets(); 
      
      // 4. Show success message
      showMessage(`Purchase successful! Total: ₹${cartTotal}. Thank you!`, 'success');
      
      // 5. Navigate to Dashboard
      nav('/dashboard');

    } catch (error) {
      // Handle any purchase errors (e.g., Insufficient stock from backend)
      const message = error.response?.data?.message || "An unexpected error occurred during checkout. Please check stock and try again.";
      showMessage(message, 'error');
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="container">
        <h2>Your Shopping Cart</h2>

        {cartItems.length === 0 ? (
          <p className="muted" style={{ textAlign: 'center', marginTop: '50px' }}>
            Your cart is empty. Start shopping on the <Link to="/dashboard">Sweets</Link> page!
          </p>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              <table className="table card">
                <thead>
                  <tr><th>Item</th><th>Price</th><th>Quantity (kg)</th><th>Total</th><th></th></tr>
                </thead>
                <tbody>
                  {cartItems.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}/>
                          {item.name}
                        </div>
                      </td>
                      <td>₹{item.price}</td>
                      <td>{item.quantity} box</td>
                      <td>₹{item.price * item.quantity}</td>
                      <td>
                        <button className="btn small danger" onClick={() => removeFromCart(item.id)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="cart-summary card">
              <h3>Order Summary</h3>
              <p>Total Weight: {cartItems.reduce((sum, item) => sum + item.quantity, 0)} box</p>
              <div style={{ borderTop: '1px solid #eee', margin: '15px 0' }}></div>
              <h3 className="price" style={{ fontSize: '24px' }}>Grand Total: ₹{cartTotal}</h3>
              
              {/* PURCHASE BUTTON - Replaced Checkout with Purchase */}
              <button 
                className="btn" 
                style={{ width: '100%', marginTop: '20px' }} 
                onClick={handlePurchase}
                disabled={cartItems.length === 0 || isProcessing}
              >
                {isProcessing ? "Processing..." : "Purchase"}
              </button>
              <button className="btn outline danger small" style={{ width: '100%', marginTop: '10px' }} onClick={clearCart}>Clear Cart</button>
            </div>
          </div>
        )}
        
      </main>
      <Footer />
    </>
  );
}