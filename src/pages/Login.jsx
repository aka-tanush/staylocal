import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Globe, Phone, Apple, Facebook } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'Tourist',
    name: ''
  });
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = {
      id: Date.now(),
      name: formData.name || formData.email.split('@')[0],
      email: formData.email,
      role: formData.role
    };
    localStorage.setItem('user', JSON.stringify(user));
    
    // Redirect based on role
    switch (user.role) {
      case 'Admin': navigate('/admin-dashboard'); break;
      case 'Host': navigate('/host-dashboard'); break;
      case 'Local Guide': navigate('/guide-dashboard'); break;
      default: navigate('/tourist-dashboard');
    }
  };

  return (
    <div className="login-container glass">
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
        {isRegister ? 'Create Account' : 'Welcome Back'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '12px', opacity: 0.5 }} />
              <input 
                type="text" 
                className="form-control" 
                style={{ paddingLeft: '40px' }}
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
          </div>
        )}
        
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', opacity: 0.5 }} />
            <input 
              type="email" 
              className="form-control" 
              style={{ paddingLeft: '40px' }}
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label">Password</label>
          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', opacity: 0.5 }} />
            <input 
              type="password" 
              className="form-control" 
              style={{ paddingLeft: '40px' }}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label">Select Role</label>
          <select 
            className="form-control"
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
          >
            <option value="Tourist">Tourist</option>
            <option value="Host">Host</option>
            <option value="Local Guide">Local Guide</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
          {isRegister ? 'Sign Up' : 'Login'}
        </button>
      </form>
      
      <div style={{ textAlign: 'center', margin: '20px 0', opacity: 0.5 }}>OR</div>
      
      <div className="social-login">
        <button className="social-btn"><Globe size={18} /> Continue with Google</button>
        <button className="social-btn"><Phone size={18} /> Continue with Phone</button>
        <button className="social-btn"><Apple size={18} /> Continue with Apple</button>
      </div>
      
      <p style={{ textAlign: 'center', marginTop: '30px' }}>
        {isRegister ? 'Already have an account?' : "Don't have an account?"}
        <button 
          onClick={() => setIsRegister(!isRegister)}
          style={{ color: 'var(--primary)', fontWeight: '600', marginLeft: '5px' }}
        >
          {isRegister ? 'Login' : 'Sign Up'}
        </button>
      </p>
    </div>
  );
}
