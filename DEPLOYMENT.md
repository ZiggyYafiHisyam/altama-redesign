# Deploying: Vercel (frontend) + Railway (backend)

This is a monorepo: the Vite/React frontend lives at the repo root, the
Express API lives in `backend/`. They deploy as two separate services.

## 1. Push to GitHub

Both platforms deploy from a git repo:

```
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

## 2. Backend on Railway

1. New Project → Deploy from GitHub repo → select this repo.
2. In the service's Settings → set **Root Directory** to `backend`.
   Railway will pick up `backend/railway.json` (Nixpacks build, `npm start`,
   health check at `/api/health`).
3. Set environment variables (Settings → Variables), copying from
   [backend/.env.example](backend/.env.example):
   - `CORS_ORIGIN` — the Vercel domain(s) once deployed, comma-separated
     (you can update this after step 3 deploys and you have the URL).
   - `ADMIN_API_KEY` — a random secret string. Required to read
     `GET /api/contact` and `GET /api/page-views`; without it those routes
     return 503, so submissions still work but nothing can list them.
   - `DATA_DIR` — only if you attach a Volume (see below). Leave unset otherwise.
   - `PORT` is injected automatically by Railway; don't set it.
4. **Data persistence**: by default, contacts and page views are written to
   JSON files on local disk (`backend/data/*.json`). Railway's filesystem is
   wiped on every redeploy/restart, so without a Volume this data will not
   survive a deploy. To persist it: add a Volume in Railway, mount it (e.g. at
   `/data`), and set `DATA_DIR=/data`.
5. Deploy, then copy the generated `*.up.railway.app` URL.

## 3. Frontend on Vercel

1. New Project → import the same GitHub repo.
2. Framework preset: Vite (auto-detected). Root directory: repo root
   (leave as-is — `.vercelignore` excludes `backend/` from the build).
3. Set the environment variable `VITE_API_BASE_URL` to the Railway URL from
   step 2.5 (e.g. `https://your-app.up.railway.app`), no trailing slash.
4. Deploy. `vercel.json` at the repo root rewrites all paths to `index.html`
   so client-side routes (`/award`, `/contact-us`, etc.) work on refresh/direct
   link.

## 4. Close the loop

Once you have the Vercel URL, go back to Railway and set `CORS_ORIGIN` to it
(and redeploy) so the browser's CORS check passes for real requests.

## Local dev

Copy `.env.example` → `.env` (frontend) and `backend/.env.example` →
`backend/.env` (backend) if you want to override any defaults, then:

```
npm install
npm run dev
```
