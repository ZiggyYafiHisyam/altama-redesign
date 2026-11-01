# PT Altama Surya Anugerah — redesign website by Zeke

REKAP PROGRESS:
1) Home dan routing semua halaman udah di sesuaikan ama web asli altama terbaru
2) Admin page buat CRUD method gambar" dan beberapa teks tersedia di route /admin nya
3) FE dan BE masih full deploy di vercel, belum letakin BE dan DB di railway (nunggu arahan dan revisi bang daffa dulu)
4) Input data dari home page udah bisa dsn bakal muncul di inbox admin page

--------------------------------------------

## Revision summary (November 2026)

**Result:** the live site now saves everything permanently to a Neon Postgres
database. Verified on 2 November 2026: the Neon database and the admin panel
showed the same counts (1 contact message, 15 page views, 0 uploads), and
`/api/health` reported `"storage":"postgres"`, `"connected":true`.

Before this revision, contact messages, admin edits, uploads and page views were
written to temporary files on Vercel and were lost whenever the server restarted.

### What changed

| Change | Details |
| --- | --- |
| Database | Content, contact messages, page views and uploaded images are stored in Neon Postgres (`site_content`, `contacts`, `page_views`, `media`). Tables are created automatically on the first request. Code: `backend/src/services/`. |
| Fallback | Without `DATABASE_URL` the API still uses JSON files, so `npm run dev` works without a database. |
| Hosting | Frontend and API still deploy together on Vercel. The API function is pinned to Singapore (`sin1`), next to the database. |
| Health check | `GET /api/health` shows where data is saved (`postgres` or `files`), whether the database answered, and the start of its endpoint name. |
| Fixes | Server errors no longer reveal the database address; marking a message handled no longer erases its note. |
| Tooling | `CLAUDE.md` (assistant instructions and project notes) and Neon agent skills in `.claude/skills/`. |

### Vercel environment variables (all private)

`DATABASE_URL` (the pooled Neon link), `ADMIN_USERNAME`, `ADMIN_PASSWORD`,
`ADMIN_SESSION_SECRET`.

### Still to do

- Reset the Neon database password and storage keys (they were shared in chat), then update `DATABASE_URL` on Vercel.
- Site fixes: hero text overlapping the brand logos, words joining on mobile, placeholder phone number and social links.
- Compress the images (29 MB total) and load the admin panel separately.
- Optional Neon services not wired in yet: image storage, admin accounts, live updates.

--------------------------------------------

A Vite/React single-page site with an Express API and a built-in admin panel for
swapping the site's images. The copy is fixed content in
`shared/defaultContent.js`; the pictures are editable at `/admin`.

```
npm install
npm run dev        # frontend on :5173, API on :4000
```

- **The site** — `/`, `/visi-misi`, `/award`, `/board`, `/life-at`,
  `/grow-with`, `/contact-us`, `/gallery`, `/web-gallery`, `/detail-news`, plus
  a page per brand (`/brand/<slug>`) and per article (`/news/<slug>`).
- **The admin** — `/admin`, signing in at `/admin/login` with `admin` / `123`
  (the form is prefilled). See [ADMIN.md](ADMIN.md).

## Layout

| Path | What it is |
| --- | --- |
| `frontend/pages/` | One folder per route. |
| `frontend/components/` | The sections the pages are built from. |
| `frontend/admin/` | The admin panel: layout, the image editors, form controls. |
| `frontend/lib/` | The API client, the content provider, image resolution, text helpers. |
| `shared/defaultContent.js` | The site's content, and the shape of it. Imported by both halves. |
| `backend/src/` | The Express API: routes, controllers, stores (Postgres via `DATABASE_URL`, JSON files without it). |
| `api/index.js` | The Vercel serverless wrapper around the same Express app. |

## Documentation

- [ADMIN.md](ADMIN.md) — which images are editable and how to add another, how
  the content document and the CRUD API work, and how to change the admin
  credentials.
- [DEPLOYMENT.md](DEPLOYMENT.md) — deploying to Vercel, environment variables,
  and why stored data is temporary there.

## Scripts

| Command | Does |
| --- | --- |
| `npm run dev` | Frontend and backend together, with `/api` proxied. |
| `npm run build` | Production build into `dist/`. |
| `npm run lint` | ESLint over the frontend and backend. |
| `npm start` | Serve the build and run the API. |
