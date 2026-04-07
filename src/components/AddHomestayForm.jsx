import React, { useState, useEffect } from "react";

export default function AddHomestayForm({ onAdd, onUpdate, editing }) {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    price: "",
    description: "",
    image: null
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (editing) {
      setFormData({ ...editing, image: null }); // keep image separate
      setIsEditing(true);
    } else {
      setFormData({
        name: "",
        location: "",
        price: "",
        description: "",
        image: null
      });
      setIsEditing(false);
    }
  }, [editing]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = formData.image || "";

      // ✅ Upload image to Cloudinary
      if (formData.image && typeof formData.image !== "string") {
        const data = new FormData();
        data.append("file", formData.image);
        data.append("upload_preset", "jtejwgfx");

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dqf9t4v7v/image/upload",
          {
            method: "POST",
            body: data
          }
        );

        const file = await res.json();
        imageUrl = file.secure_url;
      }

      let response;

      if (isEditing) {
        // ✏️ UPDATE
        response = await fetch(
          `http://localhost:5000/api/homestays/${formData._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              ...formData,
              image: imageUrl
            })
          }
        );

        const updated = await response.json();
        onUpdate(updated);

      } else {
        // ➕ ADD
        response = await fetch("http://localhost:5000/api/homestays", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ...formData,
            image: imageUrl
          })
        });

        const created = await response.json();
        onAdd(created);
      }

      // 🔄 Reset form
      setFormData({
        name: "",
        location: "",
        price: "",
        description: "",
        image: null
      });

      setIsEditing(false);

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
      <h2>{isEditing ? "Edit Homestay ✏️" : "Add Homestay ➕"}</h2>

      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="location"
        placeholder="Location"
        value={formData.location}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="price"
        placeholder="Price"
        value={formData.price}
        onChange={handleChange}
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        required
      />

      {/* ✅ Image Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setFormData({ ...formData, image: e.target.files[0] })
        }
      />

      <button type="submit">
        {isEditing ? "Update Homestay" : "Add Homestay"}
      </button>
    </form>
  );
}