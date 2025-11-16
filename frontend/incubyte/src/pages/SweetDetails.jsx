// src/pages/SweetDetails.jsx

import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { useSweets } from "../context/SweetContext";
import { useCart } from "../context/CartContext"; // <-- NEW IMPORT
import Footer from "../components/Footer";

export default function SweetDetails() {
  const { id } = useParams();
  const { sweets } = useSweets(); // Removed purchaseSweet from useSweets
  const { addToCart } = useCart(); // <-- USE CART HOOK
  
  const sweet = sweets.find(s => s.id === Number(id));
  
  const [quantityToBuy, setQuantityToBuy] = useState(1);
  
  if (!sweet) return <p className="container">No sweet found</p>;

  const availableQty = Number(sweet.quantity);
  const maxPurchase = availableQty > 0 ? availableQty : 1;
  const isDisabled = availableQty <= 0 || quantityToBuy <= 0 || quantityToBuy > availableQty;

  const handleAddToCart = () => { // <-- RENAME HANDLER
    if (!isDisabled) {
        addToCart(sweet, quantityToBuy); // Call addToCart
    }
  }

  return (
    <>
      <Navbar />
      <main className="container details card">
        <img src={sweet.image} alt={sweet.name} className="details-image" />
        <div>
          <h2>{sweet.name}</h2>
          <p className="muted">{sweet.category}</p>
          <p className="price">₹{sweet.price}</p>
          <p>Stock: {sweet.quantity} kg</p>
          <p>{sweet.description}</p>
          
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: '20px' }}>
            <input 
                type="number"
                min="1"
                max={maxPurchase}
                value={quantityToBuy}
                onChange={(e) => setQuantityToBuy(Number(e.target.value))}
                disabled={availableQty <= 0}
                style={{ width: '80px', padding: '10px 16px', fontSize: '18px' }}
            />
            {/* CHANGED BUTTON TEXT AND HANDLER */}
            <button 
              className="btn" 
              disabled={isDisabled} 
              onClick={handleAddToCart} 
              style={{ flexGrow: 1 }}
            >
              {availableQty <= 0 ? "Out of stock" : "Add to Cart"}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}