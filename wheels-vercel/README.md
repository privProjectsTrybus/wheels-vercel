# WHEELS — Hot Wheels Collector App

## Deploy to Vercel (3 steps)

1. **Install Vercel CLI** (if needed):
   ```
   npm install -g vercel
   ```

2. **Deploy**:
   ```
   cd wheels-vercel
   vercel deploy
   ```

3. **Done!** Vercel gives you a URL like `https://wheels-xxxx.vercel.app`

## OR: Deploy via Vercel Dashboard (no CLI)

1. Go to https://vercel.com/new
2. Choose "Deploy from local folder" or drag this folder
3. Click Deploy

## Features
- 🔐 Email/password registration & login (stored in browser localStorage)
- 📷 AI-powered car scanner (takes photo → Claude identifies the car)
- 🔍 Search 200+ Hot Wheels cars with rarity scores, values, trend data
- 🏎️ Personal garage with sorting, filtering, collection value tracking
- 💰 Price intelligence: loose/carded values, eBay estimates, trend arrows
- ⭐ Find difficulty scale 1–10 for every car
- 📊 Profile with collection stats and breakdown

## Notes
- All user data stored in browser localStorage (no backend server needed)
- The AI scanner uses the Anthropic API (proxied automatically in claude.ai)
- For standalone deployment, you'll need to add an Anthropic API key
