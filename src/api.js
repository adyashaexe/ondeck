// Same-origin API requests keep the frontend and FastAPI service on one origin.
export async function fetchJobs(filters) {
  const params = new URLSearchParams()
  params.set('query', filters.query.trim())

  if (filters.location?.trim()) params.set('location', filters.location.trim())
  if (filters.minSalary !== '' && filters.minSalary != null) {
    params.set('min_salary', String(filters.minSalary))
  }
  if (filters.remoteOnly) params.set('remote_only', 'true')
  if (filters.postedWithinDays !== '' && filters.postedWithinDays != null) {
    params.set('posted_within_days', String(filters.postedWithinDays))
  }
  if (filters.experienceLevel) params.set('experience_level', filters.experienceLevel)

  let response
  try {
    response = await fetch(`/api/jobs?${params.toString()}`, {
      headers: { Accept: 'application/json' },
    })
  } catch {
    throw new Error('Unable to reach the job service. Check your connection and try again.')
  }

  if (!response.ok) {
    let detail = ''
    try {
      const body = await response.json()
      detail = body.detail || body.message || ''
    } catch {
      // The server may return a non-JSON error page.
    }
    throw new Error(detail || `Job search failed (HTTP ${response.status}). Please try again.`)
  }

  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    throw new Error('The job service returned an unexpected response. Check the Vercel API routing configuration.')
  }

  const jobs = await response.json()
  if (!Array.isArray(jobs)) {
    throw new Error('The job service returned an invalid results format.')
  }

  return jobs
}
