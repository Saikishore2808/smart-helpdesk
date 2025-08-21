// src/pages/CreateTicket.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CreateTicket() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => { if (!token) navigate("/login"); }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("http://localhost:4000/api/tickets", { title, description }, { headers: { Authorization: `Bearer ${token}` } });
      navigate("/tickets");
    } catch (err) {
      if (err.response?.status === 401) { localStorage.removeItem("token"); navigate("/login"); }
      else setError(err.response?.data?.error || "Failed to create ticket");
    }
  };

  if (!token) return null;

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Create Ticket</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required className="p-3 border rounded"/>
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required className="p-3 border rounded"/>
        <button type="submit" className="bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition">Create</button>
      </form>
    </div>
  );
}
