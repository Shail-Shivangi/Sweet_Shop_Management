import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useSweets } from "../context/SweetContext";
import SweetCard from "../components/SweetCard";
import Footer from "../components/Footer";

export default function Dashboard() {
  const { sweets, loading } = useSweets();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  const cats = [...new Set(sweets.map(s => s.category))].sort();

  function matches(s) {
    if (q && !s.name.toLowerCase().includes(q.toLowerCase())) return false;
    // Check if category matches, or if no category is selected
    if (category && s.category !== category) return false;
    // Check price range
    if (min && s.price < Number(min)) return false;
    if (max && s.price > Number(max)) return false;
    return true;
  }
  
  // New handler for purchase from SweetCard (now receives id and qty)
  // const handlePurchase = (id, qty) => {
  //   purchaseSweet(id, qty);
  // };

  return (
    <>
      <Navbar />
      <main className="container">
        <h2>Sweet Shop Catalog</h2>

        {/* Filters Section - Visually enhanced by index.css */}
        <div className="filters card">
          <input 
            placeholder="Search by name..." 
            value={q} 
            onChange={e => setQ(e.target.value)} 
          />
          <select 
            value={category} 
            onChange={e => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {cats.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input 
            type="number"
            placeholder="Min Price (₹)" 
            value={min} 
            onChange={e => setMin(e.target.value)} 
            min="0"
          />
          <input 
            type="number"
            placeholder="Max Price (₹)" 
            value={max} 
            onChange={e => setMax(e.target.value)} 
            min="0"
          />
        </div>

        {loading ? <p>Loading sweets...</p> : (
          <div className="grid">
            {sweets.filter(matches).map(s => (
              // Pass the new handler
              <SweetCard key={s.id} sweet={s}  />
            ))}
          </div>
        )}
        
        {/* If no sweets match the filter */}
        {!loading && sweets.filter(matches).length === 0 && (
          <p className="muted" style={{ textAlign: 'center', marginTop: '50px' }}>
            No sweets match your current filters. Try adjusting the search terms.
          </p>
        )}
      </main>
      <Footer />
    </>
  );
}