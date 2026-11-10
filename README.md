# Ondeck

<p align="center">
  <strong>A clearer way to find your next opportunity.</strong><br />
  Search jobs across multiple sources, narrow the results with practical filters, and focus on roles that fit your next move.
</p>

<p align="center">
  <a href="https://github.com/adyashaexe/ondeck/actions/workflows/validate.yml"><img src="https://github.com/adyashaexe/ondeck/actions/workflows/validate.yml/badge.svg" alt="Ondeck validation workflow" /></a>
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" alt="React 18" />
  <img src="https://img.shields.io/badge/Python-FastAPI-009688?logo=fastapi&logoColor=white" alt="Python FastAPI" />
  <img src="https://img.shields.io/badge/Deployment-Vercel-black?logo=vercel" alt="Vercel" />
  <img src="https://img.shields.io/badge/License-Unspecified-lightgrey" alt="License not specified" />
</p>

---

## Overview

**Ondeck** is a job discovery dashboard built with React and FastAPI. It brings job listings from **JSearch** and **Adzuna** into one searchable feed, with filters designed to make the search more targeted.

The interface features a refined dashboard layout, responsive styling, theme switching, animated interactions, loading feedback, and clear search states.

## Features

- **Multi-source job discovery** — retrieve listings from JSearch and Adzuna.
- **Keyword search** — search by role, title, or skill.
- **Location filtering** — narrow results by city, region, or country.
- **Salary filtering** — set a minimum salary threshold (USD).
- **Remote-only search** — focus on remote opportunities.
- **Posting-date filter** — limit results to recently posted roles.
- **Experience-level filter** — filter for entry, mid, or senior roles.
- **Responsive dashboard** — use the interface across desktop and mobile layouts.
- **Theme toggle** — switch between available visual themes.
- **Thoughtful UI states** — loading indicators, empty states, and actionable error feedback.
- **Automated validation** — GitHub Actions checks the frontend build and backend imports.

> Job availability, salary data, posting dates, and application links depend on the upstream providers. Ondeck does not guarantee that a listing is still active.

## Tech stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 18, Vite 5, JavaScript |
| Styling | CSS |
| Backend | Python, FastAPI, Pydantic |
| HTTP requests | Requests |
| Job data | JSearch API, Adzuna API |
| Deployment | Vercel |
| CI | GitHub Actions |

## Architecture

Ondeck is designed to run as a **single Vercel project**. The frontend and API share the same origin, so the browser can call the backend through relative `/api/*` routes.

```text
ondeck/
├── api/
│   └── index.py              # FastAPI app and job-provider integrations
├── src/
│   ├── components/
│   │   ├── FilterPanel.jsx   # Search inputs and filters
│   │   ├── JobCard.jsx       # Individual job listing
│   │   ├── JobList.jsx       # Results, loading and empty states
│   │   └── ThemeToggle.jsx   # Theme control
│   ├── App.jsx               # Main dashboard
│   ├── api.js                # Frontend API client
│   ├── index.css             # Application styles
│   └── main.jsx              # React entry point
├── .github/
│   └── workflows/
│       └── validate.yml      # Frontend and backend CI checks
├── index.html
├── package.json
├── requirements.txt
├── vercel.json               # API routing
├── vite.config.js
└── .env.example              # Environment variable reference
```

## Getting started

### Prerequisites

Install the following before running the project:

- Node.js 20 or later
- npm
- Python 3.12 (recommended for local backend checks)
- Vercel CLI
- API credentials for at least one supported job provider

### 1. Clone the repository

```bash
git clone https://github.com/adyashaexe/ondeck.git
cd ondeck
```

### 2. Install frontend dependencies

```bash
npm ci
```

### 3. Set up environment variables

Create a local environment file from the example:

```bash
cp .env.example .env
```

Add the credentials for the provider(s) you want to use:

```env
RAPIDAPI_KEY=your_rapidapi_key
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_APP_KEY=your_adzuna_app_key
ADZUNA_COUNTRY=in
```

You can configure either provider independently. If a provider's credentials are absent, that provider contributes no results. **At least one provider must be configured to retrieve live listings.**

Keep real credentials private. Do not commit your `.env` file or expose API keys in frontend code.

### 4. Start the application

Install the Vercel CLI if you do not already have it:

```bash
npm install --global vercel
```

Then start the local Vercel development environment from the project root:

```bash
vercel dev
```

Open the local URL printed by the CLI (commonly [http://localhost:3000](http://localhost:3000)). Vercel CLI serves the Vite frontend and Python API together, matching the intended deployment structure.

## API reference

The backend exposes the following routes:

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api` | API health check |
| `GET` | `/api/jobs` | Search and filter job listings |

### Search parameters

The `/api/jobs` endpoint accepts these query parameters:

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `query` | string | Yes | Job title, role, or keywords |
| `location` | string | No | Location to search in |
| `min_salary` | integer | No | Minimum salary threshold in USD |
| `remote_only` | boolean | No | Return remote listings only |
| `posted_within_days` | integer | No | Limit results to the specified number of recent days |
| `experience_level` | string | No | `entry`, `mid`, or `senior` |

Example request:

```bash
curl "http://localhost:3000/api/jobs?query=data%20analyst&location=India&remote_only=true"
```

A successful request returns a JSON array of job objects. Each job may include:

- `title` and `company`
- `location` and `remote`
- `salary_min` and `salary_max`
- `posted_date`
- `url` — the provider's application link
- `source` — `jsearch` or `adzuna`
- `experience_level`

Salary, date, location, and experience fields can be unavailable when the source does not provide them.

## Job data providers

Ondeck currently integrates with:

- **JSearch** — job search API available through [RapidAPI](https://rapidapi.com/).
- **Adzuna** — job listings API available through the [Adzuna Developer Portal](https://developer.adzuna.com/).

Review each provider's documentation, rate limits, pricing, and usage terms before using the service. Provider availability and API quotas may affect search results.

## Deploy to Vercel

1. Push the repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com/new).
3. Add the required environment variables in **Project Settings → Environment Variables**:
   - `RAPIDAPI_KEY` (if using JSearch)
   - `ADZUNA_APP_ID` (if using Adzuna)
   - `ADZUNA_APP_KEY` (if using Adzuna)
   - `ADZUNA_COUNTRY` (optional; defaults to `in`)
4. Deploy the project.
5. Verify the deployment by opening `/api` on your deployed domain and running a search from the dashboard.

Vercel should build the Vite frontend and deploy the Python function using the repository configuration. If you change environment variables, trigger a new deployment so the updated values are applied.

## Validation

The GitHub Actions workflow runs on pushes to the main, polish, and fix branches, and on pull requests targeting `main`.

It checks:

- Frontend dependency installation with `npm ci`
- Production frontend compilation with `npm run build`
- Python syntax compilation
- FastAPI application imports and expected route registration

Run the frontend build locally with:

```bash
npm ci
npm run build
```

Run the backend checks locally with:

```bash
python -m pip install -r requirements.txt
python -m compileall -q api
python -c "from api.index import app; print(app.title)"
```

## Troubleshooting

| Issue | What to check |
| --- | --- |
| No job results | Confirm at least one provider's credentials are configured and valid. |
| Provider request fails | Check API subscription status, quotas, credentials, and provider availability. |
| API returns a server error | Open `/api` to check the function is reachable, then inspect the Vercel function logs. |
| Frontend loads but search fails | Verify the `/api/jobs` route and Vercel deployment logs. |
| Environment changes have no effect | Confirm the variables are set for the correct Vercel environment and redeploy. |

## Roadmap

Potential areas for future development:

- Search result sorting by relevance, date, and salary
- Saved searches and bookmarked jobs
- Pagination and improved result navigation
- Server-side caching and request optimization
- More job data providers
- Expanded automated tests for filtering and API behavior

## Contributing

Contributions, bug reports, and feature suggestions are welcome.

1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/your-feature`.
3. Make your changes and run the relevant validation checks.
4. Commit your work with a descriptive message.
5. Open a pull request with a clear summary and testing notes.

## License

No license has been specified yet. Unless a license is added to this repository, the project should be treated as **all rights reserved**. Contact the repository owner before redistributing or reusing the code.

---

<p align="center">
  Built to make the next opportunity easier to find.<br />
  <a href="https://github.com/adyashaexe/ondeck">GitHub Repository</a>
</p>
