import pg from "pg"
import { attachDatabasePool } from "@vercel/functions"

// Postgres (Neon) when DATABASE_URL is set, which the Vercel Neon integration
// does for you. Unset, every store falls back to its JSON file in DATA_DIR, so
// `npm run dev` still works without a database.
const DATABASE_URL = process.env.DATABASE_URL

export const pool = DATABASE_URL
    ? new pg.Pool({ connectionString: DATABASE_URL, max: 5, idleTimeoutMillis: 5000 })
    : null

// On Vercel, lets an idle pool's connections be closed before the function is
// suspended instead of leaking them.
if (pool && process.env.VERCEL) attachDatabasePool(pool)

export const usingDatabase = pool !== null

// The whole schema. Every statement is idempotent, so it runs once per cold
// start and a fresh Neon database needs no manual setup.
const SCHEMA = `
    CREATE TABLE IF NOT EXISTS site_content (
        id          integer PRIMARY KEY CHECK (id = 1),
        document    jsonb NOT NULL,
        updated_at  timestamptz NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS contacts (
        id          text PRIMARY KEY,
        name        text NOT NULL,
        email       text NOT NULL,
        phone       text NOT NULL,
        location    text NOT NULL,
        message     text NOT NULL,
        handled     boolean NOT NULL DEFAULT false,
        note        text,
        created_at  timestamptz NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS page_views (
        id          text PRIMARY KEY,
        path        text NOT NULL,
        referrer    text,
        session_id  text,
        device      text,
        browser     text,
        opened_at   timestamptz NOT NULL DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS page_views_opened_at_idx ON page_views (opened_at);

    CREATE TABLE IF NOT EXISTS media (
        id          text PRIMARY KEY,
        name        text NOT NULL,
        mime_type   text NOT NULL,
        size        integer NOT NULL,
        data        bytea NOT NULL,
        created_at  timestamptz NOT NULL DEFAULT now()
    );
`

let schemaReady = null

function ensureSchema() {
    schemaReady ??= pool.query(SCHEMA).catch((error) => {
        // Let the next request try again rather than caching the failure.
        schemaReady = null
        throw error
    })
    return schemaReady
}

export async function query(text, params) {
    await ensureSchema()
    return pool.query(text, params)
}
