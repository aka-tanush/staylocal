import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Homestays from './pages/Homestays';
import Attractions from './pages/Attractions';
import TouristDashboard from './pages/TouristDashboard';
import HostDashboard from './pages/HostDashboard';
import LocalGuideDashboard from './pages/LocalGuideDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Settings from './pages/Settings';
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  useEffect(() => {
    // Initialize sample data if empty
    if (!localStorage.getItem('homestays')) {
      const sampleStays = [
        { id: 1, name: 'Mountain Retreat', location: 'Manali, HP', price: 2500, rating: '4.8', image: 'https://picsum.photos/seed/manali/800/600', hostId: 101 },
      ];
      localStorage.setItem('homestays', JSON.stringify(sampleStays));
    }
  }, []);

  return (
    <Router>
      <div className="app-wrapper">
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - 160px)' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/homestays" element={<Homestays />} />
            <Route path="/attractions" element={<Attractions />} />

            <Route path="/tourist-dashboard" element={
              <ProtectedRoute role="tourist"><TouristDashboard /></ProtectedRoute>
            } />
            <Route path="/host-dashboard" element={
              <ProtectedRoute role="host"><HostDashboard /></ProtectedRoute>
            } />
            <Route path="/guide-dashboard" element={
              <ProtectedRoute role="local guide"><LocalGuideDashboard /></ProtectedRoute>
            } />
            <Route path="/admin-dashboard" element={
              <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute><Settings /></ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
