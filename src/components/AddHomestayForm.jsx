import React, { useState, useEffect } from "react";
import { createHomestay, updateHomestay } from "../api/homestayApi";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dqf9t4v7v/image/upload";
const UPLOAD_PRESET = "jtejwgfx";

const emptyForm = { name: "", location: "", price: "", description: "", image: null };

export default function AddHomestayForm({ onAdd, onUpdate, editing }) {
  const [formData, setFormData] = useState(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editing) {
      setFormData({ ...editing, image: null });
      setIsEditing(true);
    } else {
      setFormData(emptyForm);
      setIsEditing(false);
    }
  }, [editing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const uploadImage = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);
    const res = await fetch(CLOUDINARY_URL, { method: "POST", body: data });
    const json = await res.json();
    return json.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Upload image if a new file was selected
      let imageUrl = typeof formData.image === "string" ? formData.image : "";
      if (formData.image && typeof formData.image !== "string") {
        imageUrl = await uploadImage(formData.image);
      }

      const payload = { ...formData, image: imageUrl };

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
        type="text" name="name" placeholder="Name"
        value={formData.name} onChange={handleChange} required
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