import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h4 className="nav-logo"><MapPin size={20} /> StayLocal</h4>
            <p style={{ opacity: 0.7, marginTop: '10px' }}>
              Connecting travelers with authentic local experiences and comfortable homestays around the world.
            </p>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <ul className="footer-links">
              <li>Help Center</li>
              <li>Safety Information</li>
              <li>Cancellation Options</li>
              <li>Our COVID-19 Response</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Hosting</h4>
            <ul className="footer-links">
              <li>Try Hosting</li>
              <li>AirCover for Hosts</li>
              <li>Explore Hosting Resources</li>
              <li>How to Host Responsibly</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Follow Us</h4>
            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
              <Facebook size={20} />
              <Twitter size={20} />
              <Instagram size={20} />
              <Youtube size={20} />
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', textAlign: 'center', opacity: 0.5, fontSize: '0.9rem' }}>
          © 2026 StayLocal, Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
