import React, { useState, useEffect } from 'react';
import { Home, Plus, Trash2, Edit, Calendar, Users, Upload } from 'lucide-react';

export default function HostDashboard() {
  const [activeTab, setActiveTab] = useState('listings');
  const [myStays, setMyStays] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(null); // {id, name}
  const [successMessage, setSuccessMessage] = useState('');
  const [newStay, setNewStay] = useState({
    name: '',
    location: '',
    price: '',
    image: ''
  });
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const loadData = () => {
      const allStays = JSON.parse(localStorage.getItem('homestays')) || [];
      const filteredStays = allStays.filter(s => s.hostId === user?.id);
      setMyStays(filteredStays);
      
      const allBookings = JSON.parse(localStorage.getItem('bookings')) || [];
      // Filter bookings only for this host's listings
      const hostStayIds = filteredStays.map(s => s.id);
      const filteredBookings = allBookings.filter(b => hostStayIds.includes(b.homestayId));
      setBookings(filteredBookings);
    };

    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, [user?.id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewStay({ ...newStay, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const stay = {
      id: Date.now(),
      ...newStay,
      price: parseInt(newStay.price),
      rating: '5.0',
      hostId: user.id,
      image: newStay.image || 'https://picsum.photos/seed/house/400/300'
    };
    const allStays = JSON.parse(localStorage.getItem('homestays')) || [];
    const updated = [...allStays, stay];
    localStorage.setItem('homestays', JSON.stringify(updated));
    setMyStays(updated.filter(s => s.hostId === user.id));
    setShowAdd(false);
    setNewStay({ name: '', location: '', price: '', image: '' });
    
    // Add notification
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    localStorage.setItem('notifications', JSON.stringify([
      ...notifications, 
      { id: Date.now(), message: `New listing added: ${stay.name}`, type: 'listing', time: new Date() }
    ]));
    window.dispatchEvent(new Event('storage'));
  };

  const handleDelete = (id) => {
    const allStays = JSON.parse(localStorage.getItem('homestays')) || [];
    const updated = allStays.filter(s => s.id !== id);
    localStorage.setItem('homestays', JSON.stringify(updated));
    setMyStays(updated.filter(s => s.hostId === user.id));
    window.dispatchEvent(new Event('storage'));
  };

  const handleCancelBooking = (id, homestayName) => {
    const allBookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const updatedBookings = allBookings.filter(b => b.id !== id);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    
    // Refresh local state
    const allStays = JSON.parse(localStorage.getItem('homestays')) || [];
    const hostStayIds = allStays.filter(s => s.hostId === user?.id).map(s => s.id);
    setBookings(updatedBookings.filter(b => hostStayIds.includes(b.homestayId)));

    // Add notification
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    localStorage.setItem('notifications', JSON.stringify([
      ...notifications,
      { id: Date.now(), message: `Host cancelled booking for ${homestayName}`, type: 'cancellation', time: new Date() }
    ]));

    window.dispatchEvent(new Event('storage'));
    setConfirmCancel(null);
    setSuccessMessage(`Booking for ${homestayName} cancelled successfully.`);
    setTimeout(() => setSuccessMessage(''), 3000);
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
                      <label className="form-label">Homestay Name</label>
                      <input type="text" className="form-control" required value={newStay.name} onChange={e => setNewStay({...newStay, name: e.target.value})} />
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
                    <div key={stay.id} className="card glass">
                      <img src={stay.image} alt={stay.name} className="card-img" referrerPolicy="no-referrer" />
                      <div className="card-content">
                        <h3 className="card-title">{stay.name}</h3>
                        <p className="card-location">{stay.location}</p>
                        <p className="card-price">₹{stay.price} <span>/ night</span></p>
                        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                          <button className="btn btn-outline" style={{ flex: 1 }}><Edit size={16} /></button>
                          <button className="btn btn-outline" style={{ flex: 1, color: 'red' }} onClick={() => handleDelete(stay.id)}><Trash2 size={16} /></button>
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
                    <div key={b.id} className="glass" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h3 style={{ margin: '0 0 5px 0' }}>{b.homestayName}</h3>
                        <p style={{ fontSize: '0.9rem', opacity: 0.7 }}><Calendar size={14} /> {b.checkIn} to {b.checkOut}</p>
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
                        <p style={{ fontSize: '0.8rem', opacity: 0.5, marginTop: '10px' }}>Booking ID: #{b.id}</p>
                        <button 
                          className="btn btn-outline" 
                          style={{ fontSize: '0.7rem', color: 'red', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center', padding: '5px 10px' }}
                          onClick={() => setConfirmCancel({ id: b.id, name: b.homestayName })}
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
