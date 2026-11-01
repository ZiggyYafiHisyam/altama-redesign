# Deploying: everything on Vercel

The Vite/React frontend and the Express API deploy together as a single Vercel
project, with a Neon Postgres database for everything the site saves.

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

Verify with `https://<your-app>.vercel.app/api/health`. With the database
connected it returns `"storage":"postgres"` and `"connected":true`, plus the start
of the endpoint name (`ep-steep-tooth…`) so you can tell which database it is.
`"storage":"files"` means `DATABASE_URL` isn't reaching the deployment and data
is only being kept temporarily; a 503 means the database didn't answer.

## Set the admin password

The site's images are edited at `/admin` (see [ADMIN.md](ADMIN.md)), and the
credentials default to `admin` / `123`. **Set `ADMIN_USERNAME` and
`ADMIN_PASSWORD` in Vercel before the deployment is public**, or anyone who
finds `/admin/login` can rewrite the site.

## Connect the database (Neon)

Site content, uploaded images, contact messages and page views are saved in
Postgres on Neon.

1. Vercel → your project → **Storage** → **Create Database** → **Neon**, free
   plan, region **Singapore (`aws-ap-southeast-1`)**. Connect it to the project.
   The integration sets `DATABASE_URL` for you.
2. Redeploy, so the function picks up the new variable.
3. That's it: the tables are created on the first request (see
   [backend/src/services/db.js](backend/src/services/db.js)).

`vercel.json` pins the API function to Vercel's Singapore region (`sin1`) so it
sits next to the database; every query would otherwise cross an ocean. If you
create the database somewhere else, change `regions` to match.

**Without `DATABASE_URL`** the stores fall back to JSON files, which on Vercel
live in `/tmp` (see [backend/src/services/dataDir.js](backend/src/services/dataDir.js)).
`/tmp` is per-instance and ephemeral: entries vanish when the instance is
recycled, and two instances don't see each other's data. The site still renders
— it falls back to `shared/defaultContent.js` — but edits and contact messages
are lost. Fine for local dev, not for the live site.

Moving existing edits: anything saved before the database was connected lived in
`/tmp` and can't be carried over, apart from content you exported with the
admin's **Settings → Download backup**, which you can restore from the same page.

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
- `DATABASE_URL` — the Postgres connection string. Set by the Neon integration;
  without it, data is only kept temporarily (see above).
- `DATA_DIR` — override where the JSON files are written when there is no
  database. Only useful on a host
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
