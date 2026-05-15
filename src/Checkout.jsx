import React, { useState } from 'react';
import './Checkout.css';

export default function Checkout({ course, onBack, onComplete }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onComplete();
      }, 1500);
    }, 2000);
  };

  // Safe fallbacks for course properties to absolutely prevent crashes
  const safeCourse = course || {};
  const price = typeof safeCourse.price === 'number' ? safeCourse.price : parseFloat(safeCourse.price) || 0;

  if (isSuccess) {
    return (
      <div className="registration-success-container">
        <div className="success-icon">✓</div>
        <h2>Registration & Payment Successful!</h2>
        <p>Redirecting you to your course...</p>
      </div>
    );
  }

  return (
    <div className="registration-page-wrapper">
      <div className="registration-top-bar">
        <button type="button" className="btn-back" onClick={onBack}>
          ← Back
        </button>
      </div>

      <div className="registration-container">
        <div className="registration-header">
          <h1>{safeCourse.title ? `Registration: ${safeCourse.title}` : 'Course Registration'}</h1>
          <p>Register quickly and securely by scanning your QR code and providing your details.</p>
        </div>

        <div className="qr-section">
          <p className="qr-label">Scan your QR code to begin registration</p>
          <img 
            src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=course-registration" 
            alt="QR Code" 
            className="qr-image"
          />
        </div>

        <form className="registration-form" onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="form-row">
              <div className="form-col">
                <input type="text" className="form-input" placeholder="" required />
                <span className="input-hint">First Name</span>
              </div>
              <div className="form-col">
                <input type="text" className="form-input" placeholder="" required />
                <span className="input-hint">Last Name</span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" placeholder="example@example.com" required />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input type="tel" className="form-input" placeholder="(000) 000-0000" required />
            <span className="input-hint">Please enter a valid phone number.</span>
          </div>

          <div className="form-group">
            <label className="form-label">Organization or Company Name (if applicable)</label>
            <input type="text" className="form-input" placeholder="" />
          </div>

          <div className="form-group">
            <label className="form-label">Select your registration type</label>
            <select className="form-select" required>
              <option value="">Please Select</option>
              <option value="student">Student</option>
              <option value="professional">Professional</option>
              <option value="corporate">Corporate</option>
            </select>
          </div>

          {/* Payment Section */}
          <div className="payment-section">
            <h3 className="payment-title">Payment Option</h3>
            <p className="payment-amount">Total Amount: ₹{price.toLocaleString('en-IN')}</p>
            
            <div className="form-group">
              <label className="form-label">Card Number</label>
              <input type="text" className="form-input" placeholder="0000 0000 0000 0000" maxLength="19" required />
            </div>
            <div className="form-row">
              <div className="form-col">
                <label className="form-label">Expiry</label>
                <input type="text" className="form-input" placeholder="MM/YY" maxLength="5" required />
              </div>
              <div className="form-col">
                <label className="form-label">CVC</label>
                <input type="text" className="form-input" placeholder="123" maxLength="4" required />
              </div>
            </div>
          </div>

          <div className="form-checkbox-group">
            <label className="checkbox-label">
              <input type="checkbox" required className="form-checkbox" />
              <span>I agree to the event terms and privacy policy <span className="required-star">*</span></span>
            </label>
          </div>

          <div className="form-submit-container">
            <button 
              type="submit" 
              className={`btn-register ${isProcessing ? 'processing' : ''}`}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
