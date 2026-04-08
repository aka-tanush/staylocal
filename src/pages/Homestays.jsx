import React, { useState, useEffect } from "react";
import HomestayCard from "../components/HomestayCard";
import AddHomestayForm from "../components/AddHomestayForm";
import api from "../services/api";

export default function Homestays() {
  const [homestays, setHomestays] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [editing, setEditing] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    location: "",
    priceRange: 10000
  });

  // ✅ Fetch from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/homestays");
        const data = res.data.homestays || res.data; // Support both structures
        setHomestays(data);
        setFiltered(data);
      } catch (err) {
        setError("Failed to load homestays ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Filtering
  useEffect(() => {
    const result = homestays.filter((item) => {
      const title = item.title || item.name || "";
      const location = item.location || "";
      return (
        title.toLowerCase().includes(filters.search.toLowerCase()) &&
        location.toLowerCase().includes(filters.location.toLowerCase()) &&
        item.price <= filters.priceRange
      );
    });

    setFiltered(result);
  }, [filters, homestays]);

  // ➕ ADD
  const handleAdd = (newStay) => {
    setHomestays([newStay, ...homestays]);
    setMessage("Added successfully ✅");
  };

  // ✏️ EDIT
  const handleEdit = (stay) => {
    setEditing(stay);
  };

  // 🔄 UPDATE
  const handleUpdate = (updatedStay) => {
    const updated = homestays.map((item) =>
      item._id === updatedStay._id ? updatedStay : item
    );

    setHomestays(updated);
    setEditing(null);
    setMessage("Updated successfully ✏️");
  };

  // ❌ DELETE
  const handleDelete = async (id) => {
    try {
      await api.delete(`/homestays/${id}`);

      setHomestays(homestays.filter((item) => item._id !== id));
      setMessage("Deleted ❌");

    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <h2>Loading... ⏳</h2>;
  if (error) return <h2 style={{ color: "red" }}>{error}</h2>;

  return (
    <div className="container" style={{ marginTop: "40px" }}>
      <h1>Explore Homestays</h1>

      {message && <p style={{ color: "green" }}>{message}</p>}

      <AddHomestayForm
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        editing={editing}
      />

      {/* Filters */}
      <input
        placeholder="Search"
        onChange={(e) =>
          setFilters({ ...filters, search: e.target.value })
        }
      />

      <input
        placeholder="Location"
        onChange={(e) =>
          setFilters({ ...filters, location: e.target.value })
        }
      />

      <div className="grid">
        {filtered.map((item) => (
          <HomestayCard
            key={item._id}
            homestay={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}