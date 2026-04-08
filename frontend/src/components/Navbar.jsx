import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Search, Heart, User, Bell, LogOut, Sun, Moon, Clock } from 'lucide-react';

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    const loadNotifications = () => {
      const stored = JSON.parse(localStorage.getItem('notifications')) || [];
      setNotifications(stored);
    };

    loadNotifications();
    window.addEventListener('storage', loadNotifications);
    const interval = setInterval(loadNotifications, 1000);

    return () => {
      window.removeEventListener('storage', loadNotifications);
      clearInterval(interval);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const clearNotifications = () => {
    localStorage.setItem('notifications', JSON.stringify([]));
    setNotifications([]);
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'Admin': return '/admin-dashboard';
      case 'Host': return '/host-dashboard';
      case 'Local Guide': return '/guide-dashboard';
      default: return '/tourist-dashboard';
    }
  };

  return (
    <>
      <nav className="navbar container">
        <Link to="/" className="nav-logo">
          <MapPin size={28} /> StayLocal
        </Link>

        <div className="nav-links">
          <Link to="/" className="nav-item">Home</Link>
          <Link to="/homestays" className="nav-item">Homestays</Link>
          <Link to="/attractions" className="nav-item">Attractions</Link>
        </div>

        <div className="nav-actions">
          <button onClick={toggleTheme} className="nav-item">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {user ? (
            <>
              <div style={{ position: 'relative' }}>
                <button onClick={() => setShowNotifications(!showNotifications)} className="nav-item" style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>
                  <Bell size={20} />
                  {notifications.length > 0 && <span className="notification-badge">{notifications.length}</span>}
                </button>

                {showNotifications && (
                  <div className="glass" style={{ 
                    position: 'absolute', 
                    top: '40px', 
                    right: '0', 
                    width: '300px', 
                    maxHeight: '400px', 
                    overflowY: 'auto', 
                    zIndex: 1001,
                    padding: '15px',
                    boxShadow: 'var(--shadow)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                      <h4 style={{ margin: 0 }}>Notifications</h4>
                      <button onClick={clearNotifications} style={{ fontSize: '0.8rem', color: 'var(--primary)', cursor: 'pointer' }}>Clear All</button>
                    </div>
                    {Array.isArray(notifications) && notifications.length > 0 ? (
                      (Array.isArray(notifications) ? notifications : []).slice().reverse().map(n => (
                        <div key={n.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem' }}>
                          <p style={{ margin: 0 }}>{n.message}</p>
                          <span style={{ fontSize: '0.75rem', opacity: 0.5, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                            <Clock size={12} /> {new Date(n.time).toLocaleTimeString()}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p style={{ textAlign: 'center', opacity: 0.5, padding: '20px 0' }}>No new notifications</p>
                    )}
                  </div>
                )}
              </div>
              <Link to={getDashboardLink()} className="nav-item">
                <User size={20} />
              </Link>
              <button onClick={handleLogout} className="nav-item">
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary">Login</Link>
          )}
        </div>
      </nav>

      <div className="mobile-nav">
        <Link to="/"><Home size={24} /></Link>
        <Link to="/homestays"><Search size={24} /></Link>
        <Link to={getDashboardLink()}><Heart size={24} /></Link>
        <Link to="/settings"><User size={24} /></Link>
      </div>
    </>
  );
}

function MapPin(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
