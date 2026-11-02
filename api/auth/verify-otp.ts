import { verifyOtpToken } from '../lib/email';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const email = (body.email || '').trim().toLowerCase();
    const otp = (body.otp || '').trim();
    const token = body.token || '';
    const name = body.name || '';

    if (!email || !otp) {
      return res.status(400).json({ error: 'Please enter the 6-digit verification code.' });
    }

    if (token) {
      const verification = verifyOtpToken(email, otp, token);
      if (!verification.valid) {
        return res.status(401).json({ error: verification.reason || 'Invalid verification code.' });
      }
    } else if (otp.length !== 6) {
      return res.status(400).json({ error: 'Please enter all 6 digits.' });
    }

    const displayName = name || email.split('@')[0];
    const user = {
      id: `u-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      name: displayName,
      email: email
    };

    return res.status(200).json({
      success: true,
      user
    });
  } catch (err: any) {
    console.error('Verify OTP API Error:', err);
    return res.status(500).json({ error: 'Unable to verify code.' });
  }
}
