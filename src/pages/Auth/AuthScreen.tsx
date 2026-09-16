import React, { useState } from 'react';
import { Button } from '../../components/common/Button';
import { Mail, Lock, User as UserIcon, ArrowLeft } from 'lucide-react';
import './AuthScreen.css';

interface AuthScreenProps {
  onSuccess: () => void;
  onBack: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess, onBack }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('alex.rivera@community.org');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Alex Rivera');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess();
  };

  return (
    <div className="rewrap-auth-screen">
      <div className="rewrap-auth__header">
        <button type="button" className="rewrap-auth__back-btn" onClick={onBack} aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <div className="rewrap-auth__brand">
          <img src="/leaf.svg" alt="ReWrap" className="rewrap-auth__logo" />
          <span>ReWrap</span>
        </div>
        <div style={{ width: 36 }} />
      </div>

      <div className="rewrap-auth__body">
        <div className="rewrap-auth__intro">
          <h1 className="rewrap-auth__title">
            {isSignUp ? 'Join the Circle' : 'Welcome Back'}
          </h1>
          <p className="rewrap-auth__subtitle">
            {isSignUp
              ? 'Access thousands of physical items in your local community.'
              : 'Sign in to access your borrowed items and neighborhood connections.'}
          </p>
        </div>

        <form className="rewrap-auth__form" onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="rewrap-auth__field">
              <label>Full Name</label>
              <div className="rewrap-auth__input-wrap">
                <UserIcon size={18} className="rewrap-auth__icon" />
                <input
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="rewrap-auth__field">
            <label>Email Address</label>
            <div className="rewrap-auth__input-wrap">
              <Mail size={18} className="rewrap-auth__icon" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="rewrap-auth__field">
            <label>Password</label>
            <div className="rewrap-auth__input-wrap">
              <Lock size={18} className="rewrap-auth__icon" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {!isSignUp && (
            <div className="rewrap-auth__forgot">
              <button type="button" className="rewrap-auth__link-btn">
                Forgot password?
              </button>
            </div>
          )}

          <div className="rewrap-auth__submit">
            <Button variant="capsule" fullWidth withArrow type="submit">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Button>
          </div>
        </form>

        <div className="rewrap-auth__toggle">
          <span>{isSignUp ? 'Already a member?' : "Don't have an account?"}</span>
          <button
            type="button"
            className="rewrap-auth__toggle-btn"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
};
