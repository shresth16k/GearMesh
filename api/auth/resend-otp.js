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
    const name = (body.name || email.split('@')[0]).trim();

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const otp = generateOtp();
    const token = createOtpToken(email, otp);

    await sendOtpEmail(email, otp, name);

    return res.status(200).json({
      status: '2fa_required',
      email,
      token,
      message: 'A fresh 6-digit verification code has been dispatched to your email.'
    });
  } catch (err) {
    console.error('Resend OTP API Error:', err);
    return res.status(500).json({ error: 'Unable to resend verification code: ' + (err?.message || err) });
  }
}
