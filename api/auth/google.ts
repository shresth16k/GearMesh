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
    const name = (body.name || '').trim();
    const avatar = body.avatar || '';
    const googleId = body.googleId || '';

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Invalid Google account email address.' });
    }

    const displayName = name || email.split('@')[0];
    const user = {
      id: googleId ? `google-${googleId}` : `u-${Date.now()}`,
      name: displayName,
      email: email,
      avatar: avatar,
      provider: 'google'
    };

    return res.status(200).json({
      success: true,
      user
    });
  } catch (err: any) {
    console.error('Google Auth API Error:', err);
    return res.status(500).json({ error: 'Unable to authenticate with Google.' });
  }
}
