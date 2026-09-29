import React, { useState } from 'react';
import { Users, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { login } from '../services/api';

const DEMO_ACCOUNTS = [
  {
    roleLabel: 'Admin (Full CRUD)',
    email: 'admin@company.com',
    password: 'Admin@123',
    badge: '👑 Admin'
  },
  {
    roleLabel: 'Employee (Read-Only)',
    email: 'aarav.sharma@example.com',
    password: 'Employee@123',
    badge: '👤 Employee'
  },
  {
    roleLabel: 'Employee (Product)',
    email: 'priya.patel@example.com',
    password: 'Employee@123',
    badge: '👤 Employee'
  },
  {
    roleLabel: 'Employee (DevOps)',
    email: 'vikram.singh@example.com',
    password: 'Employee@123',
    badge: '👤 Employee'
  }
];

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your email address and password');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await login(email, password);
      if (onLoginSuccess) {
        onLoginSuccess(response.data);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Invalid credentials or server unavailable');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (demo) => {
    setEmail(demo.email);
    setPassword(demo.password);
    setErrorMessage('');
  };

  return (
    <div className="login-page">
      <div className="login-card-wrapper">
        <div className="login-brand-header">
          <div className="login-brand-icon">
            <Users size={32} />
          </div>
          <h1>StaffPulse</h1>
          <p className="login-brand-subtitle">Enterprise Employee Directory & Management Portal</p>
        </div>

        <div className="login-card">
          <div className="login-card-header">
            <h2>Sign In to Portal</h2>
            <p>Access your employee dashboard and team records</p>
          </div>

          {errorMessage && (
            <div className="login-error-alert">
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="login-email" className="form-label">
                Work Email Address
              </label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  id="login-email"
                  type="email"
                  className="form-input"
                  placeholder="e.g. employee@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="login-password" className="form-label">
                Password
              </label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="login-meta-row">
              <label className="remember-me-label">
                <input type="checkbox" defaultChecked />
                <span>Remember this workstation</span>
              </label>
              <span className="password-hint">Default: <code>Employee@123</code></span>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-login-submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="btn-spinner"></span>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Logins Section */}
          <div className="demo-accounts-section">
            <div className="demo-section-title">
              <ShieldCheck size={16} />
              <span>Quick Demo Logins (Click to autofill)</span>
            </div>
            <div className="demo-pills-grid">
              {DEMO_ACCOUNTS.map((demo, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="demo-pill-btn"
                  onClick={() => handleQuickLogin(demo)}
                >
                  <div className="demo-pill-top">
                    <span className="demo-pill-role">{demo.roleLabel}</span>
                    <span className="demo-pill-badge">{demo.badge}</span>
                  </div>
                  <span className="demo-pill-email">{demo.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="login-footer-text">
          <p>&copy; {new Date().getFullYear()} StaffPulse. Secure MERN Stack Employee Management.</p>
        </div>
      </div>
    </div>
  );
}
