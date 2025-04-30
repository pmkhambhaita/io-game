// Configuration for API endpoints
// When deploying to Netlify, set VITE_API_URL environment variable to your backend URL

// Default to local development if not set
export const API_URL = import.meta.env.VITE_API_URL || '';

// If API_URL is empty (local development), we'll use relative paths
// If set (production), we'll use the full URL
export const getApiUrl = (path: string): string => {
  return API_URL ? `${API_URL}${path}` : path;
};