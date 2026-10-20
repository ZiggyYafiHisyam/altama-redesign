# Deploying: everything on Vercel

The Vite/React frontend and the Express API deploy together as a single Vercel
project. No environment variables are required.

- The frontend builds from the repo root to `dist/`.
- `api/index.js` wraps the Express app in `backend/src/app.js` as a serverless
  function. `vercel.json` rewrites `/api/*` to it, and every other path to
  `index.html` so client-side routes (`/award`, `/contact-us`, …) survive a
  refresh or a direct link.
- Because both are served from one origin, the frontend calls `/api/...`
  relative — `VITE_API_BASE_URL` stays unset.
- `shared/defaultContent.js` is imported by both halves (the API seeds the
  content store from it, the frontend falls back to it), so it has to stay in
  the deployment. Vercel traces imports, so nothing needs configuring — just
  don't add it to `.vercelignore`.

## Deploy

1. Push to GitHub.
2. Vercel → New Project → import the repo.
3. Framework preset: Vite (auto-detected). Root directory: repo root. Leave the
   build settings alone.
4. Deploy.

Verify with `https://<your-app>.vercel.app/api/health`, which should return
`{"success":true,"status":"ok"}`.

## Set the admin password

The site's images are edited at `/admin` (see [ADMIN.md](ADMIN.md)), and the
credentials default to `admin` / `123`. **Set `ADMIN_USERNAME` and
`ADMIN_PASSWORD` in Vercel before the deployment is public**, or anyone who
finds `/admin/login` can rewrite the site.

## Data storage is temporary

Site content, uploaded images, contacts and page views are written to JSON
files. On Vercel the deployment filesystem is read-only, so the stores write to
`/tmp` instead (see
[backend/src/services/dataDir.js](backend/src/services/dataDir.js)).

**`/tmp` is per-instance and ephemeral.** Entries vanish when the serverless
instance is recycled, and two instances running at once do not see each other's
data. Treat it as a scratch cache: good enough to prove the flow works, not
somewhere to keep real contact-form submissions — or the real site's content.
When content disappears the site falls back to the defaults bundled in
`shared/defaultContent.js`, so pages stay complete rather than going blank, but
the edits are gone.

The fix is either a persistent `DATA_DIR` (below) or moving the stores to a
hosted database (e.g. Postgres via `DATABASE_URL`) — only the files in
`backend/src/services/` would change. Until then, take a backup from the admin's
Settings page after any substantial editing session.

## Optional environment variables

Set these in Vercel → Settings → Environment Variables. All are optional.

- `ADMIN_USERNAME`, `ADMIN_PASSWORD` — the admin panel's credentials. Optional
  only in the sense that the app runs without them; see the warning above.
- `ADMIN_SESSION_SECRET`, `ADMIN_SESSION_HOURS` — how admin sessions are signed
  and how long they last. See [ADMIN.md](ADMIN.md).
- `ADMIN_API_KEY` — a machine key for reading `GET /api/contact` and
  `GET /api/page-views` without signing in; send it as the `x-admin-key` header.
  The admin panel does not need it (it uses a session), so unset, those routes
  are reachable only by a signed-in admin.
- `CORS_ORIGIN` — comma-separated allowed origins. Unset on Vercel, the API
  reflects the requesting origin, which already covers the production domain and
  preview URLs.
- `DATA_DIR` — override where the JSON files are written. Only useful on a host
  with a persistent disk; on Vercel it must stay under `/tmp`. This is the one
  variable that makes admin edits survive.

## Running the backend somewhere else later

The Express app is still host-agnostic, and `backend/` remains a standalone npm
package with its own `start` script and `backend/railway.json`. To move the API
to Railway (or any long-running host): deploy `backend/` with root directory
`backend`, attach a volume and set `DATA_DIR` to its mount path, set
`CORS_ORIGIN` to the Vercel domain, then set `VITE_API_BASE_URL` on Vercel to
the new API URL and drop the `/api/(.*)` rewrite from `vercel.json`.

## Local dev

Unchanged — the frontend and backend run as two processes, with Vite's dev
proxy forwarding `/api` to `localhost:4000`:

```
npm install
npm run dev
```

Copy `.env.example` → `.env` and `backend/.env.example` → `backend/.env` first
if you want to override any defaults.
