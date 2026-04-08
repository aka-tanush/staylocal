import React, { useState, useEffect } from "react";
import { createHomestay, updateHomestay } from "../api/homestayApi";

const emptyForm = { title: "", location: "", price: "", description: "", image: null };

export default function AddHomestayForm({ onAdd, onUpdate, editing }) {
  const [formData, setFormData] = useState(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editing) {
      setFormData({
        title: editing.title || editing.name || "",
        location: editing.location || "",
        price: editing.price || "",
        description: editing.description || "",
        image: editing.images?.[0] || editing.image || null,
        _id: editing._id,
      });
      setIsEditing(true);
    } else {
      setFormData(emptyForm);
      setIsEditing(false);
    }
  }, [editing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("location", formData.location);
      payload.append("price", formData.price);

      if (formData.image) {
        if (typeof formData.image === "string") {
          payload.append("image", formData.image);
        } else {
          payload.append("images", formData.image);
        }
      }

      if (isEditing) {
        const updated = await updateHomestay(formData._id, payload);
        onUpdate(updated);
      } else {
        const created = await createHomestay(payload);
        onAdd(created);
      }

      setFormData(emptyForm);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
      <h2>{isEditing ? "Edit Homestay ✏️" : "Add Homestay ➕"}</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="text" name="title" placeholder="Title"
        value={formData.title} onChange={handleChange} required
      />
      <input
        type="text" name="location" placeholder="Location"
        value={formData.location} onChange={handleChange} required
      />
      <input
        type="number" name="price" placeholder="Price"
        value={formData.price} onChange={handleChange} required
      />
      <textarea
        name="description" placeholder="Description"
        value={formData.description} onChange={handleChange} required
      />
      <input
        type="file" accept="image/*"
        onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : isEditing ? "Update Homestay" : "Add Homestay"}
      </button>
    </form>
  );
}