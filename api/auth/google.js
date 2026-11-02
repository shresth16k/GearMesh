export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const email = (body.email || '').trim().toLowerCase();
    const name = (body.name || '').trim() || (email ? email.split('@')[0] : 'Member');
    const avatar = body.avatar || body.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid Google profile information required.' });
    }

    const user = {
      id: 'gm_' + Date.now().toString(36),
      name,
      email,
      avatar,
      role: 'Member'
    };

    return res.status(200).json({
      status: 'authenticated',
      user,
      message: 'Google Sign-In successful.'
    });
  } catch (err) {
    console.error('Google Auth API Error:', err);
    return res.status(500).json({ error: 'Google sign-in error: ' + (err?.message || err) });
  }
}
