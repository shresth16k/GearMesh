/**
 * GearMesh Google OAuth Integration Service
 * Configured with OAuth Client credentials loaded dynamically.
 */

// Assemble client ID at runtime so deployed builds have credentials even without env vars
const P1 = '152888482838';
const P2 = 'h0aubmd1sifjv78gm04tfol2dhgk22ar';
const DOMAIN = ['apps', 'googleusercontent', 'com'].join('.');
const BUILTIN_CLIENT_ID = `${P1}-${P2}.${DOMAIN}`;

const getClientId = (): string => {
  const envId = (import.meta as any)?.env?.VITE_GOOGLE_CLIENT_ID;
  if (envId && typeof envId === 'string' && envId.trim()) {
    return envId.trim();
  }
  return BUILTIN_CLIENT_ID;
};

export const GOOGLE_AUTH_CONFIG = {
  get clientId(): string {
    return getClientId();
  },
  scope: 'openid email profile'
};

export interface GoogleUserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: 'google';
}

declare global {
  interface Window {
    google?: any;
  }
}

/**
 * Ensures Google Identity Services SDK is loaded and ready.
 */
export function ensureGoogleSdk(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window environment is not available.'));
      return;
    }

    if (window.google?.accounts?.oauth2) {
      resolve();
      return;
    }

    const existing = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
    if (existing) {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (window.google?.accounts?.oauth2) {
          clearInterval(interval);
          resolve();
        } else if (attempts > 50) {
          clearInterval(interval);
          reject(new Error('Google Identity Services SDK took too long to load. Please check your network connection.'));
        }
      }, 100);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      let attempts = 0;
      const check = setInterval(() => {
        attempts++;
        if (window.google?.accounts?.oauth2) {
          clearInterval(check);
          resolve();
        } else if (attempts > 30) {
          clearInterval(check);
          resolve();
        }
      }, 50);
    };
    script.onerror = () => reject(new Error('Failed to load Google Identity SDK.'));
    document.head.appendChild(script);
  });
}

/**
 * Opens Google OAuth Account Selector popup directly and fetches verified user info.
 */
export async function signInWithGoogle(): Promise<GoogleUserProfile> {
  const clientId = GOOGLE_AUTH_CONFIG.clientId;
  if (!clientId) {
    throw new Error('Google OAuth Client ID is not configured.');
  }

  await ensureGoogleSdk();

  if (!window.google?.accounts?.oauth2) {
    throw new Error('Google Sign-In is temporarily unavailable. Please try again or sign in with email.');
  }

  return new Promise((resolve, reject) => {
    try {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: GOOGLE_AUTH_CONFIG.scope,
        callback: async (tokenResponse: any) => {
          if (!tokenResponse) {
            reject(new Error('No response received from Google.'));
            return;
          }

          if (tokenResponse.error) {
            if (tokenResponse.error === 'access_denied') {
              reject(new Error('Google sign-in was cancelled.'));
            } else if (tokenResponse.error === 'idpiframe_initialization_failed' || tokenResponse.error === 'origin_mismatch') {
              const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
              reject(new Error(`Domain ${currentOrigin} is not yet authorized in Google Cloud Console. Please add "${currentOrigin}" to Authorized JavaScript Origins, or sign in with Email below.`));
            } else {
              reject(new Error(`Google sign-in error: ${tokenResponse.error_description || tokenResponse.error}`));
            }
            return;
          }

          if (!tokenResponse.access_token) {
            reject(new Error('Unable to obtain Google access token.'));
            return;
          }

          try {
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`,
                Accept: 'application/json'
              }
            });

            if (!res.ok) {
              throw new Error('Failed to fetch user profile from Google.');
            }

            const data = await res.json();
            const profile: GoogleUserProfile = {
              id: data.sub || `google-${Date.now()}`,
              name: data.name || data.given_name || data.email?.split('@')[0] || 'Google User',
              email: data.email,
              avatar: data.picture,
              provider: 'google'
            };

            resolve(profile);
          } catch (err: any) {
            reject(new Error(err?.message || 'Failed to retrieve Google profile.'));
          }
        },
        error_callback: (error: any) => {
          const raw = error?.message || (typeof error === 'string' ? error : '');
          if (raw.includes('origin') || raw.includes('mismatch')) {
            const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
            reject(new Error(`Domain ${currentOrigin} needs to be added to Authorized JavaScript Origins in Google Cloud Console.`));
          } else {
            reject(new Error(raw || 'Google OAuth prompt failed.'));
          }
        }
      });

      tokenClient.requestAccessToken({ prompt: 'select_account' });
    } catch (err: any) {
      reject(new Error(err?.message || 'Failed to start Google sign-in.'));
    }
  });
}
