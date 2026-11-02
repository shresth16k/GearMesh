/**
 * GearMesh API Base Configuration
 * Intelligently resolves API endpoint based on deployment environment
 */

const getResolvedApiBaseUrl = (): string => {
  // 1. Check custom environment variable
  const customUrl = (import.meta as any)?.env?.VITE_API_URL;
  if (customUrl && typeof customUrl === 'string' && customUrl.trim()) {
    return customUrl.trim().replace(/\/$/, '');
  }

  // 2. If running locally on localhost/127.0.0.1, connect to local Java backend
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8080/api';
    }
  }

  // 3. Deployed cloud fallback (or same origin /api if reverse proxy configured)
  return '/api';
};

export const API_BASE_URL = getResolvedApiBaseUrl();

export const isLocalhost = (): boolean => {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname;
  return hostname === 'localhost' || hostname === '127.0.0.1';
};
