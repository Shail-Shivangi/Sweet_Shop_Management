import React, { useState } from "react";
import Header from "../components/Navbar"; 
import { useSweets } from "../context/SweetContext";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useMessages } from "../context/MessageContext"; 

export default function AddSweet() {
  // State for form inputs
  const [form, setForm] = useState({ name: "", category: "", price: "", quantity: "", image: "", description: "" });
  // State to hold validation errors
  const [errors, setErrors] = useState({}); 
  
  const { addSweet } = useSweets();
  const nav = useNavigate();
  const { showMessage } = useMessages(); 

  // ---------------------------------------------
  // THE VALIDATE FUNCTION (CLIENT-SIDE LOGIC)
  // ---------------------------------------------
  function validate() {
    const newErrors = {};
    
    // 1. Required Fields Check
    if (!form.name) newErrors.name = "Name is required.";
    if (!form.category) newErrors.category = "Category is required.";
    if (!form.description) newErrors.description = "Description is required.";
    
    // 2. Price Validation (Must be a positive number)
    const price = Number(form.price);
    if (!form.price || isNaN(price) || price <= 0) {
      newErrors.price = "Price must be a positive number (e.g., 50).";
    }
    
    // 3. Quantity Validation (Must be a non-negative number)
    const quantity = Number(form.quantity);
    if (!form.quantity || isNaN(quantity) || quantity < 0) {
      newErrors.quantity = "Quantity must be a non-negative number.";
    }

    setErrors(newErrors); 
    return Object.keys(newErrors).length === 0; // Returns TRUE if validation passes
  }
  // ---------------------------------------------

  async function submit(e) {
    e.preventDefault();
    
    // 1. Run client-side validation and stop if it fails
    if (!validate()) {
      showMessage("Please correct the errors in the form before submitting.", 'error');
      return; 
    }
    
    // 2. Proceed with submission only if validation passes
    await addSweet({ ...form, price: Number(form.price), quantity: Number(form.quantity) });
    nav("/admin");
  }

  return (
    <>
      <Header />
      <main className="container centered-container">
        <form className="card form" onSubmit={submit}>
          <h2>Add Sweet</h2>
          
          {/* Name Input with Label and Error Display */}
          <label>Name</label>
          <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          {errors.name && <p className="error-text">{errors.name}</p>}

          {/* Category Input with Label and Error Display */}
          <label>Category</label>
          <input placeholder="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
          {errors.category && <p className="error-text">{errors.category}</p>}

          {/* Price Input with Label and Error Display */}
          <label>Price (₹)</label>
          <input type="number" placeholder="Price" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
          {errors.price && <p className="error-text">{errors.price}</p>}

          {/* Quantity Input with Label and Error Display */}
          <label>Quantity</label>
          <input type="number" placeholder="Quantity" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} />
          {errors.quantity && <p className="error-text">{errors.quantity}</p>}

          {/* Image URL Input */}
          <label>Image URL</label>
          <input placeholder="Image URL (e.g., /images/mysweet.png)" value={form.image} onChange={e => setForm({...form, image: e.target.value})} />

          {/* Description Textarea with Label and Error Display */}
          <label>Description</label>
          <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          {errors.description && <p className="error-text">{errors.description}</p>}

          <button className="btn">Add Sweet</button>
        </form>
      </main>
      <Footer />
    </>
  );
}