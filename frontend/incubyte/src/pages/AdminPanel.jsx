import React from "react";
import Navbar from "../components/Navbar";
import { useSweets } from "../context/SweetContext";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

export default function AdminPanel() {
  const { sweets, deleteSweet, restockSweet } = useSweets();

  return (
    <>
      <Navbar />
      <main className="container">
        <div className="admin-header">
          <h2>Admin Panel</h2>
          <Link to="/admin/add" className="btn">Add Sweet</Link>
        </div>

        <table className="table card">
          <thead>
            <tr><th>Name</th><th>Category</th><th>Price</th><th>Qty</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {sweets.map(s => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.category}</td>
                <td>₹{s.price}</td>
                <td>{s.quantity}</td>
                <td>
                  <button className="btn small" onClick={() => restockSweet(s.id, 10)}>Restock +10</button>
                  <Link to={`/admin/edit/${s.id}`} className="btn small outline">Edit</Link>
                  <button className="btn small danger" onClick={() => deleteSweet(s.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      <Footer />
    </>
  );
}
