import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Globe } from 'lucide-react';
import { createBooking } from '../services/bookingApi';

export default function BookingModal({ homestay, onClose }) {
  const [step, setStep] = useState(1); // 1: Details, 2: Payment
  const [booking, setBooking] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1
  });
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [success, setSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const newBooking = {
        homestayId: homestay._id,
        checkInDate: booking.checkIn,
        checkOutDate: booking.checkOut,
        guests: booking.guests
      };

      await createBooking(newBooking);
      setIsProcessing(false);
      setSuccess(true);
      
      setTimeout(() => {
        onClose();
      }, 2500);
    } catch (err) {
      console.error('Booking failed:', err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal glass">
        <button className="modal-close" onClick={onClose}><X size={24} /></button>
        
        {success ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '3rem', color: '#4caf50', marginBottom: '10px' }}>✓</div>
            <h3>Payment Successful & Booking Confirmed!</h3>
            <p>Your stay at {homestay.name} is confirmed.</p>
          </div>
        ) : step === 1 ? (
          <>
            <h2>Book your stay</h2>
            <p style={{ marginBottom: '20px', opacity: 0.7 }}>{homestay.name} - {homestay.location}</p>
            
            <form onSubmit={handleNext}>
              <div className="form-group">
                <label className="form-label">Check-in Date</label>
                <input 
                  type="date" 
                  className="form-control" 
                  required
                  value={booking.checkIn}
                  onChange={(e) => setBooking({...booking, checkIn: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Check-out Date</label>
                <input 
                  type="date" 
                  className="form-control" 
                  required
                  value={booking.checkOut}
                  onChange={(e) => setBooking({...booking, checkOut: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Number of Guests</label>
                <input 
                  type="number" 
                  min="1" 
                  className="form-control" 
                  required
                  value={booking.guests}
                  onChange={(e) => setBooking({...booking, guests: e.target.value})}
                />
              </div>
              
              <div style={{ marginTop: '30px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '1.2rem' }}>
                  <span>Total</span>
                  <span>₹{homestay.price}</span>
                </div>
              </div>
              
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }}>
                Proceed to Payment
              </button>
            </form>
          </>
        ) : (
          <>
            <h2>Secure Payment</h2>
            <p style={{ marginBottom: '20px', opacity: 0.7 }}>Choose your preferred payment method</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                className={`glass ${paymentMethod === 'UPI' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('UPI')}
                style={{ 
                  padding: '15px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  cursor: 'pointer',
                  border: paymentMethod === 'UPI' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  background: 'none',
                  textAlign: 'left',
                  width: '100%',
                  color: 'inherit'
                }}
              >
                <Smartphone size={20} color="var(--primary)" />
                <div>
                  <p style={{ fontWeight: '600', margin: 0 }}>UPI</p>
                  <p style={{ fontSize: '0.8rem', opacity: 0.6, margin: 0 }}>Google Pay, PhonePe, Paytm</p>
                </div>
              </button>

              <button 
                className={`glass ${paymentMethod === 'Card' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('Card')}
                style={{ 
                  padding: '15px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  cursor: 'pointer',
                  border: paymentMethod === 'Card' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  background: 'none',
                  textAlign: 'left',
                  width: '100%',
                  color: 'inherit'
                }}
              >
                <CreditCard size={20} color="var(--primary)" />
                <div>
                  <p style={{ fontWeight: '600', margin: 0 }}>Credit / Debit Card</p>
                  <p style={{ fontSize: '0.8rem', opacity: 0.6, margin: 0 }}>Visa, Mastercard, RuPay</p>
                </div>
              </button>

              <button 
                className={`glass ${paymentMethod === 'NetBanking' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('NetBanking')}
                style={{ 
                  padding: '15px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  cursor: 'pointer',
                  border: paymentMethod === 'NetBanking' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  background: 'none',
                  textAlign: 'left',
                  width: '100%',
                  color: 'inherit'
                }}
              >
                <Globe size={20} color="var(--primary)" />
                <div>
                  <p style={{ fontWeight: '600', margin: 0 }}>Net Banking</p>
                  <p style={{ fontSize: '0.8rem', opacity: 0.6, margin: 0 }}>All major Indian banks</p>
                </div>
              </button>
            </div>

            <div style={{ marginTop: '30px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '1.2rem', marginBottom: '20px' }}>
                <span>Amount to Pay</span>
                <span>₹{homestay.price}</span>
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  className="btn btn-outline" 
                  style={{ flex: 1 }} 
                  onClick={() => setStep(1)}
                  disabled={isProcessing}
                >
                  Back
                </button>
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 2 }} 
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : `Pay ₹${homestay.price}`}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
