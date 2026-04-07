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

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

export default function App() {
  useEffect(() => {
    // Initialize sample data if empty
    if (!localStorage.getItem('homestays')) {
      const sampleStays = [
        { id: 1, name: 'Mountain Retreat', location: 'Manali, HP', price: 2500, rating: '4.8', image: 'https://picsum.photos/seed/manali/800/600', hostId: 101 },
        { id: 2, name: 'Beachside Villa', location: 'Goa', price: 4500, rating: '4.9', image: 'https://picsum.photos/seed/goa/800/600', hostId: 102 },
        { id: 3, name: 'Heritage Haveli', location: 'Jaipur, RJ', price: 3200, rating: '4.7', image: 'https://picsum.photos/seed/jaipur/800/600', hostId: 101 },
        { id: 4, name: 'Lakeside Cottage', location: 'Nainital, UK', price: 2800, rating: '4.6', image: 'https://picsum.photos/seed/lake/800/600', hostId: 103 },
        { id: 5, name: 'Tea Garden Stay', location: 'Munnar, KL', price: 2200, rating: '4.9', image: 'https://picsum.photos/seed/munnar/800/600', hostId: 102 },
        { id: 6, name: 'Forest Log Cabin', location: 'Coorg, KA', price: 3500, rating: '4.5', image: 'https://picsum.photos/seed/forest/800/600', hostId: 101 },
      ];
      localStorage.setItem('homestays', JSON.stringify(sampleStays));
    }

    if (!localStorage.getItem('places')) {
      const samplePlaces = [
        { id: 1, name: 'Rohtang Pass', location: 'Manali', category: 'Adventure', description: 'A high mountain pass on the eastern Pir Panjal Range of the Himalayas.', guideId: 201, guideName: 'Local Guide Amit', image: 'https://picsum.photos/seed/rohtang/400/300' },
        { id: 2, name: 'Amber Fort', location: 'Jaipur', category: 'Historical', description: 'A majestic fort located high on a hill, known for its artistic style elements.', guideId: 202, guideName: 'Local Guide Priya', image: 'https://picsum.photos/seed/amber/400/300' },
      ];
      localStorage.setItem('places', JSON.stringify(samplePlaces));
    }

    if (!localStorage.getItem('users')) {
      const sampleUsers = [
        { id: 101, name: 'Rahul Khanna', email: 'rahul@example.com', role: 'Host' },
        { id: 102, name: 'Anita Sharma', email: 'anita@example.com', role: 'Host' },
        { id: 201, name: 'Guide Amit', email: 'amit@guide.com', role: 'Local Guide' },
        { id: 301, name: 'Tanush Kumar', email: 'mtanushkumar@gmail.com', role: 'Tourist' },
      ];
      localStorage.setItem('users', JSON.stringify(sampleUsers));
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
              <ProtectedRoute allowedRoles={['Tourist']}><TouristDashboard /></ProtectedRoute>
            } />
            <Route path="/host-dashboard" element={
              <ProtectedRoute allowedRoles={['Host']}><HostDashboard /></ProtectedRoute>
            } />
            <Route path="/guide-dashboard" element={
              <ProtectedRoute allowedRoles={['Local Guide']}><LocalGuideDashboard /></ProtectedRoute>
            } />
            <Route path="/admin-dashboard" element={
              <ProtectedRoute allowedRoles={['Admin']}><AdminDashboard /></ProtectedRoute>
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
