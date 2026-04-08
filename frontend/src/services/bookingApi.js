import api from "./api";

// Create a new booking
export const createBooking = async (bookingData) => {
  const res = await api.post("/bookings", bookingData);
  return res.data;
};

// Fetch bookings for the logged-in host
export const fetchBookingsByHost = async () => {
  try {
    const res = await api.get(`/bookings/host`);
    return res.data;
  } catch (err) {
    console.error("Error fetching host bookings:", err);
    return [];
  }
};

// Fetch bookings for the logged-in tourist
export const fetchBookingsByTourist = async () => {
  try {
    const res = await api.get(`/bookings/mybookings`);
    return res.data;
  } catch (err) {
    console.error("Error fetching tourist bookings:", err);
    return [];
  }
};

// Cancel/Delete a booking
export const deleteBooking = async (id) => {
  await api.delete(`/bookings/${id}`);
};
