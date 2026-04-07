import React, { useState, useEffect } from "react";
import { MapPin, Star, Heart } from "lucide-react";
import BookingModal from "./BookingModal";

export default function HomestayCard({ homestay, onDelete, onEdit }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [avgRating, setAvgRating] = useState(homestay?.rating || "5.0");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setIsWishlisted(wishlist.some((item) => item._id === homestay?._id));

    const loadRating = () => {
      const allReviews = JSON.parse(localStorage.getItem("reviews")) || [];
      const hReviews = allReviews.filter(
        (r) => r.homestayId === homestay?._id
      );

      if (hReviews.length > 0) {
        const avg =
          hReviews.reduce((acc, curr) => acc + curr.rating, 0) /
          hReviews.length;
        setAvgRating(avg.toFixed(1));
      } else {
        setAvgRating(homestay?.rating || "5.0");
      }
    };

    loadRating();
    window.addEventListener("storage", loadRating);
    return () => window.removeEventListener("storage", loadRating);
  }, [homestay?._id, homestay?.rating]);

  const toggleWishlist = (e) => {
    e.stopPropagation();

    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    let updatedWishlist;

    if (isWishlisted) {
      updatedWishlist = wishlist.filter(
        (item) => item._id !== homestay._id
      );
    } else {
      updatedWishlist = [...wishlist, homestay];
    }

    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    setIsWishlisted(!isWishlisted);

    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className="card glass">
      {/* ✅ Image */}
      <img
        src={
          homestay?.image
            ? homestay.image
            : "https://picsum.photos/400/300"
        }
        alt={homestay?.name}
        className="card-img"
        referrerPolicy="no-referrer"
      />

      {/* ❤️ Wishlist */}
      <button
        className={`wishlist-btn ${isWishlisted ? "active" : ""}`}
        onClick={toggleWishlist}
      >
        <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} />
      </button>

      <div className="card-content">
        {/* Header */}
        <div className="card-header">
          <h3 className="card-title">{homestay?.name}</h3>

          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Star size={14} fill="#ffb400" color="#ffb400" />
            <span style={{ fontSize: "0.9rem", fontWeight: "600" }}>
              {avgRating}
            </span>
          </div>
        </div>

        {/* Location */}
        <p className="card-location">
          <MapPin size={14} /> {homestay?.location}
        </p>

        {/* Price + Booking */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "15px",
          }}
        >
          <p className="card-price">
            ₹{homestay?.price} <span>/ night</span>
          </p>

          {user?.role === "Tourist" && (
            <button
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              Book Now
            </button>
          )}
        </div>

        {/* ✏️ Edit & Delete (Safe) */}
        <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
          {onEdit && (
            <button
              className="btn btn-outline"
              onClick={() => onEdit(homestay)}
            >
              Edit
            </button>
          )}

          {onDelete && (
            <button
              className="btn btn-danger"
              onClick={() => onDelete(homestay._id)}
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {showModal && (
        <BookingModal
          homestay={homestay}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}