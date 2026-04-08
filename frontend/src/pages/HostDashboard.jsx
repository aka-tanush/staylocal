import React, { useState, useEffect } from 'react';
import { Home, Plus, Trash2, Edit, Calendar, Users, Upload } from 'lucide-react';
import api from '../services/api';
import { fetchBookingsByHost, deleteBooking } from '../services/bookingApi';

export default function HostDashboard() {
  const [activeTab, setActiveTab] = useState('listings');
  const [myStays, setMyStays] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [newStay, setNewStay] = useState({
    title: '',
    location: '',
    price: '',
    image: ''
  });
  const user = JSON.parse(localStorage.getItem('user'));

  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch homestays filtered by host
        const staysRes = await api.get('/homestays/host/mylisted');
        setMyStays(staysRes.data);

        // Fetch bookings for this host
        if (user?._id) {
          const hostBookings = await fetchBookingsByHost(user._id);
          setBookings(hostBookings);
        }
      } catch (err) {
        console.error('Failed to load host data:', err);
      }
    };

    loadData();
  }, [user?._id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewStay({ ...newStay, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', newStay.title);
      formData.append('description', 'A wonderful homestay');
      formData.append('location', newStay.location);
      formData.append('price', parseInt(newStay.price));
      
      if (imageFile) {
        formData.append('images', imageFile);
      }

      const res = await api.post('/homestays', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setMyStays([...myStays, res.data]);
      setShowAdd(false);
      setNewStay({ name: '', location: '', price: '', image: '' });
      setImageFile(null);
      setSuccessMessage('Listing added successfully! ✅');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to add listing:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/homestays/${id}`);
      setMyStays(myStays.filter(s => s._id !== id));
      setSuccessMessage('Listing deleted.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to delete listing:', err);
    }
  };

  const handleCancelBooking = async (id, homestayName) => {
    try {
      await deleteBooking(id);
      setBookings(bookings.filter(b => b._id !== id));
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
              className={`sidebar-item ${activeTab === 'listings' ? 'active' : ''}`}
              onClick={() => setActiveTab('listings')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', color: 'inherit' }}
            >
              <Home size={20} /> My Listings
            </button>
            <button 
              className={`sidebar-item ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', color: 'inherit' }}
            >
              <Calendar size={20} /> Bookings Received
            </button>
          </div>
        </aside>

        <main>
          {successMessage && (
            <div className="glass" style={{ padding: '15px', marginBottom: '20px', background: '#e8f5e9', color: '#2e7d32', fontWeight: '600', textAlign: 'center', borderRadius: '12px' }}>
              {successMessage}
            </div>
          )}

          {confirmCancel && (
            <div className="modal-overlay" style={{ zIndex: 1000 }}>
              <div className="modal glass" style={{ textAlign: 'center', padding: '30px' }}>
                <h3>Cancel Booking?</h3>
                <p style={{ marginBottom: '25px', opacity: 0.8 }}>Are you sure you want to cancel the booking for <strong>{confirmCancel.name}</strong>?</p>
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                  <button className="btn btn-primary" style={{ background: 'red', border: 'none' }} onClick={() => handleCancelBooking(confirmCancel.id, confirmCancel.name)}>Yes, Cancel</button>
                  <button className="btn btn-outline" onClick={() => setConfirmCancel(null)}>No, Keep it</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'listings' ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>Host Dashboard</h1>
                <button className="btn btn-primary" onClick={() => setShowAdd(true)}><Plus size={20} /> Add Listing</button>
              </div>

              {showAdd && (
                <div className="glass" style={{ padding: '30px', marginBottom: '40px' }}>
                  <h3>Add New Homestay</h3>
                  <form onSubmit={handleAdd} style={{ marginTop: '20px' }}>
                    <div className="form-group">
                      <label className="form-label">Homestay Title</label>
                      <input type="text" className="form-control" required value={newStay.title} onChange={e => setNewStay({...newStay, title: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Location</label>
                      <input type="text" className="form-control" required value={newStay.location} onChange={e => setNewStay({...newStay, location: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Price per Night (₹)</label>
                      <input type="number" className="form-control" required value={newStay.price} onChange={e => setNewStay({...newStay, price: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Homestay Image</label>
                      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <label className="btn btn-outline" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Upload size={18} /> Upload Image
                          <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                        </label>
                        {newStay.image && (
                          <img src={newStay.image} alt="Preview" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                      <button type="submit" className="btn btn-primary">Save Listing</button>
                      <button type="button" className="btn btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
                    </div>
                  </form>
                </div>
              )}

              <section style={{ marginBottom: '40px' }}>
                <h2>My Listings</h2>
                <div className="grid" style={{ marginTop: '20px' }}>
                  {myStays.length > 0 ? myStays.map(stay => (
                    <div key={stay._id} className="card glass">
                      <img src={stay.images?.[0] || stay.image || "https://picsum.photos/400/300"} alt={stay.title || stay.name} className="card-img" referrerPolicy="no-referrer" />
                      <div className="card-content">
                        <h3 className="card-title">{stay.title || stay.name}</h3>
                        <p className="card-location">{stay.location}</p>
                        <p className="card-price">₹{stay.price} <span>/ night</span></p>
                        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                          <button className="btn btn-outline" style={{ flex: 1 }}><Edit size={16} /></button>
                          <button className="btn btn-outline" style={{ flex: 1, color: 'red' }} onClick={() => handleDelete(stay._id)}><Trash2 size={16} /></button>
                        </div>
                      </div>
                    </div>
                  )) : <p style={{ opacity: 0.5 }}>No listings yet.</p>}
                </div>
              </section>
            </>
          ) : (
            <section>
              <h1>Bookings Received</h1>
              <p style={{ opacity: 0.7, marginBottom: '30px' }}>Manage reservations for your homestays.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {bookings.length > 0 ? (
                  bookings.map(b => (
                    <div key={b._id} className="glass" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h3 style={{ margin: '0 0 5px 0' }}>{b.homestayId?.title || 'Unknown Homestay'}</h3>
                        <p style={{ fontSize: '0.9rem', opacity: 0.7 }}><Calendar size={14} /> {new Date(b.checkInDate).toLocaleDateString()} to {new Date(b.checkOutDate).toLocaleDateString()}</p>
                        <p style={{ fontSize: '0.9rem', marginTop: '5px' }}><Users size={14} /> {b.guests} Guests</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ 
                          padding: '6px 12px', 
                          borderRadius: '20px', 
                          background: '#e8f5e9', 
                          color: '#2e7d32', 
                          fontSize: '0.85rem', 
                          fontWeight: '600' 
                        }}>
                          {b.status || 'Confirmed'}
                        </span>
                        <p style={{ fontSize: '0.8rem', opacity: 0.5, marginTop: '10px' }}>Booking ID: #{b._id?.slice(-6)}</p>
                        <button 
                          className="btn btn-outline" 
                          style={{ fontSize: '0.7rem', color: 'red', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center', padding: '5px 10px' }}
                          onClick={() => setConfirmCancel({ id: b._id, name: b.homestayId?.title || 'Unknown Homestay' })}
                        >
                          <Trash2 size={12} /> Cancel
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="glass" style={{ padding: '50px', textAlign: 'center', opacity: 0.5 }}>
                    <p>No bookings received yet</p>
                  </div>
                )}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
