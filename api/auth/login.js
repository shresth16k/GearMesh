import { generateOtp, createOtpToken, sendOtpEmail } from '../lib/email.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const email = (body.email || '').trim().toLowerCase();
    const password = body.password || '';

    if (!email || !email.includes('@') || password.length < 4) {
      return res.status(400).json({ error: 'Enter a valid email and password of at least 4 characters.' });
    }

    const otp = generateOtp();
    const token = createOtpToken(email, otp);
    const userName = email.split('@')[0];

    await sendOtpEmail(email, otp, userName);

    return res.status(200).json({
      status: '2fa_required',
      email,
      token,
      message: 'A 6-digit verification code has been sent to your email.'
    });
  } catch (err) {
    console.error('Login API Error:', err);
    return res.status(500).json({ error: 'Unable to process sign in: ' + (err?.message || err) });
  }
}
