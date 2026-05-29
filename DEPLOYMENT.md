# Deployment Instructions

## Frontend (Next.js on Vercel)
The frontend is already deployed at: **https://triva-nine.vercel.app**

## Backend (Socket.io Server)

The app needs a WebSocket server running. You have two options:

### Option 1: Deploy to Render (Recommended - Free Tier)

1. Go to https://render.com
2. Sign up with GitHub or email
3. Click "New +" → "Web Service"
4. Connect your GitHub repo (fork this repo first)
5. Configure:
   - **Name**: `triva-server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - Add Environment Variable:
     - **Key**: `PORT`
     - **Value**: `3001`

6. Deploy
7. Copy your service URL (e.g., `https://triva-server.onrender.com`)
8. Update `vercel.json` with the server URL

### Option 2: Deploy to Railway (Free Tier)

1. Go to https://railway.app
2. Sign up with GitHub
3. Create a new project
4. Deploy from GitHub (select this repo)
5. Set start command: `node server.js`
6. Copy your deployment URL

### Option 3: Run Locally (Development)

```bash
npm run dev
# Runs both frontend (http://localhost:3000) and backend (http://localhost:3001)
```

## Configuration

Once you have a backend URL, create a `.env.production` file in the project root:

```
NEXT_PUBLIC_SOCKET_URL=https://your-backend-url.com
```

Then redeploy to Vercel.

## How It Works

1. Multiple people open the trivia link on their devices
2. They all add their names and join the game
3. One person becomes the "Host" (can see all controls)
4. All devices stay synced via WebSocket in real-time
5. When someone buzzes, everyone sees it instantly
6. Scores update live for all players
