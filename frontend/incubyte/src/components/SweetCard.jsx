// src/components/SweetCard.jsx

import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext"; // <-- NEW IMPORT

export default function SweetCard({ sweet }) { // Removed unused onPurchase prop
  const { addToCart } = useCart(); // <-- USE CART HOOK
  const [purchaseQty, setPurchaseQty] = React.useState(1);
  
  const availableQty = Number(sweet.quantity);
  const maxPurchase = availableQty > 0 ? availableQty : 1; 

  const handleAddToCart = () => { // <-- NEW HANDLER
    const qty = Number(purchaseQty);
    if (availableQty > 0 && qty > 0) {
      addToCart(sweet, qty); // Call addToCart
      setPurchaseQty(1); // Reset quantity after adding to cart
    }
  }

  const isDisabled = availableQty <= 0 || purchaseQty <= 0 || purchaseQty > availableQty;

  return (
    <div className="card">
      <img src={sweet.image} alt={sweet.name} className="card-image" />
      <div className="card-body">
        <h3 className="card-title">{sweet.name}</h3>
        <p className="muted">{sweet.category}</p>
        <p className="price">₹ {sweet.price} for 500gm</p>
        <p className="muted">Stock: {sweet.quantity} box</p>

        <div className="card-actions" style={{ flexDirection: 'column', gap: '8px' }}>
          <Link to={`/sweet/${sweet.id}`} className="btn outline">Details</Link>
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input 
              type="number"
              min="1"
              max={maxPurchase}
              value={purchaseQty}
              onChange={(e) => setPurchaseQty(Number(e.target.value))}
              disabled={availableQty <= 0}
              style={{ width: '60px', padding: '6px 10px', fontSize: '14px', borderRadius: '8px', border: '1px solid #ccc' }}
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
      </div>
    </div>
  );
}