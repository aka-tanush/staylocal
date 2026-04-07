import React, { useState, useEffect } from 'react';
import { Calendar, Star, Heart, MapPin, Clock, Trash2, CreditCard, MessageSquare } from 'lucide-react';
import HomestayCard from '../components/HomestayCard';
import ReviewSystem from '../components/ReviewSystem';

export default function TouristDashboard() {
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [confirmCancel, setConfirmCancel] = useState(null); // {id, name}
  const [reviewingBooking, setReviewingBooking] = useState(null); // {id, homestayId, homestayName}
  const [successMessage, setSuccessMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const loadData = () => {
      const allBookings = JSON.parse(localStorage.getItem('bookings')) || [];
      setBookings(allBookings.filter(b => b.userRole === 'Tourist'));
      
      const allReviews = JSON.parse(localStorage.getItem('reviews')) || [];
      setReviews(allReviews.filter(r => r.userName === user?.name));

      const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
      setWishlist(storedWishlist);
    };

    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, [user?.name]);

  const handleCancel = (id, homestayName) => {
    const allBookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const updatedBookings = allBookings.filter(b => b.id !== id);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    setBookings(updatedBookings.filter(b => b.userRole === 'Tourist'));

    // Add notification
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    localStorage.setItem('notifications', JSON.stringify([
      ...notifications,
      { id: Date.now(), message: `Booking cancelled successfully for ${homestayName}`, type: 'cancellation', time: new Date() }
    ]));

    window.dispatchEvent(new Event('storage'));
    setConfirmCancel(null);
    setSuccessMessage(`Booking for ${homestayName} cancelled successfully.`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handlePayment = (id, homestayName) => {
    const allBookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const updatedBookings = allBookings.map(b => {
      if (b.id === id) {
        return { ...b, paymentStatus: 'Paid', status: 'Confirmed' };
      }
      return b;
    });
    
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    setBookings(updatedBookings.filter(b => b.userRole === 'Tourist'));

    // Add notification
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    localStorage.setItem('notifications', JSON.stringify([
      ...notifications,
      { id: Date.now(), message: `Payment Successful & Booking Confirmed for ${homestayName}`, type: 'payment', time: new Date() }
    ]));

    window.dispatchEvent(new Event('storage'));
    setSuccessMessage(`Payment Successful & Booking Confirmed for ${homestayName}`);
    setTimeout(() => setSuccessMessage(''), 3000);
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
            <button 
              className={`sidebar-item ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', color: 'inherit' }}
            >
              <Star size={20} /> My Reviews
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
                {bookings.length > 0 ? (
                  bookings.map(booking => (
                    <div key={booking.id} className="glass" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ marginBottom: '5px' }}>{booking.homestayName}</h3>
                        <p className="card-location"><MapPin size={14} /> {booking.location}</p>
                        <div style={{ display: 'flex', gap: '20px', marginTop: '10px', fontSize: '0.9rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14} /> {booking.checkIn} to {booking.checkOut}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={14} /> {booking.guests} Guests</span>
                        </div>
                        {booking.paymentStatus === 'Paid' ? (
                          <p style={{ marginTop: '10px', fontSize: '0.85rem', color: '#4caf50', fontWeight: '600' }}>
                            Payment Status: Paid {booking.paymentMethod ? `via ${booking.paymentMethod}` : ''}
                          </p>
                        ) : (
                          <p style={{ marginTop: '10px', fontSize: '0.85rem', color: '#ffb400', fontWeight: '600' }}>
                            Payment Status: Pending
                          </p>
                        )}
                      </div>
                      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '150px' }}>
                        <span className="btn btn-primary" style={{ background: booking.paymentStatus === 'Paid' ? '#4caf50' : '#ffb400', fontSize: '0.8rem', border: 'none', cursor: 'default' }}>
                          {booking.paymentStatus === 'Paid' ? 'Confirmed' : 'Pending Payment'}
                        </span>
                        
                        {booking.paymentStatus !== 'Paid' && (
                          <button 
                            className="btn btn-primary" 
                            style={{ background: '#4caf50', fontSize: '0.8rem', border: 'none', display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center' }}
                            onClick={() => handlePayment(booking.id, booking.homestayName)}
                          >
                            <CreditCard size={14} /> Make Payment
                          </button>
                        )}

                        {booking.paymentStatus === 'Paid' && (
                          <button 
                            className="btn btn-primary" 
                            style={{ background: '#6c5ce7', fontSize: '0.8rem', border: 'none', display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center' }}
                            onClick={() => setReviewingBooking({ id: booking.id, homestayId: booking.homestayId, homestayName: booking.homestayName })}
                          >
                            <MessageSquare size={14} /> Write Review
                          </button>
                        )}

                        <button 
                          className="btn btn-outline" 
                          style={{ fontSize: '0.8rem', color: 'red', display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center' }}
                          onClick={() => setConfirmCancel({ id: booking.id, name: booking.homestayName })}
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
                {wishlist.length > 0 ? (
                  wishlist.map(item => (
                    <HomestayCard key={item.id} homestay={item} />
                  ))
                ) : (
                  <p>Your wishlist is empty.</p>
                )}
              </div>
            </section>
          )}

          {activeTab === 'reviews' && (
            <section>
              <h2>My Reviews</h2>
              <div style={{ marginTop: '20px' }}>
                {reviews.length > 0 ? (
                  reviews.map(review => (
                    <div key={review.id} className="review-item glass" style={{ marginBottom: '15px', borderRadius: '12px' }}>
                      <div className="stars">
                        {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                      </div>
                      <p>{review.comment}</p>
                      <p style={{ fontSize: '0.8rem', opacity: 0.5, marginTop: '10px' }}>Posted on {review.date}</p>
                    </div>
                  ))
                ) : (
                  <p>You haven't written any reviews yet.</p>
                )}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
