import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

export default function ReviewSystem({ homestayId, homestayName, onClose }) {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const loadReviews = () => {
      const allReviews = JSON.parse(localStorage.getItem('reviews')) || [];
      setReviews(allReviews.filter(r => r.homestayId === homestayId));
    };
    loadReviews();
    window.addEventListener('storage', loadReviews);
    return () => window.removeEventListener('storage', loadReviews);
  }, [homestayId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const review = {
      id: Date.now(),
      homestayId,
      homestayName: homestayName || 'Homestay',
      userName: user.name,
      ...newReview,
      date: new Date().toLocaleDateString()
    };

    const allReviews = JSON.parse(localStorage.getItem('reviews')) || [];
    const updatedReviews = [...allReviews, review];
    localStorage.setItem('reviews', JSON.stringify(updatedReviews));
    
    // Add notification
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    localStorage.setItem('notifications', JSON.stringify([
      ...notifications, 
      { id: Date.now(), message: `Review submitted successfully for ${homestayName || 'homestay'}`, time: new Date() }
    ]));

    // Update average rating in homestays
    const homestays = JSON.parse(localStorage.getItem('homestays')) || [];
    const updatedHomestays = homestays.map(h => {
      if (h.id === homestayId) {
        const hReviews = updatedReviews.filter(r => r.homestayId === homestayId);
        const avg = hReviews.reduce((acc, curr) => acc + curr.rating, 0) / hReviews.length;
        return { ...h, rating: avg.toFixed(1) };
      }
      return h;
    });
    localStorage.setItem('homestays', JSON.stringify(updatedHomestays));
    
    setReviews(updatedReviews.filter(r => r.homestayId === homestayId));
    setNewReview({ rating: 5, comment: '' });
    window.dispatchEvent(new Event('storage'));
    if (onClose) onClose();
  };

  return (
    <div className="review-system">
      {onClose ? (
        <div className="modal-overlay" style={{ zIndex: 1001 }}>
          <div className="modal glass" style={{ width: '100%', maxWidth: '500px', padding: '30px' }}>
            <h3 style={{ marginBottom: '20px' }}>Write a Review for {homestayName}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Rating</label>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={24}
                      fill={star <= newReview.rating ? "#ffb400" : "none"}
                      color={star <= newReview.rating ? "#ffb400" : "#ccc"}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                    />
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Comment</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Share your experience..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  required
                ></textarea>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Submit Review</button>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <>
          <h3>Reviews ({reviews.length})</h3>
          <div className="reviews-list" style={{ marginTop: '20px' }}>
            {reviews.length > 0 ? (
              reviews.map(review => (
                <div key={review.id} className="review-item glass" style={{ padding: '15px', marginBottom: '15px', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <strong>{review.userName}</strong>
                    <span style={{ opacity: 0.5, fontSize: '0.8rem' }}>{review.date}</span>
                  </div>
                  <div className="stars" style={{ marginBottom: '10px' }}>
                    {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} fill="#ffb400" color="#ffb400" />)}
                  </div>
                  <p style={{ fontSize: '0.9rem' }}>{review.comment}</p>
                </div>
              ))
            ) : (
              <p style={{ opacity: 0.5 }}>No reviews yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
