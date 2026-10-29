# PT Altama Surya Anugerah — redesign website by Zeke

REKAP PROGRESS:
1) Home dan routing semua halaman udah di sesuaikan ama web asli altama terbaru
2) Admin page buat CRUD method gambar" dan beberapa teks tersedia di route /admin nya
3) FE dan BE masih full deploy di vercel, belum letakin BE dan DB di railway (nunggu arahan dan revisi bang daffa dulu)
4) Input data dari home page udah bisa dsn bakal muncul di inbox admin page

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
| `backend/src/` | The Express API: routes, controllers, JSON-file stores. |
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
