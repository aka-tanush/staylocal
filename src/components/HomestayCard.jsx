import React, { useState, useEffect } from "react";
import api from "../services/api";
import { MapPin, Star, Heart } from "lucide-react";
import BookingModal from "./BookingModal";
import {
  fetchReviews,
  addToWishlist,
  removeFromWishlist,
  fetchWishlist,
} from "../api/homestayApi";

export default function HomestayCard({ homestay, onDelete, onEdit }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [avgRating, setAvgRating] = useState(homestay?.rating || "5.0");

  const user = JSON.parse(localStorage.getItem("user")); // ✅ keep for auth

  useEffect(() => {
    if (!homestay?._id) return;

    // Load wishlist from backend
    if (user?._id) {
      fetchWishlist(user._id).then((wishlist) => {
        setIsWishlisted(wishlist.some((item) => item._id === homestay._id));
      });
    }

    // Load reviews from backend
    fetchReviews(homestay._id).then((reviews) => {
      if (reviews.length > 0) {
        const avg =
          reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
        setAvgRating(avg.toFixed(1));
      } else {
        setAvgRating(homestay?.rating || "5.0");
      }
    });
  }, [homestay?._id]);

  const toggleWishlist = async (e) => {
    e.stopPropagation();
    if (!user?._id) return;

    if (isWishlisted) {
      await removeFromWishlist(user._id, homestay._id);
    } else {
      await addToWishlist(user._id, homestay._id);
    }
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="card glass">
      <img
        src={homestay?.image || "https://picsum.photos/400/300"}
        alt={homestay?.name}
        className="card-img"
        referrerPolicy="no-referrer"
      />

      <button
        className={`wishlist-btn ${isWishlisted ? "active" : ""}`}
        onClick={toggleWishlist}
      >
        <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} />
      </button>

      <div className="card-content">
        <div className="card-header">
          <h3 className="card-title">{homestay?.name}</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Star size={14} fill="#ffb400" color="#ffb400" />
            <span style={{ fontSize: "0.9rem", fontWeight: "600" }}>
              {avgRating}
            </span>
          </div>
        </div>

        <p className="card-location">
          <MapPin size={14} /> {homestay?.location}
        </p>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "15px" }}>
          <p className="card-price">
            ₹{homestay?.price} <span>/ night</span>
          </p>
          {user?.role === "Tourist" && (
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              Book Now
            </button>
          )}
        </div>

        <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
          {onEdit && (
            <button className="btn btn-outline" onClick={() => onEdit(homestay)}>
              Edit
            </button>
          )}
          {onDelete && (
            <button className="btn btn-danger" onClick={() => onDelete(homestay._id)}>
              Delete
            </button>
          )}
        </div>
      </div>

      {showModal && (
        <BookingModal homestay={homestay} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}