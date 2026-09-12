import os
from datetime import date, datetime, timedelta
from typing import List, Optional

import requests
from fastapi import FastAPI, Query
from pydantic import BaseModel

app = FastAPI(title="Ondeck API")


# ---------- Schema ----------

class Job(BaseModel):
    title: str
    company: str
    location: Optional[str] = None
    remote: bool = False
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    posted_date: Optional[date] = None
    url: str
    source: str  # "jsearch" or "adzuna"
    experience_level: Optional[str] = None  # "entry", "mid", or "senior"


def _experience_level_from_months(months: Optional[int]) -> Optional[str]:
    """Buckets a numeric months-of-experience figure into a rough level."""
    if months is None:
        return None
    if months <= 24:
        return "entry"
    if months <= 60:
        return "mid"
    return "senior"


def _experience_level_from_title(title: str) -> Optional[str]:
    """Fallback: guess a level from common keywords in the job title."""
    t = title.lower()
    if any(k in t for k in ("senior", "sr.", "sr ", "lead", "principal", "staff")):
        return "senior"
    if any(k in t for k in ("junior", "jr.", "jr ", "entry", "intern", "graduate")):
        return "entry"
    if any(k in t for k in ("mid-level", "mid level", "ii ", "iii ")):
        return "mid"
    return None


# ---------- Sources ----------
# Each source function fails soft (returns []) if its API key isn't set,
# so the app still works with only one source configured.

def fetch_jsearch_jobs(query: str, location: Optional[str] = None) -> List[Job]:
    api_key = os.getenv("RAPIDAPI_KEY")
    if not api_key:
        return []

    search_query = f"{query} in {location}" if location else query
    headers = {"X-RapidAPI-Key": api_key, "X-RapidAPI-Host": "jsearch.p.rapidapi.com"}
    params = {"query": search_query, "num_pages": "1"}

    try:
        resp = requests.get(
            "https://jsearch.p.rapidapi.com/search",
            headers=headers, params=params, timeout=10,
        )
        resp.raise_for_status()
        data = resp.json().get("data", [])
    except requests.RequestException:
        return []

    jobs = []
    for item in data:
        posted = None
        raw = item.get("job_posted_at_datetime_utc")
        if raw:
            try:
                posted = datetime.fromisoformat(raw.replace("Z", "+00:00")).date()
            except ValueError:
                pass

        title = item.get("job_title", "Untitled")
        months = (item.get("job_required_experience") or {}).get("required_experience_in_months")
        level = _experience_level_from_months(months) or _experience_level_from_title(title)

        jobs.append(Job(
            title=title,
            company=item.get("employer_name", "Unknown"),
            location=item.get("job_city") or item.get("job_country"),
            remote=bool(item.get("job_is_remote", False)),
            salary_min=item.get("job_min_salary"),
            salary_max=item.get("job_max_salary"),
            posted_date=posted,
            url=item.get("job_apply_link", ""),
            source="jsearch",
            experience_level=level,
        ))
    return jobs


def fetch_adzuna_jobs(query: str, location: Optional[str] = None) -> List[Job]:
    app_id = os.getenv("ADZUNA_APP_ID")
    app_key = os.getenv("ADZUNA_APP_KEY")
    if not app_id or not app_key:
        return []

    country = os.getenv("ADZUNA_COUNTRY", "in")
    params = {"app_id": app_id, "app_key": app_key, "what": query, "results_per_page": 20}
    if location:
        params["where"] = location

    try:
        resp = requests.get(
            f"https://api.adzuna.com/v1/api/jobs/{country}/search/1",
            params=params, timeout=10,
        )
        resp.raise_for_status()
        results = resp.json().get("results", [])
    except requests.RequestException:
        return []

    jobs = []
    for item in results:
        posted = None
        raw = item.get("created")
        if raw:
            try:
                posted = datetime.fromisoformat(raw.replace("Z", "+00:00")).date()
            except ValueError:
                pass

        location_display = (item.get("location") or {}).get("display_name")
        title_lower = item.get("title", "").lower()
        is_remote = "remote" in title_lower or (
            location_display and "remote" in location_display.lower()
        )

        title = item.get("title", "Untitled")

        jobs.append(Job(
            title=title,
            company=(item.get("company") or {}).get("display_name", "Unknown"),
            location=location_display,
            remote=is_remote,
            salary_min=int(item["salary_min"]) if item.get("salary_min") else None,
            salary_max=int(item["salary_max"]) if item.get("salary_max") else None,
            posted_date=posted,
            url=item.get("redirect_url", ""),
            source="adzuna",
            experience_level=_experience_level_from_title(title),
        ))
    return jobs


# ---------- Filtering ----------

def apply_filters(
    jobs: List[Job],
    min_salary: Optional[int] = None,
    remote_only: bool = False,
    posted_within_days: Optional[int] = None,
    experience_level: Optional[str] = None,
) -> List[Job]:
    result = jobs

    if min_salary is not None:
        result = [j for j in result if (j.salary_max or j.salary_min or 0) >= min_salary]

    if remote_only:
        result = [j for j in result if j.remote]

    if posted_within_days is not None:
        cutoff = date.today() - timedelta(days=posted_within_days)
        result = [j for j in result if j.posted_date and j.posted_date >= cutoff]

    if experience_level:
        result = [j for j in result if j.experience_level == experience_level]

    return result


# ---------- Routes ----------

@app.get("/api")
def health():
    return {"status": "ok", "service": "Ondeck API"}


@app.get("/api/jobs", response_model=List[Job])
def get_jobs(
    query: str = Query(..., description="Job title or keywords"),
    location: Optional[str] = Query(None),
    min_salary: Optional[int] = Query(None),
    remote_only: bool = Query(False),
    posted_within_days: Optional[int] = Query(None),
    experience_level: Optional[str] = Query(
        None, description="One of: entry, mid, senior"
    ),
):
    jobs: List[Job] = []
    jobs += fetch_jsearch_jobs(query=query, location=location)
    jobs += fetch_adzuna_jobs(query=query, location=location)

    return apply_filters(
        jobs,
        min_salary=min_salary,
        remote_only=remote_only,
        posted_within_days=posted_within_days,
        experience_level=experience_level,
    )