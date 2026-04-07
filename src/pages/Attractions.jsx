import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2 } from 'lucide-react';

export default function Attractions() {
  const [places, setPlaces] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('places')) || [];
    setPlaces(data);
  }, []);

  return (
    <div className="container" style={{ marginTop: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1>Local Attractions</h1>
          <p style={{ opacity: 0.7 }}>Recommended by our local guides and community.</p>
        </div>
        {user?.role === 'Local Guide' && (
          <button className="btn btn-primary" onClick={() => window.location.href='/guide-dashboard'}>
            <Plus size={20} /> Add Place
          </button>
        )}
      </div>

      <div className="grid">
        {places.length > 0 ? (
          places.map(place => (
            <div key={place.id} className="card glass">
              <img src={place.image || 'https://picsum.photos/seed/place/400/300'} alt={place.name} className="card-img" referrerPolicy="no-referrer" />
              <div className="card-content">
                <h3 className="card-title">{place.name}</h3>
                <p className="card-location"><MapPin size={14} /> {place.location}</p>
                <p style={{ marginTop: '10px', fontSize: '0.9rem', opacity: 0.8 }}>{place.description}</p>
                <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '5px 10px' }}>{place.category}</span>
                  <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>Added by {place.guideName}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No attractions added yet.</p>
        )}
      </div>
    </div>
  );
}
