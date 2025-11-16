import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useMessages } from "../context/MessageContext";
import { Navigate } from "react-router-dom";

export default function Profile() {
  const { user, fetchPurchaseHistory } = useAuth();
  const { showMessage } = useMessages();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    async function loadHistory() {
      setLoading(true);
      const res = await fetchPurchaseHistory();
      if (res.ok) {
        setHistory(res.history);
      } else {
        showMessage(res.message, 'error');
      }
      setLoading(false);
    }

    loadHistory();
  }, [fetchPurchaseHistory, showMessage]);

  const formatPrice = (price) => `₹${price}`;
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  return (
    <>
      <Navbar />
      <main className="container">
        <div className="admin-header">
          <h2>Welcome, {user.name}!</h2>
        </div>
        
        <div className="card" style={{ marginBottom: '30px', padding: '30px' }}>
            <h3>Account Details</h3>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
        </div>

        <h3>Purchase History</h3>

        {loading ? (
          <p>Loading your purchase history...</p>
        ) : history.length === 0 ? (
          <p className="muted" style={{ marginTop: '20px' }}>
            You haven't purchased any sweets yet.
          </p>
        ) : (
          <table className="table card">
            <thead>
              <tr>
                <th>Sweet</th>
                <th>Price</th>
                <th>Quantity (box)</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}/>
                        {item.name}
                    </div>
                  </td>
                  <td>{formatPrice(item.price)}</td>
                  <td>{item.purchased_quantity} box</td>
                  <td>{formatDate(item.purchase_date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
      <Footer />
    </>
  );
}