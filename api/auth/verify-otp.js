import { verifyOtpToken } from '../lib/email.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const email = (body.email || '').trim().toLowerCase();
    const otp = (body.otp || '').trim();
    const token = body.token || '';

    if (!email || !otp) {
      return res.status(400).json({ error: 'Please enter both your email address and 6-digit verification code.' });
    }

    const verification = verifyOtpToken(email, otp, token);
    if (!verification.valid) {
      return res.status(400).json({ error: verification.reason });
    }

    const name = email.split('@')[0];
    const user = {
      id: 'gm_' + Date.now().toString(36),
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email: email,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`,
      role: 'Member'
    };

    return res.status(200).json({
      status: 'authenticated',
      user,
      message: 'Authentication successful. Welcome to GearMesh!'
    });
  } catch (err) {
    console.error('Verify OTP API Error:', err);
    return res.status(500).json({ error: 'Verification failed: ' + (err?.message || err) });
  }
}
