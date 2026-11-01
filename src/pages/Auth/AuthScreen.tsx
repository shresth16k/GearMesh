import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../../components/common/Button';
import { Mail, Lock, User as UserIcon, Eye, EyeOff, ArrowLeft, ShieldCheck, CheckCircle2, Sparkles, Layers, Clock, RotateCw, KeyRound } from 'lucide-react';
import './AuthScreen.css';

interface AuthScreenProps {
  onSuccess: (user: { id: string; name: string; email: string }) => void;
  onBack?: () => void;
  onAdminClick?: () => void;
}

const API_BASE_URL = 'http://localhost:8080/api';

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess, onBack, onAdminClick }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isOtpLogin, setIsOtpLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2FA OTP Verification States
  const [is2FA, setIs2FA] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [devOtp, setDevOtp] = useState('');
  const [timer, setTimer] = useState(300);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [infoMessage, setInfoMessage] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Responsive desktop vs mobile view differentiation
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 2FA Countdown timer
  useEffect(() => {
    if (!is2FA) return;
    const interval = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0));
      setResendCooldown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [is2FA]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index: number, val: string) => {
    const cleaned = val.replace(/\D/g, '');
    const newDigits = [...otpDigits];

    if (!cleaned) {
      newDigits[index] = '';
      setOtpDigits(newDigits);
      return;
    }

    if (cleaned.length > 1) {
      const chars = cleaned.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        if (chars[i]) newDigits[i] = chars[i];
      }
      setOtpDigits(newDigits);
      const nextIndex = Math.min(chars.length, 5);
      otpInputsRef.current[nextIndex]?.focus();
      return;
    }

    newDigits[index] = cleaned;
    setOtpDigits(newDigits);

    if (index < 5 && cleaned) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const newDigits = [...otpDigits];
    pasted.split('').forEach((char, idx) => {
      if (idx < 6) newDigits[idx] = char;
    });
    setOtpDigits(newDigits);
    const targetIdx = Math.min(pasted.length, 5);
    otpInputsRef.current[targetIdx]?.focus();
  };

  const handleAutoFillDevOtp = () => {
    if (!devOtp) return;
    const digits = devOtp.slice(0, 6).split('');
    const newDigits = [...otpDigits];
    digits.forEach((d, i) => {
      newDigits[i] = d;
    });
    setOtpDigits(newDigits);
    otpInputsRef.current[5]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');
    setIsSubmitting(true);
    try {
      const endpoint = isOtpLogin
        ? `${API_BASE_URL}/auth/send-otp`
        : `${API_BASE_URL}/auth/${isSignUp ? 'register' : 'login'}`;
      const payload = isOtpLogin ? { email } : { name, email, password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to authenticate.');

      // Check if 2FA verification is required
      if (result.status === '2fa_required') {
        setIs2FA(true);
        setOtpEmail(result.email || email);
        if (result.devOtp) setDevOtp(result.devOtp);
        setTimer(300);
        setResendCooldown(60);
        setInfoMessage(result.message || 'A 6-digit verification code has been sent to your email.');
        setTimeout(() => {
          otpInputsRef.current[0]?.focus();
        }, 120);
        return;
      }

      if (rememberMe) localStorage.setItem('gearmesh-user', JSON.stringify(result.user));
      onSuccess(result.user);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to connect to the server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otpDigits.join('');
    if (otpValue.length < 6) {
      setError('Please enter all 6 digits of the verification code.');
      return;
    }
    setError('');
    setInfoMessage('');
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: otpEmail || email, otp: otpValue })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Invalid verification code.');
      if (rememberMe) localStorage.setItem('gearmesh-user', JSON.stringify(result.user));
      onSuccess(result.user);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to verify code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setError('');
    setInfoMessage('');
    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: otpEmail || email })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to resend code.');
      setResendCooldown(60);
      setTimer(300);
      setOtpDigits(['', '', '', '', '', '']);
      if (result.devOtp) setDevOtp(result.devOtp);
      setInfoMessage(result.message || 'A new 6-digit verification code has been sent.');
      setTimeout(() => otpInputsRef.current[0]?.focus(), 50);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to resend code.');
    }
  };

  const handleBackToLogin = () => {
    setIs2FA(false);
    setOtpDigits(['', '', '', '', '', '']);
    setError('');
    setInfoMessage('');
  };

  return (
    <div className={`gearmesh-auth-page-wrap ${isDesktop ? 'gearmesh-auth--desktop' : 'gearmesh-auth--mobile'}`}>
      {/* Desktop Left Brand & Storytelling Panel (Web Only) */}
      <div className="gearmesh-auth__desktop-hero">
        <div className="gearmesh-auth__hero-bg-img" />
        <div className="gearmesh-auth__hero-overlay" />
        <div className="gearmesh-auth__hero-content">
          <div className="gearmesh-auth__hero-brand">
            <div className="gearmesh-auth__hero-logo-box">
              <img src="/leaf.svg" alt="GearMesh" className="gearmesh-auth__hero-logo" />
            </div>
            <span className="gearmesh-auth__hero-brand-name">GearMesh</span>
          </div>

          <div className="gearmesh-auth__hero-text-block">
            <span className="gearmesh-auth__hero-badge">
              <Sparkles size={13} />
              <span>Community Gear Sharing</span>
            </span>
            <h2 className="gearmesh-auth__hero-headline">
              Things move.<br />
              People connect.<br />
              <span className="gearmesh-auth__hero-headline-green">A greener tomorrow.</span>
            </h2>
            <p className="gearmesh-auth__hero-desc">
              Borrow cameras, camping gear, power tools, and sports equipment directly from verified neighbors.
              Pick up and return anytime with 24/7 automated contactless smart lockers.
            </p>
          </div>

          <div className="gearmesh-auth__hero-bullets">
            <div className="gearmesh-auth__hero-bullet">
              <CheckCircle2 size={16} color="#A8B8A3" />
              <span>Zero clutter — borrow what you need, return when done</span>
            </div>
            <div className="gearmesh-auth__hero-bullet">
              <CheckCircle2 size={16} color="#A8B8A3" />
              <span>Contactless smart locker pickup with secure PIN codes</span>
            </div>
            <div className="gearmesh-auth__hero-bullet">
              <CheckCircle2 size={16} color="#A8B8A3" />
              <span>Community Replacement Guarantee on all verified items</span>
            </div>
          </div>

          <div className="gearmesh-auth__hero-features">
            <div className="gearmesh-auth__hero-feat-item">
              <span className="gearmesh-auth__hero-feat-num">45+</span>
              <span className="gearmesh-auth__hero-feat-lbl">Smart Lockers</span>
            </div>
            <div className="gearmesh-auth__hero-feat-sep" />
            <div className="gearmesh-auth__hero-feat-item">
              <span className="gearmesh-auth__hero-feat-num">1,250+</span>
              <span className="gearmesh-auth__hero-feat-lbl">Shared Items</span>
            </div>
            <div className="gearmesh-auth__hero-feat-sep" />
            <div className="gearmesh-auth__hero-feat-item">
              <span className="gearmesh-auth__hero-feat-num">642 kg</span>
              <span className="gearmesh-auth__hero-feat-lbl">CO2 Avoided</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Panel (Full width on mobile, 50% on web) */}
      <div className="gearmesh-auth-screen">
        <div className="gearmesh-auth__header">
          {onBack ? (
            <button type="button" className="gearmesh-auth__back-btn" onClick={onBack} aria-label="Back">
              <ArrowLeft size={20} />
            </button>
          ) : (
            <div style={{ width: 36 }} />
          )}
          <div className="gearmesh-auth__brand">
            <img src="/leaf.svg" alt="GearMesh" className="gearmesh-auth__logo" />
            <span>GearMesh</span>
          </div>
          <div style={{ width: 36 }} />
        </div>

        <div className="gearmesh-auth__body">
          {/* Top Live Incoming Email Notification Toast (visible when OTP is generated) */}
          {devOtp && (
            <div className="gearmesh-auth__incoming-email-toast">
              <div className="gearmesh-auth__toast-left">
                <div className="gearmesh-auth__toast-icon">📧</div>
                <div className="gearmesh-auth__toast-content">
                  <div className="gearmesh-auth__toast-title">Email Delivered to Your Inbox</div>
                  <div className="gearmesh-auth__toast-desc">
                    Code for <strong>{otpEmail || email}</strong>: <span className="gearmesh-auth__toast-code">{devOtp}</span>
                  </div>
                </div>
              </div>
              <div className="gearmesh-auth__toast-actions">
                <button
                  type="button"
                  className="gearmesh-auth__toast-btn gearmesh-auth__toast-btn--preview"
                  onClick={() => setShowEmailModal(true)}
                >
                  View Email
                </button>
                <button
                  type="button"
                  className="gearmesh-auth__toast-btn gearmesh-auth__toast-btn--fill"
                  onClick={handleAutoFillDevOtp}
                >
                  Auto-Fill
                </button>
              </div>
            </div>
          )}

          {is2FA ? (
            <div className="gearmesh-auth__2fa-view">
              <div className="gearmesh-auth__otp-badge">
                <ShieldCheck size={14} />
                <span>Two-Factor Authentication</span>
              </div>

              <h1 className="gearmesh-auth__title">Verify Your Email</h1>
              <p className="gearmesh-auth__otp-target">
                We sent a 6-digit verification code to <span className="gearmesh-auth__otp-email-highlight">{otpEmail}</span>. Enter the code below to complete your sign-in.
              </p>

              {infoMessage && (
                <div className="gearmesh-auth__info-msg" role="status">
                  <CheckCircle2 size={16} />
                  <span>{infoMessage}</span>
                </div>
              )}

              {error && (
                <div className="gearmesh-auth__error" role="alert">
                  {error}
                </div>
              )}

              {devOtp && (
                <div className="gearmesh-auth__otp-dev-hint">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <KeyRound size={15} />
                    <span>Demo / Dev Code:</span>
                    <span className="gearmesh-auth__otp-dev-code">{devOtp}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      type="button"
                      className="gearmesh-auth__otp-autofill-btn"
                      style={{ background: '#374151' }}
                      onClick={() => setShowEmailModal(true)}
                    >
                      Open Email
                    </button>
                    <button
                      type="button"
                      className="gearmesh-auth__otp-autofill-btn"
                      onClick={handleAutoFillDevOtp}
                    >
                      Auto-Fill
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleVerifyOtp}>
                <div className="gearmesh-auth__otp-inputs" onPaste={handleOtpPaste}>
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (otpInputsRef.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      className={`gearmesh-auth__otp-box ${digit ? 'gearmesh-auth__otp-box--filled' : ''}`}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      autoComplete="one-time-code"
                      aria-label={`Digit ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="gearmesh-auth__otp-meta">
                  <div className="gearmesh-auth__otp-timer">
                    <Clock size={14} />
                    <span>Expires in {formatTimer(timer)}</span>
                  </div>

                  <button
                    type="button"
                    className="gearmesh-auth__otp-resend-btn"
                    onClick={handleResendOtp}
                    disabled={resendCooldown > 0}
                  >
                    {resendCooldown > 0 ? `Resend code (${resendCooldown}s)` : 'Resend Code'}
                  </button>
                </div>

                <div className="gearmesh-auth__otp-actions">
                  <Button
                    type="submit"
                    variant="capsule"
                    fullWidth
                    disabled={isSubmitting || otpDigits.join('').length < 6}
                  >
                    {isSubmitting ? 'Verifying...' : 'Verify & Sign In'}
                  </Button>

                  <button
                    type="button"
                    className="gearmesh-auth__otp-back-btn"
                    onClick={handleBackToLogin}
                  >
                    <ArrowLeft size={16} />
                    <span>Back to Sign In</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              {/* Title */}
              <div className="gearmesh-auth__intro">
                <h1 className="gearmesh-auth__title">
                  {isSignUp
                    ? 'Create an Account'
                    : isOtpLogin
                    ? 'Email OTP Sign In'
                    : 'Welcome to GearMesh'}
                </h1>
                <p className="gearmesh-auth__subtitle">
                  {isSignUp
                    ? 'Join a neighborhood community that values access over ownership. 2FA verification code will be sent to your email.'
                    : isOtpLogin
                    ? 'Enter your email address and we will immediately send a 6-digit verification code.'
                    : 'Sign in to borrow, lend, and explore gear around you.'}
                </p>
              </div>

              {/* Tab switcher: Sign In | Sign Up | Email OTP */}
              <div className="gearmesh-auth__tabs">
                <button
                  type="button"
                  className={`gearmesh-auth__tab ${!isSignUp && !isOtpLogin ? 'gearmesh-auth__tab--active' : ''}`}
                  onClick={() => {
                    setIsSignUp(false);
                    setIsOtpLogin(false);
                    setError('');
                  }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className={`gearmesh-auth__tab ${isSignUp ? 'gearmesh-auth__tab--active' : ''}`}
                  onClick={() => {
                    setIsSignUp(true);
                    setIsOtpLogin(false);
                    setError('');
                  }}
                >
                  Sign Up
                </button>
                <button
                  type="button"
                  className={`gearmesh-auth__tab ${isOtpLogin ? 'gearmesh-auth__tab--active' : ''}`}
                  onClick={() => {
                    setIsSignUp(false);
                    setIsOtpLogin(true);
                    setError('');
                  }}
                >
                  Email OTP
                </button>
              </div>

              {error && <div className="gearmesh-auth__error" role="alert">{error}</div>}

              <form className="gearmesh-auth__form" onSubmit={handleSubmit}>
                {isSignUp && (
                  <div className="gearmesh-auth__field">
                    <label>Full Name</label>
                    <div className="gearmesh-auth__input-wrap">
                      <UserIcon size={17} className="gearmesh-auth__icon" />
                      <input
                        type="text"
                        placeholder="e.g. Alex Kumar"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="gearmesh-auth__field">
                  <label>Email Address</label>
                  <div className="gearmesh-auth__input-wrap">
                    <Mail size={17} className="gearmesh-auth__icon" />
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {!isOtpLogin && (
                  <div className="gearmesh-auth__field">
                    <label>Password</label>
                    <div className="gearmesh-auth__input-wrap">
                      <Lock size={17} className="gearmesh-auth__icon" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="gearmesh-auth__eye-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                )}

                {!isOtpLogin && (
                  <div className="gearmesh-auth__options">
                    <label className="gearmesh-auth__remember">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <span>Remember me</span>
                    </label>
                    {!isSignUp && (
                      <a href="#forgot" className="gearmesh-auth__forgot" onClick={(e) => e.preventDefault()}>
                        Forgot Password?
                      </a>
                    )}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="capsule"
                  fullWidth
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? (isSignUp ? 'Creating Account & Sending OTP...' : isOtpLogin ? 'Sending OTP Code...' : 'Sending OTP Code...')
                    : (isSignUp ? 'Create Account & Verify OTP' : isOtpLogin ? 'Send OTP to Email →' : 'Sign In with Password & OTP')}
                </Button>
              </form>

              {/* Social login divider */}
              <div className="gearmesh-auth__divider">
                <span>or continue with</span>
              </div>

              {/* Social login buttons: Google, Apple, GitHub */}
              <div className="gearmesh-auth__socials">
                <button type="button" className="gearmesh-auth__social-btn" onClick={() => setError('Social login is optional. Please sign in with email and password.')} aria-label="Google">
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                </button>

                <button type="button" className="gearmesh-auth__social-btn" onClick={() => setError('Social login is optional. Please sign in with email and password.')} aria-label="Apple">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.85.94-2.93-.93.04-2.02.63-2.67 1.4-.58.67-.99 1.77-.85 2.82.99.08 2.01-.52 2.58-1.29z"/>
                  </svg>
                </button>

                <button type="button" className="gearmesh-auth__social-btn" onClick={() => setError('Social login is optional. Please sign in with email and password.')} aria-label="GitHub">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                </button>
              </div>

              {/* Terms footer */}
              <p className="gearmesh-auth__terms">
                By continuing, you agree to our <a href="#terms">Terms</a> & <a href="#privacy">Privacy Policy</a>
              </p>
            </>
          )}

          {onAdminClick && (
            <div className="gearmesh-auth__admin-footer">
              <button
                type="button"
                className="gearmesh-auth__admin-link-btn"
                onClick={onAdminClick}
              >
                <ShieldCheck size={15} />
                <span>Admin Portal Access (Web Only) →</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Realistic In-App Email Mailbox Modal */}
      {showEmailModal && devOtp && (
        <div className="gearmesh-email-modal-overlay" onClick={() => setShowEmailModal(false)}>
          <div className="gearmesh-email-modal" onClick={(e) => e.stopPropagation()}>
            <div className="gearmesh-email-modal__top-bar">
              <div className="gearmesh-email-modal__window-dots">
                <span className="dot dot--red" />
                <span className="dot dot--yellow" />
                <span className="dot dot--green" />
              </div>
              <span className="gearmesh-email-modal__app-title">📧 Mailbox — {otpEmail || email}</span>
              <button
                type="button"
                className="gearmesh-email-modal__close-btn"
                onClick={() => setShowEmailModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="gearmesh-email-modal__header">
              <div className="gearmesh-email-modal__avatar">GM</div>
              <div className="gearmesh-email-modal__meta">
                <div className="gearmesh-email-modal__from-row">
                  <span className="gearmesh-email-modal__from-name">GearMesh Security</span>
                  <span className="gearmesh-email-modal__from-addr">&lt;no-reply@gearmesh.com&gt;</span>
                </div>
                <div className="gearmesh-email-modal__to-row">
                  <span>To: <strong>{otpEmail || email}</strong></span>
                  <span className="gearmesh-email-modal__time">Just now</span>
                </div>
                <div className="gearmesh-email-modal__subject">
                  Subject: Your GearMesh 2FA Verification Code: <strong>{devOtp}</strong>
                </div>
              </div>
            </div>

            <div className="gearmesh-email-modal__body">
              <div className="gearmesh-email-card">
                <div className="gearmesh-email-card__logo">
                  <img src="/leaf.svg" alt="GearMesh" style={{ width: 22, height: 22 }} />
                  <span>GearMesh</span>
                </div>
                <h2 className="gearmesh-email-card__heading">Your Verification Code</h2>
                <p className="gearmesh-email-card__text">
                  We received a sign-in or registration request for your GearMesh account. Enter this one-time code on the verification screen:
                </p>
                <div className="gearmesh-email-card__code-display">
                  {devOtp.split('').map((char, i) => (
                    <span key={i} className="gearmesh-email-card__digit">{char}</span>
                  ))}
                </div>
                <p className="gearmesh-email-card__subtext">
                  ⏱️ This code expires in 5 minutes. If you did not request this code, you can safely ignore this email.
                </p>
                <button
                  type="button"
                  className="gearmesh-email-card__action-btn"
                  onClick={() => {
                    handleAutoFillDevOtp();
                    setShowEmailModal(false);
                  }}
                >
                  Insert Code & Auto-fill →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
