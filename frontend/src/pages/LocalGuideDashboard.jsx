import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, Star, Upload } from 'lucide-react';

export default function LocalGuideDashboard() {
  const [activeTab, setActiveTab] = useState('recommendations');
  const [myPlaces, setMyPlaces] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newPlace, setNewPlace] = useState({
    name: '',
    location: '',
    category: 'Nature',
    description: '',
    image: ''
  });
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const loadData = () => {
      const allPlaces = JSON.parse(localStorage.getItem('places')) || [];
      setMyPlaces((Array.isArray(allPlaces) ? allPlaces : []).filter(p => p.guideId === user?.id));

      const allReviews = JSON.parse(localStorage.getItem('reviews')) || [];
      setReviews(Array.isArray(allReviews) ? allReviews : []);
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
        setNewPlace({ ...newPlace, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const place = {
      id: Date.now(),
      ...newPlace,
      guideId: user.id,
      guideName: user.name,
      image: newPlace.image || `https://picsum.photos/seed/${newPlace.name}/400/300`
    };
    
    const allPlaces = JSON.parse(localStorage.getItem('places')) || [];
    const updated = [...(Array.isArray(allPlaces) ? allPlaces : []), place];
    localStorage.setItem('places', JSON.stringify(updated));
    setMyPlaces((Array.isArray(updated) ? updated : []).filter(p => p.guideId === user.id));
    
    // Add notification
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    localStorage.setItem('notifications', JSON.stringify([
      ...notifications,
      { id: Date.now(), message: `New place added: ${place.name}`, time: new Date() }
    ]));

    setShowAdd(false);
    setNewPlace({ name: '', location: '', category: 'Nature', description: '', image: '' });
    window.dispatchEvent(new Event('storage'));
  };

  const handleDelete = (id) => {
    const allPlaces = JSON.parse(localStorage.getItem('places')) || [];
    const updated = (Array.isArray(allPlaces) ? allPlaces : []).filter(p => p.id !== id);
    localStorage.setItem('places', JSON.stringify(updated));
    setMyPlaces((Array.isArray(updated) ? updated : []).filter(p => p.guideId === user.id));
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="container">
      <div className="dashboard-layout">
        <aside className="sidebar glass">
          <div className="sidebar-nav">
            <button 
              className={`sidebar-item ${activeTab === 'recommendations' ? 'active' : ''}`}
              onClick={() => setActiveTab('recommendations')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', color: 'inherit' }}
            >
              <MapPin size={20} /> My Recommendations
            </button>
            <button 
              className={`sidebar-item ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', color: 'inherit' }}
            >
              <Star size={20} /> Reviews Received
            </button>
          </div>
        </aside>

        <main>
          {activeTab === 'recommendations' ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>Guide Dashboard</h1>
                <button className="btn btn-primary" onClick={() => setShowAdd(true)}><Plus size={20} /> Add Place</button>
              </div>

              {showAdd && (
                <div className="glass" style={{ padding: '30px', marginBottom: '40px' }}>
                  <h3>Recommend a New Place</h3>
                  <form onSubmit={handleAdd} style={{ marginTop: '20px' }}>
                    <div className="form-group">
                      <label className="form-label">Place Name</label>
                      <input type="text" className="form-control" required value={newPlace.name} onChange={e => setNewPlace({...newPlace, name: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Location</label>
                      <input type="text" className="form-control" required value={newPlace.location} onChange={e => setNewPlace({...newPlace, location: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <select className="form-control" value={newPlace.category} onChange={e => setNewPlace({...newPlace, category: e.target.value})}>
                        <option>Nature</option>
                        <option>Historical</option>
                        <option>Food</option>
                        <option>Adventure</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <textarea className="form-control" required value={newPlace.description} onChange={e => setNewPlace({...newPlace, description: e.target.value})}></textarea>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Place Image</label>
                      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <label className="btn btn-outline" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Upload size={18} /> Upload Image
                          <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                        </label>
                        {newPlace.image && (
                          <img src={newPlace.image} alt="Preview" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                      <button type="submit" className="btn btn-primary">Add Recommendation</button>
                      <button type="button" className="btn btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
                    </div>
                  </form>
                </div>
              )}

              <section>
                <h2>My Recommended Places</h2>
                <div className="grid" style={{ marginTop: '20px' }}>
                  {Array.isArray(myPlaces) && myPlaces.length > 0 ? (Array.isArray(myPlaces) ? myPlaces : []).map(place => (
                    <div key={place.id} className="card glass">
                      <img src={place.image} alt={place.name} className="card-img" referrerPolicy="no-referrer" />
                      <div className="card-content">
                        <h3 className="card-title">{place.name}</h3>
                        <p className="card-location">{place.location}</p>
                        <p style={{ fontSize: '0.8rem', marginTop: '10px' }}>{place.description}</p>
                        <button className="btn btn-outline" style={{ marginTop: '15px', color: 'red', width: '100%' }} onClick={() => handleDelete(place.id)}>
                          <Trash2 size={16} /> Remove
                        </button>
                      </div>
                    </div>
                  )) : <p style={{ opacity: 0.5 }}>No recommendations yet.</p>}
                </div>
              </section>
            </>
          ) : (
            <section>
              <h1>Reviews Received</h1>
              <p style={{ opacity: 0.7, marginBottom: '30px' }}>Feedback from tourists who visited your recommended places.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {Array.isArray(reviews) && reviews.length > 0 ? (Array.isArray(reviews) ? reviews : []).map(review => (
                  <div key={review.id} className="glass" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <h4 style={{ margin: 0 }}>{review.user || review.userName}</h4>
                      <div style={{ display: 'flex', color: '#ffb400' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} fill={i < review.rating ? 'currentColor' : 'none'} />
                        ))}
                      </div>
                    </div>
                    <p style={{ fontStyle: 'italic', opacity: 0.8 }}>"{review.comment}"</p>
                    <p style={{ fontSize: '0.8rem', opacity: 0.5, marginTop: '10px' }}>
                      Reviewed on: {review.date || new Date(review.id).toLocaleDateString()}
                    </p>
                  </div>
                )) : (
                  <div className="glass" style={{ padding: '40px', textAlign: 'center', opacity: 0.5 }}>
                    <p>No reviews yet</p>
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
