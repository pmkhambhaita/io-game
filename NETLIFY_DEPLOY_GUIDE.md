# Deploying Your App on Netlify

This is a full-stack application with a React frontend and Express backend with PostgreSQL database. To deploy it on Netlify for free, you'll need to adjust your approach since Netlify is primarily for frontend hosting.

## Option 1: Frontend-only Deployment with External Backend

### 1. Setup a Separate Database Service

Since your app uses PostgreSQL, you'll need a database service:
- Use a free tier of [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Render](https://render.com) for PostgreSQL hosting
- Create a new PostgreSQL database and note the connection URL

### 2. Deploy the Backend Separately

- Deploy your Express backend on a platform like [Render](https://render.com) (free tier) or [Railway](https://railway.app)
- Update the database connection string to use your new PostgreSQL instance
- Note the URL of your deployed backend API

### 3. Prepare the Frontend for Netlify Deployment

Create a new file in your project root called `netlify.toml` (already done):
```toml
[build]
  base = "."
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 4. Modify Frontend API Calls

Update your API calls in the frontend to point to your deployed backend instead of relative paths:

1. Create a new configuration file (e.g., `client/src/lib/config.ts`):
```typescript
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

2. Update API requests to use this base URL:
```typescript
import { API_URL } from '@/lib/config';

// Example usage in API calls
fetch(`${API_URL}/api/puzzles`)
```

### 5. Deploy to Netlify

1. Push your code to a GitHub, GitLab, or Bitbucket repository
2. Connect your repository to Netlify
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Set environment variables:
   - `VITE_API_URL`: Your deployed backend URL (e.g., https://your-backend.onrender.com)
5. Deploy!

## Option 2: Full-Stack Deployment Using Netlify Functions (More Advanced)

This approach uses Netlify Functions to host your Express backend:

1. Install Netlify CLI: `npm install -g netlify-cli`
2. Restructure your backend to work as serverless functions
3. Create a `netlify/functions/api.js` file to serve your Express app
4. Update the database connection to use environment variables
5. Configure Netlify to use your PostgreSQL database through environment variables

For more details on this approach, see Netlify's documentation on [hosting Express.js apps with Netlify Functions](https://docs.netlify.com/functions/deploy/).

## Recommendation

The first approach (frontend-only deployment) is simpler and more straightforward for getting started. If you need more control or want to avoid using multiple services, the second approach can work as well but requires more setup.

For your specific application, I recommend Option 1 as it maintains a clean separation between frontend and backend/database concerns.