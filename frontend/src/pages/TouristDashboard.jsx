import React, { useState, useEffect } from 'react';
import { Calendar, Star, Heart, MapPin, Clock, Trash2, CreditCard, MessageSquare } from 'lucide-react';
import HomestayCard from '../components/HomestayCard';
import ReviewSystem from '../components/ReviewSystem';
import { fetchWishlist } from '../api/homestayApi';
import { fetchBookingsByTourist, deleteBooking } from '../services/bookingApi';

export default function TouristDashboard() {
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [reviewingBooking, setReviewingBooking] = useState(null);
  const [confirmCancel, setConfirmCancel] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const loadData = async () => {
      if (!user?._id) return;
      try {
        const touristBookings = await fetchBookingsByTourist(user._id);
        setBookings(Array.isArray(touristBookings) ? touristBookings : []);

        const wishlistData = await fetchWishlist(user._id);
        setWishlist(Array.isArray(wishlistData) ? wishlistData : []);
      } catch (err) {
        console.error('Failed to load tourist data:', err);
      }
    };

    loadData();
  }, [user?._id]);

  const handleCancel = async (id, homestayName) => {
    try {
      await deleteBooking(id);
      setBookings((Array.isArray(bookings) ? bookings : []).filter(b => b._id !== id));
      setConfirmCancel(null);
      setSuccessMessage(`Booking for ${homestayName} cancelled successfully.`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to cancel booking:', err);
    }
  };

  return (
    <div className="container">
      <div className="dashboard-layout">
        <aside className="sidebar glass">
          <div className="sidebar-nav">
            <button 
              className={`sidebar-item ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', color: 'inherit' }}
            >
              <Calendar size={20} /> My Bookings
            </button>
            <button 
              className={`sidebar-item ${activeTab === 'wishlist' ? 'active' : ''}`}
              onClick={() => setActiveTab('wishlist')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', color: 'inherit' }}
            >
              <Heart size={20} /> Wishlist
            </button>
          </div>
        </aside>

        <main>
          <div style={{ marginBottom: '30px' }}>
            <h1>Welcome, {user?.name}!</h1>
            <p style={{ opacity: 0.7 }}>Manage your bookings and travel experiences.</p>
          </div>

          {successMessage && (
            <div className="glass" style={{ padding: '15px', marginBottom: '20px', background: '#e8f5e9', color: '#2e7d32', fontWeight: '600', textAlign: 'center', borderRadius: '12px' }}>
              {successMessage}
            </div>
          )}

          {confirmCancel && (
            <div className="modal-overlay" style={{ zIndex: 1000 }}>
              <div className="modal glass" style={{ textAlign: 'center', padding: '30px' }}>
                <h3>Cancel Booking?</h3>
                <p style={{ marginBottom: '25px', opacity: 0.8 }}>Are you sure you want to cancel your booking for <strong>{confirmCancel.name}</strong>?</p>
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                  <button className="btn btn-primary" style={{ background: 'red', border: 'none' }} onClick={() => handleCancel(confirmCancel.id, confirmCancel.name)}>Yes, Cancel</button>
                  <button className="btn btn-outline" onClick={() => setConfirmCancel(null)}>No, Keep it</button>
                </div>
              </div>
            </div>
          )}

          {reviewingBooking && (
            <ReviewSystem 
              homestayId={reviewingBooking.homestayId} 
              homestayName={reviewingBooking.homestayName} 
              onClose={() => setReviewingBooking(null)} 
            />
          )}

          {activeTab === 'bookings' && (
            <section style={{ marginBottom: '40px' }}>
              <h2>My Bookings</h2>
              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {Array.isArray(bookings) && bookings.length > 0 ? (
                  (Array.isArray(bookings) ? bookings : []).map(booking => (
                    <div key={booking._id} className="glass" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ marginBottom: '5px' }}>{booking.homestayId?.title || 'Unknown Homestay'}</h3>
                        <div style={{ display: 'flex', gap: '20px', marginTop: '10px', fontSize: '0.9rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14} /> {new Date(booking.checkInDate).toLocaleDateString()} to {new Date(booking.checkOutDate).toLocaleDateString()}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={14} /> {booking.guests} Guests</span>
                        </div>
                        <p style={{ marginTop: '10px', fontSize: '0.85rem', color: '#4caf50', fontWeight: '600' }}>
                          Status: {booking.status || 'Confirmed'}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '150px' }}>
                        <span className="btn btn-primary" style={{ background: '#4caf50', fontSize: '0.8rem', border: 'none', cursor: 'default' }}>
                          {booking.status || 'Confirmed'}
                        </span>
                        
                        <button 
                          className="btn btn-primary" 
                          style={{ background: '#6c5ce7', fontSize: '0.8rem', border: 'none', display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center' }}
                          onClick={() => setReviewingBooking({ id: booking._id, homestayId: booking.homestayId?._id, homestayName: booking.homestayId?.title || 'Unknown Homestay' })}
                        >
                          <MessageSquare size={14} /> Write Review
                        </button>

                        <button 
                          className="btn btn-outline" 
                          style={{ fontSize: '0.8rem', color: 'red', display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center' }}
                          onClick={() => setConfirmCancel({ id: booking._id, name: booking.homestayId?.title || 'Unknown Homestay' })}
                        >
                          <Trash2 size={14} /> Cancel Booking
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>You have no active bookings.</p>
                )}
              </div>
            </section>
          )}

          {activeTab === 'wishlist' && (
            <section style={{ marginBottom: '40px' }}>
              <h2>My Wishlist</h2>
              <div className="grid" style={{ marginTop: '20px' }}>
                {Array.isArray(wishlist) && wishlist.length > 0 ? (
                  (Array.isArray(wishlist) ? wishlist : []).map(item => (
                    <HomestayCard key={item._id} homestay={item} />
                  ))
                ) : (
                  <p>Your wishlist is empty.</p>
                )}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
