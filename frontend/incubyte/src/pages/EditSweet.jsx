import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useSweets } from "../context/SweetContext";
import { useParams, useNavigate } from "react-router-dom";

export default function EditSweet() {
  const { id } = useParams();
  const { sweets, updateSweet } = useSweets();
  const nav = useNavigate();
  const s = sweets.find(x => x.id === Number(id));
  const [form, setForm] = useState(s || {});

  useEffect(() => {
    setForm(s || {});
  }, [s]);

  async function submit(e) {
    e.preventDefault();
    await updateSweet(Number(id), { ...form, price: Number(form.price), quantity: Number(form.quantity) });
    nav("/admin");
  }

  if (!s) return <p className="container">Loading...</p>;

  return (
    <>
      <Navbar />
      <main className="container">
        <form className="card form" onSubmit={submit}>
          <h2>Edit Sweet</h2>
          <input placeholder="Name" value={form.name || ""} onChange={e => setForm({...form, name: e.target.value})} />
          <input placeholder="Category" value={form.category || ""} onChange={e => setForm({...form, category: e.target.value})} />
          <input placeholder="Price" value={form.price || ""} onChange={e => setForm({...form, price: e.target.value})} />
          <input placeholder="Quantity" value={form.quantity || ""} onChange={e => setForm({...form, quantity: e.target.value})} />
          <input placeholder="Image URL" value={form.image || ""} onChange={e => setForm({...form, image: e.target.value})} />
          <textarea placeholder="Description" value={form.description || ""} onChange={e => setForm({...form, description: e.target.value})} />
          <button className="btn">Update</button>
        </form>
      </main>
    </>
  );
}
