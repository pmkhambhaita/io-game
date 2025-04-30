# Deployment Guide for Your Input-Output Pattern Game

This document provides detailed instructions for deploying your app to Netlify for free.

## Overview

This application is a full-stack project with:
- Frontend: React with Vite
- Backend: Express.js API
- Database: PostgreSQL

Since Netlify is primarily for frontend hosting, there are two deployment strategies:

## Option 1: Frontend on Netlify + Backend on Another Platform (Recommended)

### Step 1: Prepare Your Database

1. Sign up for a free database service:
   - [Neon](https://neon.tech) (Recommended)
   - [Supabase](https://supabase.com)
   - [Render](https://render.com)

2. Create a new PostgreSQL database

3. Get your database connection string, which will look something like:
   ```
   postgresql://username:password@hostname:port/database
   ```

### Step 2: Deploy Your Backend

1. Sign up for a free backend hosting service:
   - [Render](https://render.com) (Recommended)
   - [Railway](https://railway.app)
   - [Fly.io](https://fly.io)

2. Create a new web service:
   - Choose Node.js as the runtime
   - Set the build command to `npm install`
   - Set the start command to `npm run start`

3. Set environment variables:
   - `DATABASE_URL`: Your database connection string from Step 1
   - `NODE_ENV`: `production`

4. Deploy your backend and note the URL (e.g., `https://your-backend.onrender.com`)

### Step 3: Deploy Your Frontend to Netlify

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Sign up for [Netlify](https://netlify.com)

3. Create a new site from Git:
   - Connect your repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`

4. Set environment variables in Netlify:
   - `VITE_API_URL`: Your backend URL (e.g., `https://your-backend.onrender.com`)

5. Deploy your site

6. Set up a custom domain (optional):
   - Netlify provides a free subdomain (yoursite.netlify.app)
   - You can configure your own domain in the Netlify settings

## Option 2: All-in-One Deployment with Netlify Functions (Advanced)

If you prefer to keep everything on Netlify, you can use Netlify Functions to host your backend:

1. Restructure your backend as serverless functions
2. Create a `netlify/functions` directory
3. Modify your Express app to work with Netlify Functions
4. Add `netlify-lambda` to handle Express with Lambda

For more details on this approach, see Netlify's documentation on [Express.js with Netlify Functions](https://docs.netlify.com/functions/deploy/).

## Configuration for Deployment

We've already set up the necessary code changes to support deployment:

1. Created a `netlify.toml` configuration file
2. Added `client/src/lib/config.ts` for API URL management
3. Updated the API calls in `queryClient.ts` to use the configuration

## CORS Configuration

When deploying frontend and backend separately, you'll need to configure CORS on your backend:

1. Add the following to your `server/routes.ts` file:

```typescript
// Add CORS middleware
app.use((req, res, next) => {
  // Allow your Netlify domain
  res.header('Access-Control-Allow-Origin', 'https://your-site.netlify.app');
  // Or allow all origins during development
  // res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});
```

## Troubleshooting

- If you encounter CORS errors, make sure your backend is properly configured to accept requests from your Netlify domain
- If database connections fail, verify your environment variables are set correctly
- For authentication issues, ensure cookies are properly configured for cross-domain usage

## Conclusion

Following these steps will allow you to deploy your application for free on Netlify, with the backend and database hosted on complementary free services.

For persistent data, you'll need to maintain your database service, but most providers offer a free tier that should be sufficient for moderate usage.