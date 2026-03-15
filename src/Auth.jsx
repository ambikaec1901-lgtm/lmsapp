import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Github } from 'lucide-react';
import './Auth.css';

import { API_URL } from './config';

export default function Auth({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Student'); // Student / Instructor / Admin

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          name: name || email.split('@')[0], 
          role 
        })
      });
      const userData = await res.json();
      onLogin(userData);
    } catch (err) {
      console.error(err);
      alert("Failed backend login.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-glow auth-glow-1"></div>
        <div className="auth-glow auth-glow-2"></div>
      </div>
      
      <div className="auth-card-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">
              {isSignUp ? 'Create an Account' : 'Welcome Back'}
            </h1>
            <p className="auth-subtitle">
              {isSignUp ? 'Join the ultimate learning experience.' : 'Log in to continue your learning journey.'}
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {isSignUp && (
              <div className="input-group">
                <div className="input-icon">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            {isSignUp && (
              <div className="input-group">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'rgba(13, 17, 23, 0.7)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    color: 'var(--text-primary)',
                    fontFamily: 'inherit',
                    fontSize: '0.95rem',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                  required
                >
                  <option value="Student">Student</option>
                  <option value="Instructor">Instructor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            )}
            
            <div className="input-group">
              <div className="input-icon">
                <Mail size={18} />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <div className="input-icon">
                <Lock size={18} />
              </div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {!isSignUp && (
              <div className="auth-forgot-password">
                <a href="#">Forgot password?</a>
              </div>
            )}

            <button type="submit" className="auth-submit-btn">
              {isSignUp ? 'Sign Up' : 'Log In'}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          <div className="auth-social">
            <button className="auth-social-btn">
              <Github size={20} />
              GitHub
            </button>
            <button className="auth-social-btn">
              <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
          </div>

          <div className="auth-toggle">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button 
              className="auth-toggle-btn"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? 'Log in' : 'Sign up'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
