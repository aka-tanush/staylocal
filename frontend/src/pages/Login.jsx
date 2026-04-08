import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Globe, Phone, Apple } from 'lucide-react';
import { loginUser, registerUser } from '../services/authApi';

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
    console.log("Form submitted. Mode:", isRegister ? "Register" : "Login");
    console.log("Form Data:", { ...formData, password: '****' });

    try {
      let data;

      if (isRegister) {
        data = await registerUser({
          name: formData.name || formData.email.split('@')[0],
          email: formData.email,
          password: formData.password,
          role: formData.role
        });
      } else {
        data = await loginUser({
          email: formData.email,
          password: formData.password
        });
      }

      console.log("Auth successful. Response data:", data);

      const { token, ...user } = data;

      if (!token) {
        console.error("No token received from backend!");
        throw new Error("No authentication token received");
      }

      // ✅ Store data
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      console.log("Stored user and token in localStorage");

      // ✅ Role-based redirect
      const userRole = user.role?.toLowerCase();
      console.log("Redirecting based on role:", userRole);

      switch (userRole) {
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
      console.error("Auth process failed:", err);
      setErrorMsg(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
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