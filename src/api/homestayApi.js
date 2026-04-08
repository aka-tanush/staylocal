import api from "../services/api";

export const fetchReviews = async (homestayId) => {
  try {
    // Note: Reviews endpoint isn't fully built yet on the backend, this is a placeholder
    const res = await api.get(`/reviews/${homestayId}`);
    return res.data;
  } catch (err) {
    return [];
  }
};

export const fetchWishlist = async (userId) => {
  try {
    const res = await api.get(`/users/profile`);
    return res.data.wishlist || [];
  } catch (err) {
    console.error("Error fetching wishlist:", err);
    return [];
  }
};

export const addToWishlist = async (userId, homestayId) => {
  try {
    await api.post(`/users/wishlist/${homestayId}`);
  } catch (err) {
    console.error("Error adding to wishlist:", err);
  }
};

export const removeFromWishlist = async (userId, homestayId) => {
  try {
    await api.delete(`/users/wishlist/${homestayId}`);
  } catch (err) {
    console.error("Error removing from wishlist:", err);
  }
};

export const fetchHomestays = async (keyword = "") => {
  try {
    const res = await api.get(`/homestays${keyword ? `?keyword=${keyword}` : ''}`);
    return res.data.homestays || res.data;
  } catch (err) {
    console.error("Error fetching homestays:", err);
    return [];
  }
};

export const createHomestay = async (data) => {
  const res = await api.post("/homestays", data);
  return res.data;
};

export const updateHomestay = async (id, data) => {
  const res = await api.put(`/homestays/${id}`, data);
  return res.data;
};

export const deleteHomestay = async (id) => {
  await api.delete(`/homestays/${id}`);
};

export const submitReview = async (reviewData) => {
  const res = await api.post("/reviews", reviewData);
  return res.data;
};

export const createBooking = async (bookingData) => {
  const res = await api.post("/bookings", bookingData);
  return res.data;
};

export const fetchBookingsByHost = async (hostId) => {
  try {
    const res = await api.get(`/bookings/host`);
    return res.data;
  } catch (err) {
    console.error("Error fetching host bookings:", err);
    return [];
  }
};

export const fetchBookingsByTourist = async (touristId) => {
  try {
    const res = await api.get(`/bookings/mybookings`);
    return res.data;
  } catch (err) {
    console.error("Error fetching tourist bookings:", err);
    return [];
  }
};

export const deleteBooking = async (id) => {
  await api.delete(`/bookings/${id}`);
};
