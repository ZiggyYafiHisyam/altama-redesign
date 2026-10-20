# The admin panel

**The admin edits the site's images, and only its images.** Every picture a
visitor sees — logos, hero backgrounds, portraits, article covers, gallery tiles
— is swapped at **`/admin`**, and goes live the moment you save. The site's copy
(headlines, paragraphs, job openings, links, menus) is fixed content: it lives in
[`shared/defaultContent.js`](shared/defaultContent.js) and is changed in code.

Sign in at **`/admin/login`** with **`admin`** / **`123`** — the form arrives
prefilled with them, so it is one click locally. See
[Changing the credentials](#changing-the-credentials) before the site is public.

## How it fits together

There is one JSON **content document** that holds the whole site's copy and
image references. Three pieces share it:

| Piece | Where | Job |
| --- | --- | --- |
| The defaults | [`shared/defaultContent.js`](shared/defaultContent.js) | The content the site ships with — all of its text, and the image it starts with in every slot. |
| The store | [`backend/src/services/contentStore.js`](backend/src/services/contentStore.js) | Reads and writes `content.json`, filling any missing field in from the defaults. |
| The provider | [`frontend/lib/ContentProvider.jsx`](frontend/lib/ContentProvider.jsx) | Fetches the document once and hands it to every page through `useSection()`. |

The admin writes to that same document, but only to its image fields. Which
fields those are is declared in one place,
[`frontend/admin/lib/imageFields.js`](frontend/admin/lib/imageFields.js) — the
admin's Images page is a render of that registry, so adding an image to it is the
only edit needed to make a new picture editable.

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

Every image in the admin can be uploaded, dropped onto its preview, picked from
the library, reused from the shipped assets or pasted in as a URL, and clearing it
puts the page back to its placeholder. Uploads are capped at 3 MB and held as base64 in `media.json`,
because `/tmp` is the only writable path on Vercel and a separate file tree there
would buy nothing.

## What is editable where

| Admin page | What it holds |
| --- | --- |
| Dashboard | Visits, messages, image counts, shortcuts |
| Site images | A menu of every page that has images; each one opens its own editor. Logos and the mascot, the home page, the four page heroes, award icons, board portraits, testimonial photos, article covers, the footer artwork |
| Gallery | The two image grids — the Instagram grid on `/gallery` and the mosaic on `/web-gallery` — drawn in the admin the way the site lays them out |
| Media library | Upload, rename, delete the uploaded images (reached from any image field's picker; it has no menu entry of its own) |
| Inbox | Contact-form submissions: read, annotate, mark handled, delete |
| Analytics | Visits, pages, sources and the web traffic log, with weekly and monthly CSV reports |
| Settings | Backup, restore, reset |

## What the analytics page counts

A **page view** is one page opened on the site; admin pages are never logged.
A **visit** is the pages one browser opened in one sitting, grouped by a random
id the site keeps in `sessionStorage` for the life of the tab — it identifies a
sitting, not a person, it is never reused tomorrow, and nothing else about the
visitor is stored. The backend adds only a device and browser family, derived
from the user-agent header; the header itself is discarded.

Rows logged before visits existed are grouped by a 30-minute gap instead and
marked **est.** in the log, because that grouping is a guess.

Bots are labelled on arrival and left out of every figure unless you tick
*Include bots*. The two downloads differ in kind: the **day log** is the raw
rows (one per page view), and the **weekly / monthly reports** are summaries —
totals, a day-by-day table, and breakdowns by page, source, entry page and
device.

## Two editing models

**Site images** is one draft across every page: swap as many pictures as you
like, then one Save writes them. Only the sections you actually changed are sent.
*Restore original images* puts every slot back to the picture the site shipped
with — and leaves the surrounding copy alone, which is why it is not the API's
section reset.

**Gallery** is edited in place. Both grids are drawn in the admin in the shape
the page renders them — the mosaic's seven slots in their real positions, the
Instagram tiles in their real order — and a picture is replaced by clicking the
picture: upload a file, drop one onto the tile, or pick from the library.
Replacing is the common case and needs no row to expand; adding a tile, deleting
one and reordering are there for when the grid itself has to change. It is one
draft of the gallery too, so everything lands in a single Save.

A section `PATCH` takes arrays wholesale, so the saved list is exactly what the
editor shows — which is what lets add, delete and reorder ride along in the same
save rather than needing the per-item collection endpoints.

## The API

Reading is public — it is what the site renders. Writing needs a session. The
admin only uses `PATCH /api/content/:section` and the media endpoints; the
collection endpoints and the whole-document ones are what a restore, a reset or
another client would use.

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

`:collection` is a dotted path such as `gallery.web`. Only the paths declared in
`CONTENT_COLLECTIONS` are reachable, so a request cannot walk into an arbitrary
part of the document.

A `PATCH` is merged, not replaced, so sending a section with one image changed
leaves every headline and paragraph in it untouched.

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

## Making another image editable

1. Give it a field in `shared/defaultContent.js`, holding an `asset:…` key.
2. Render it through `resolveImage()` in the component that needs it.
3. Add its path to a group in `frontend/admin/lib/imageFields.js`.

Nothing else: the Images page, the save-only-what-changed logic and *Restore
original images* all read that registry.
