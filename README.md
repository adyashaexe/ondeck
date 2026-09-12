# Ondeck

A job search app — React frontend + FastAPI backend, deployed as a **single
Vercel project**. One URL serves both the UI and the API (`/api/*`).

## How it's structured

- `src/` — React (Vite) frontend, built as the static site.
- `api/index.py` — FastAPI app deployed as a Vercel Python serverless
  function. Contains the job schema, source integrations (JSearch, Adzuna),
  and filtering logic all in one file for simplicity.
- `vercel.json` — routes every `/api/*` request to `api/index.py`.

There's no separate backend service to deploy or manage — Vercel builds and
serves both from the same project.

## Local development

Install the Vercel CLI once:

```bash
npm i -g vercel
```

Then from the project root:

```bash
npm install
cp .env.example .env    # fill in your API keys
vercel dev
```

`vercel dev` runs the frontend AND the Python API together on one local
server (usually http://localhost:3000) — same setup as production, so
there's nothing extra to configure.

## Getting API keys

- **JSearch**: sign up at rapidapi.com, subscribe to the JSearch API (free
  tier available), copy the key into `RAPIDAPI_KEY`.
- **Adzuna**: sign up at developer.adzuna.com for a free `app_id` and
  `app_key`.

Each source fails soft — if a key is missing, that source just contributes
zero results instead of erroring, so the app works with only one configured.

## Deploying

1. Push this project to a GitHub repo.
2. Import it in Vercel (vercel.com/new) — it auto-detects the Vite frontend
   and the `api/` Python function, no config needed beyond what's in
   `vercel.json`.
3. In the Vercel project's Settings → Environment Variables, add
   `RAPIDAPI_KEY`, `ADZUNA_APP_ID`, `ADZUNA_APP_KEY`, `ADZUNA_COUNTRY`.
4. Deploy. Visit the given URL — frontend and API are both live there.

## Next steps

1. Add caching (Vercel KV) to avoid hitting free-tier rate limits on repeat
   searches.
2. Add sorting (date, salary, relevance).
3. Add saved searches / filter presets.
