# The admin panel

Everything a visitor reads on the site — every headline, photo, job opening,
testimonial, article and link — is edited at **`/admin`**, and goes live the
moment you save.

Sign in at **`/admin/login`** with **`admin`** / **`123`** — the form arrives
prefilled with them, so it is one click locally. See
[Changing the credentials](#changing-the-credentials) before the site is public.

## How it fits together

There is one JSON **content document** that holds the whole site's copy and
image references. Three pieces share it:

| Piece | Where | Job |
| --- | --- | --- |
| The defaults | [`shared/defaultContent.js`](shared/defaultContent.js) | The content the site ships with. Imported by both the API and the frontend, so it is the single source of truth for the shape of a page. |
| The store | [`backend/src/services/contentStore.js`](backend/src/services/contentStore.js) | Reads and writes `content.json`, filling any missing field in from the defaults. |
| The provider | [`frontend/lib/ContentProvider.jsx`](frontend/lib/ContentProvider.jsx) | Fetches the document once and hands it to every page through `useSection()`. |

Two consequences worth knowing:

- **The site renders even with the backend down.** The frontend starts from the
  bundled defaults and swaps in the API's copy when it arrives, so a failed
  fetch costs you edits, not the page.
- **Adding a field to `shared/defaultContent.js` is safe.** Stored documents
  gain it on their next read instead of rendering `undefined`.

## Images

An image is stored as a string, in one of three forms:

- `asset:hero/hero.png` — a file in `frontend/assets`, i.e. one of the images
  the site shipped with. Vite fingerprints these at build time, so the content
  document holds a key and [`frontend/lib/assets.js`](frontend/lib/assets.js)
  resolves it to the real URL.
- `/api/media/<id>` — something uploaded through the admin's media library.
- `https://…` — any external URL.

Every image field in the admin can upload a new file, pick from the library,
reuse a shipped asset or take a pasted URL. Uploads are capped at 3 MB and held
as base64 in `media.json`, because `/tmp` is the only writable path on Vercel
and a separate file tree there would buy nothing.

## What is editable where

| Admin page | Site pages it drives |
| --- | --- |
| Home | `/` — hero, intro, banners, award block, careers teaser, location form |
| Vision & Mission | `/visi-misi` — vision, mission points, core values, milestones |
| Awards | `/award` |
| Board of Directors | `/board` |
| Life at Altama | `/life-at` — hero and testimonials |
| Careers | `/grow-with`, and the first few openings on the home page |
| Gallery | `/gallery` and `/web-gallery` |
| News | `/detail-news` and `/news/<slug>` |
| Brands | `/brand/<slug>` — one page per brand, generated from the list |
| Contact & Thanks | `/contact-us`, `/terimakasih` |
| Identity & contact | Logos, mascot, brand chips, phone/email/address, socials, the shared call-to-action — all pages |
| Menus & footer | The navbar dropdowns and footer columns — all pages |
| Media library | Upload, rename, delete images |
| Inbox | Contact-form submissions: read, annotate, mark handled, delete |
| Analytics | The page-view log |
| Settings | Backup, restore, reset |

Brands and news articles are **routed from content**: add one and its page
exists at `/brand/<slug>` or `/news/<slug>` straight away. No route to add.

## Two editing models

Pages are edited as a **section draft** — type freely, then one Save sends the
whole section, with a sticky bar that appears only when something is unsaved.

Lists (milestones, jobs, testimonials, articles, brands, gallery tiles, menu
links…) are edited **per item**: each row keeps its own draft and its own Save,
and add/delete/reorder take effect immediately. Two people editing different
rows therefore cannot overwrite each other.

## The API

Reading is public — it is what the site renders. Writing needs a session.

```
GET    /api/content                              the whole document
GET    /api/content/schema                       what is editable
PUT    /api/content                              replace everything (restore)
PATCH  /api/content/:section                     merge into one section
POST   /api/content/reset[/:section]             back to the defaults

GET    /api/content/items/:collection            one list
POST   /api/content/items/:collection            create
PUT    /api/content/items/:collection/:id        update
DELETE /api/content/items/:collection/:id        delete
PUT    /api/content/items/:collection/order      reorder

POST   /api/admin/login                          { username, password } -> token
GET    /api/admin/me                             validate a token
GET    /api/admin/stats                          dashboard numbers
GET    /api/admin/media                          list uploads
POST   /api/admin/media                          upload a base64 data URL
PATCH  /api/admin/media/:id                      rename
DELETE /api/admin/media/:id                      delete
GET    /api/media/:id                            serve an image (public)

GET    /api/contact                              submissions
PATCH  /api/contact/:id                          mark handled / annotate
DELETE /api/contact/:id                          delete
GET    /api/page-views                           the view log
DELETE /api/page-views                           clear it
```

`:collection` is a dotted path such as `visiMisi.milestones`. Only the paths
declared in `CONTENT_COLLECTIONS` are reachable, so a request cannot walk into
an arbitrary part of the document.

Authenticate with `Authorization: Bearer <token>`. The pre-existing
`x-admin-key` header still works for the contact and page-view exports, so
anything already using it keeps working.

## Changing the credentials

Set these on the server — they are deployment config, not content, so there is
no way to change them from inside the admin:

| Variable | Default | Notes |
| --- | --- | --- |
| `ADMIN_USERNAME` | `admin` | |
| `ADMIN_PASSWORD` | `123` | |
| `ADMIN_SESSION_SECRET` | derived from the username and password | Set it to a long random string to keep sessions valid across a password change. |
| `ADMIN_SESSION_HOURS` | `12` | How long a session lasts. |

Sessions are self-contained signed tokens (HMAC-SHA256) held in
`sessionStorage`, so closing the tab signs you out and no server-side session
list is needed — which matters on Vercel, where consecutive requests may hit
different instances.

The login endpoint is rate-limited to 10 attempts a minute per IP. That counter
is in memory, so on Vercel it is per-instance rather than global: it blunts a
naive guessing loop, and a deployment that needs a hard guarantee wants a shared
store.

## Where the data lives, and the catch

`content.json`, `media.json`, `contacts.json` and `pageViews.json` are written
to `DATA_DIR` — `backend/data` locally, `/tmp/altama-data` on Vercel.

**On Vercel that is temporary.** `/tmp` is per-instance and is wiped when the
instance is recycled, so edits and uploads can disappear and two instances do
not see each other's writes. It is enough to demonstrate the whole flow; it is
not somewhere to keep the real site's content. Two ways out:

- Point `DATA_DIR` at a mounted volume on a host with a persistent disk (see the
  Railway notes in [DEPLOYMENT.md](DEPLOYMENT.md)).
- Move the stores to a hosted database — only the files in
  `backend/src/services/` would change.

Until then, use **Settings → Download backup** after a substantial editing
session. The backup holds the text and the image references, not the uploaded
image files.
