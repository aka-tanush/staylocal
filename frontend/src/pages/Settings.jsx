import React, { useState } from 'react';
import { User, Mail, MapPin, Bell, Shield, Moon } from 'lucide-react';

export default function Settings() {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    location: user.location || 'New Delhi, India'
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    const updatedUser = { ...user, ...formData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);

    // Add notification
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    localStorage.setItem('notifications', JSON.stringify([
      ...notifications, 
      { id: Date.now(), message: `Profile updated successfully`, type: 'profile' }
    ]));
  };

  return (
    <div className="container">
      <div className="dashboard-layout">
        <aside className="sidebar glass">
          <div className="sidebar-nav">
            <div className="sidebar-item active"><User size={20} /> Profile Settings</div>
            <div className="sidebar-item"><Bell size={20} /> Notifications</div>
            <div className="sidebar-item"><Shield size={20} /> Security & Privacy</div>
            <div className="sidebar-item"><Moon size={20} /> Appearance</div>
          </div>
        </aside>

        <main>
          <h1>Settings</h1>
          <p style={{ opacity: 0.7, marginBottom: '30px' }}>Manage your account preferences and profile information.</p>

          <form className="glass" style={{ padding: '30px', maxWidth: '600px' }} onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '12px', opacity: 0.5 }} />
                <input 
                  type="text" 
                  className="form-control" 
                  style={{ paddingLeft: '40px' }}
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', opacity: 0.5 }} />
                <input 
                  type="email" 
                  className="form-control" 
                  style={{ paddingLeft: '40px' }}
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Location</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '12px', opacity: 0.5 }} />
                <input 
                  type="text" 
                  className="form-control" 
                  style={{ paddingLeft: '40px' }}
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              {saved ? 'Changes Saved!' : 'Save Changes'}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
