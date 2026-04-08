import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, Star, Heart, ArrowRight } from 'lucide-react';
import api from '../services/api';
import HomestayCard from '../components/HomestayCard';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [search, setSearch] = useState({ location: '', date: '', guests: 1 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/homestays');
        const data = res.data.homestays || res.data;
        setFeatured(data.slice(0, 4));
      } catch (err) {
        console.error("Failed to load featured homestays", err);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/homestays?location=${search.location}&guests=${search.guests}`);
  };

  return (
    <div className="home-page">
      <section className="hero">
        <div className="container">
          <h1>Find your next home away from home.</h1>
          <form className="search-bar glass" onSubmit={handleSearch}>
            <div className="search-group">
              <label className="search-label">Location</label>
              <input 
                type="text" 
                placeholder="Where are you going?" 
                className="search-input"
                value={search.location}
                onChange={(e) => setSearch({...search, location: e.target.value})}
              />
            </div>
            <div className="search-group">
              <label className="search-label">Check in</label>
              <input 
                type="date" 
                className="search-input"
                value={search.date}
                onChange={(e) => setSearch({...search, date: e.target.value})}
              />
            </div>
            <div className="search-group">
              <label className="search-label">Guests</label>
              <input 
                type="number" 
                min="1" 
                className="search-input"
                value={search.guests}
                onChange={(e) => setSearch({...search, guests: e.target.value})}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              <Search size={20} />
            </button>
          </form>
        </div>
      </section>

      <section className="container">
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2>Featured Homestays</h2>
          <Link to="/homestays" className="nav-item" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            View all <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid">
          {featured.length > 0 ? (
            featured.map(item => (
              <HomestayCard key={item._id || item.id} homestay={item} />
            ))
          ) : (
            <p>No homestays available. Log in as Host to add some!</p>
          )}
        </div>
      </section>

      <section className="container" style={{ marginBottom: '80px' }}>
        <h2>Explore Nearby Attractions</h2>
        <div className="grid" style={{ marginTop: '30px' }}>
          {[
            { id: 1, name: 'Mountain View Point', location: 'Himachal', img: 'https://picsum.photos/seed/mountain/400/300' },
            { id: 2, name: 'Crystal Lake', location: 'Uttarakhand', img: 'https://picsum.photos/seed/lake/400/300' },
            { id: 3, name: 'Old Town Market', location: 'Rajasthan', img: 'https://picsum.photos/seed/market/400/300' },
            { id: 4, name: 'Sunset Beach', location: 'Goa', img: 'https://picsum.photos/seed/beach/400/300' },
          ].map(attr => (
            <div key={attr.id} className="card glass">
              <img src={attr.img} alt={attr.name} className="card-img" referrerPolicy="no-referrer" />
              <div className="card-content">
                <h3 className="card-title">{attr.name}</h3>
                <p className="card-location"><MapPin size={14} /> {attr.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: 'var(--border-color)', padding: '80px 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '50px' }}>What our travelers say</h2>
          <div className="grid">
            {[
              { id: 1, name: 'Sarah J.', text: 'The most authentic experience I have ever had. StayLocal made it so easy!', rating: 5 },
              { id: 2, name: 'Mark T.', text: 'Our guide was incredible. We saw places we would never have found alone.', rating: 5 },
              { id: 3, name: 'Elena R.', text: 'Beautiful homestay, warm hosts, and great memories.', rating: 4 },
            ].map(rev => (
              <div key={rev.id} className="glass" style={{ padding: '30px' }}>
                <div className="stars">
                  {[...Array(rev.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p style={{ fontStyle: 'italic', marginBottom: '20px' }}>"{rev.text}"</p>
                <p style={{ fontWeight: '700' }}>- {rev.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
