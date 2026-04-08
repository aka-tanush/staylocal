import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Globe, Phone, Apple } from 'lucide-react';
import api from '../services/api';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'tourist',
    name: ''
  });

  const [isRegister, setIsRegister] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      let res;

      if (isRegister) {
        res = await api.post('/auth/register', {
          name: formData.name || formData.email.split('@')[0],
          email: formData.email,
          password: formData.password,
          role: formData.role
        });
      } else {
        res = await api.post('/auth/login', {
          email: formData.email,
          password: formData.password
        });
      }

      const { user, token } = res.data;

      // ✅ Store data
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);

      // ✅ Role-based redirect
      switch (user.role?.toLowerCase()) {
        case 'admin':
          navigate('/admin-dashboard');
          break;
        case 'host':
          navigate('/host-dashboard');
          break;
        case 'local guide':
          navigate('/guide-dashboard');
          break;
        default:
          navigate('/tourist-dashboard');
      }

    } catch (err) {
      setErrorMsg(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Authentication failed'
      );
    }
  };

  return (
    <div className="login-container glass">
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
        {isRegister ? 'Create Account' : 'Welcome Back'}
      </h2>

      {errorMsg && (
        <div style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Name (Register only) */}
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
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>
        )}

        {/* Email */}
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
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Password */}
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
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Role (Register only) */}
        {isRegister && (
          <div className="form-group">
            <label className="form-label">Select Role</label>
            <select
              className="form-control"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="tourist">Tourist</option>
              <option value="host">Host</option>
              <option value="local guide">Local Guide</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '10px' }}
        >
          {isRegister ? 'Sign Up' : 'Login'}
        </button>
      </form>

      <div style={{ textAlign: 'center', margin: '20px 0', opacity: 0.5 }}>
        OR
      </div>

      {/* Social buttons (UI only) */}
      <div className="social-login">
        <button className="social-btn"><Globe size={18} /> Continue with Google</button>
        <button className="social-btn"><Phone size={18} /> Continue with Phone</button>
        <button className="social-btn"><Apple size={18} /> Continue with Apple</button>
      </div>

      {/* Toggle */}
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