import React, { useState, useEffect } from 'react';
import { Users, Home, MapPin, Calendar, TrendingUp, Shield, Trash2, Bell, Moon, Sun } from 'lucide-react';
import api from '../services/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [homestays, setHomestays] = useState([]);
  const [places, setPlaces] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [adminSettings, setAdminSettings] = useState({
    notifications: true,
    darkMode: false
  });

  const adminUser = JSON.parse(localStorage.getItem('user')) || { name: 'Admin', email: 'admin@staylocal.com' };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [homestayRes] = await Promise.all([
          api.get('/homestays'),
        ]);
        setHomestays(homestayRes.data);

        const storedSettings = JSON.parse(localStorage.getItem('adminSettings')) || { notifications: true, darkMode: false };
        setAdminSettings(storedSettings);
      } catch (err) {
        console.error('Failed to load admin data:', err);
      }
    };

    loadData();
  }, []);

  const handleDeleteUser = (id) => {
    const updatedUsers = users.filter(u => u._id !== id);
    setUsers(updatedUsers);
  };

  const handleDeleteListing = async (id) => {
    try {
      await api.delete(`/homestays/${id}`);
      setHomestays(homestays.filter(h => h._id !== id));
    } catch (err) {
      console.error('Failed to delete listing:', err);
    }
  };

  const toggleSetting = (key) => {
    const updatedSettings = { ...adminSettings, [key]: !adminSettings[key] };
    setAdminSettings(updatedSettings);
    localStorage.setItem('adminSettings', JSON.stringify(updatedSettings));
    
    if (key === 'darkMode') {
      document.documentElement.setAttribute('data-theme', updatedSettings.darkMode ? 'dark' : 'light');
    }
  };

  const renderOverview = () => (
    <>
      <h1>Platform Analytics</h1>
      <p style={{ opacity: 0.7, marginBottom: '30px' }}>Real-time overview of StayLocal performance.</p>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <div className="glass" style={{ padding: '25px', textAlign: 'center' }}>
          <Users size={32} color="var(--primary)" style={{ marginBottom: '10px' }} />
          <h3>{users.length + 1}</h3>
          <p style={{ opacity: 0.6 }}>Total Users</p>
        </div>
        <div className="glass" style={{ padding: '25px', textAlign: 'center' }}>
          <Home size={32} color="var(--secondary)" style={{ marginBottom: '10px' }} />
          <h3>{homestays.length}</h3>
          <p style={{ opacity: 0.6 }}>Total Homestays</p>
        </div>
        <div className="glass" style={{ padding: '25px', textAlign: 'center' }}>
          <MapPin size={32} color="#ffb400" style={{ marginBottom: '10px' }} />
          <h3>{places.length}</h3>
          <p style={{ opacity: 0.6 }}>Total Places</p>
        </div>
        <div className="glass" style={{ padding: '25px', textAlign: 'center' }}>
          <Calendar size={32} color="#4caf50" style={{ marginBottom: '10px' }} />
          <h3>{bookings.length}</h3>
          <p style={{ opacity: 0.6 }}>Total Bookings</p>
        </div>
      </div>

      <section style={{ marginTop: '50px' }}>
        <h2>Recent Activity</h2>
        <div className="glass" style={{ marginTop: '20px', padding: '0' }}>
          {[
            { id: 1, user: 'Rahul K.', action: 'booked', item: 'Mountain Retreat', time: '2 mins ago' },
            { id: 2, user: 'Anita S.', action: 'added', item: 'Beachside Villa', time: '15 mins ago' },
            { id: 3, user: 'Guide John', action: 'recommended', item: 'Hidden Waterfall', time: '1 hour ago' },
            { id: 4, user: 'Admin', action: 'updated', item: 'Platform Rules', time: '3 hours ago' },
          ].map(activity => (
            <div key={activity.id} style={{ padding: '15px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
              <span><strong>{activity.user}</strong> {activity.action} {activity.item}</span>
              <span style={{ opacity: 0.5, fontSize: '0.9rem' }}>{activity.time}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );

  const renderManageUsers = () => (
    <>
      <h1>Manage Users</h1>
      <p style={{ opacity: 0.7, marginBottom: '30px' }}>View and manage all registered users on the platform.</p>
      
      <div className="glass" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '15px 20px' }}>Name</th>
              <th style={{ padding: '15px 20px' }}>Email</th>
              <th style={{ padding: '15px 20px' }}>Role</th>
              <th style={{ padding: '15px 20px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map(user => (
                <tr key={user._id || user.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '15px 20px' }}>{user.name}</td>
                  <td style={{ padding: '15px 20px' }}>{user.email}</td>
                  <td style={{ padding: '15px 20px' }}>
                    <span className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '4px 10px' }}>{user.role}</span>
                  </td>
                  <td style={{ padding: '15px 20px' }}>
                    <button 
                      onClick={() => handleDeleteUser(user._id || user.id)}
                      style={{ color: 'var(--primary)', cursor: 'pointer' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ padding: '30px', textAlign: 'center', opacity: 0.5 }}>No users available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderManageListings = () => (
    <>
      <h1>Manage Listings</h1>
      <p style={{ opacity: 0.7, marginBottom: '30px' }}>Review and manage all homestay listings.</p>
      
      <div className="grid">
        {homestays.length > 0 ? (
          homestays.map(stay => (
            <div key={stay._id || stay.id} className="card glass">
              <img src={stay.images?.[0] || stay.image || "https://picsum.photos/400/300"} alt={stay.title || stay.name} className="card-img" referrerPolicy="no-referrer" />
              <div className="card-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 className="card-title">{stay.title || stay.name}</h3>
                  <button 
                    onClick={() => handleDeleteListing(stay._id || stay.id)}
                    style={{ color: 'var(--primary)', cursor: 'pointer' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <p className="card-location"><MapPin size={14} /> {stay.location}</p>
                <p className="card-price">₹{stay.price} <span>/ night</span></p>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '50px' }}>
            <p style={{ opacity: 0.5 }}>No listings available</p>
          </div>
        )}
      </div>
    </>
  );

  const renderSecurity = () => (
    <>
      <h1>Security & Settings</h1>
      <p style={{ opacity: 0.7, marginBottom: '30px' }}>Manage platform security and your personal preferences.</p>
      
      <div className="glass" style={{ padding: '30px', maxWidth: '600px' }}>
        <div style={{ marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ marginBottom: '15px' }}>Admin Profile</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'white', fontSize: '1.5rem', fontWeight: '700' }}>
              {adminUser.name.charAt(0)}
            </div>
            <div>
              <p style={{ fontWeight: '600', fontSize: '1.1rem' }}>{adminUser.name}</p>
              <p style={{ opacity: 0.6 }}>{adminUser.email}</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontWeight: '600' }}>Platform Notifications</p>
              <p style={{ fontSize: '0.85rem', opacity: 0.6 }}>Receive alerts for new bookings and users</p>
            </div>
            <button 
              onClick={() => toggleSetting('notifications')}
              style={{ 
                width: '50px', 
                height: '26px', 
                borderRadius: '13px', 
                background: adminSettings.notifications ? 'var(--primary)' : '#ccc',
                position: 'relative',
                transition: 'all 0.3s'
              }}
            >
              <div style={{ 
                width: '20px', 
                height: '20px', 
                borderRadius: '50%', 
                background: 'white', 
                position: 'absolute', 
                top: '3px', 
                left: adminSettings.notifications ? '27px' : '3px',
                transition: 'all 0.3s'
              }} />
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontWeight: '600' }}>Dark Mode</p>
              <p style={{ fontSize: '0.85rem', opacity: 0.6 }}>Switch between light and dark themes</p>
            </div>
            <button 
              onClick={() => toggleSetting('darkMode')}
              style={{ 
                width: '50px', 
                height: '26px', 
                borderRadius: '13px', 
                background: adminSettings.darkMode ? 'var(--primary)' : '#ccc',
                position: 'relative',
                transition: 'all 0.3s'
              }}
            >
              <div style={{ 
                width: '20px', 
                height: '20px', 
                borderRadius: '50%', 
                background: 'white', 
                position: 'absolute', 
                top: '3px', 
                left: adminSettings.darkMode ? '27px' : '3px',
                transition: 'all 0.3s'
              }} />
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="container">
      <div className="dashboard-layout">
        <aside className="sidebar glass">
          <div className="sidebar-nav">
            <button 
              className={`sidebar-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', color: 'inherit' }}
            >
              <TrendingUp size={20} /> Overview
            </button>
            <button 
              className={`sidebar-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', color: 'inherit' }}
            >
              <Users size={20} /> Manage Users
            </button>
            <button 
              className={`sidebar-item ${activeTab === 'listings' ? 'active' : ''}`}
              onClick={() => setActiveTab('listings')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', color: 'inherit' }}
            >
              <Home size={20} /> Manage Listings
            </button>
            <button 
              className={`sidebar-item ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', color: 'inherit' }}
            >
              <Shield size={20} /> Security
            </button>
          </div>
        </aside>

        <main>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'users' && renderManageUsers()}
          {activeTab === 'listings' && renderManageListings()}
          {activeTab === 'security' && renderSecurity()}
        </main>
      </div>
    </div>
  );
}
