import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin } from 'lucide-react';
import HomestayCard from '../components/HomestayCard';

export default function Homestays() {
  const [homestays, setHomestays] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    priceRange: 5000,
    minRating: 0
  });

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('homestays')) || [];
    setHomestays(data);
    setFiltered(data);
  }, []);

  useEffect(() => {
    let result = homestays.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(filters.search.toLowerCase());
      const matchesLocation = item.location.toLowerCase().includes(filters.location.toLowerCase());
      const matchesPrice = item.price <= filters.priceRange;
      const matchesRating = item.rating >= filters.minRating;
      return matchesSearch && matchesLocation && matchesPrice && matchesRating;
    });
    setFiltered(result);
  }, [filters, homestays]);

  return (
    <div className="container" style={{ marginTop: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1>Explore Homestays</h1>
          <p style={{ opacity: 0.7 }}>Find the perfect place to stay from our curated list.</p>
        </div>
        
        <div className="glass" style={{ padding: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '12px', opacity: 0.5 }} />
            <input 
              type="text" 
              placeholder="Search stays..." 
              className="form-control"
              style={{ paddingLeft: '35px', width: '200px' }}
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <MapPin size={18} style={{ position: 'absolute', left: '10px', top: '12px', opacity: 0.5 }} />
            <input 
              type="text" 
              placeholder="Location..." 
              className="form-control"
              style={{ paddingLeft: '35px', width: '150px' }}
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>Max Price: ₹{filters.priceRange}</label>
            <input 
              type="range" 
              min="500" 
              max="10000" 
              step="500"
              value={filters.priceRange}
              onChange={(e) => setFilters({...filters, priceRange: parseInt(e.target.value)})}
            />
          </div>
        </div>
      </div>

      <div className="grid">
        {filtered.length > 0 ? (
          filtered.map(item => (
            <HomestayCard key={item.id} homestay={item} />
          ))
        ) : (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px 0' }}>
            <h3>No homestays found matching your criteria.</h3>
            <button className="btn btn-outline" onClick={() => setFilters({ search: '', location: '', priceRange: 10000, minRating: 0 })}>
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
