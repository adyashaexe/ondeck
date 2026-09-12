// Same-origin call — the frontend and API are one Vercel deployment,
// so no base URL or CORS config is needed.

export async function fetchJobs(filters) {
  const params = new URLSearchParams()

  params.set('query', filters.query)
  if (filters.location) params.set('location', filters.location)
  if (filters.minSalary) params.set('min_salary', filters.minSalary)
  if (filters.remoteOnly) params.set('remote_only', 'true')
  if (filters.postedWithinDays) params.set('posted_within_days', filters.postedWithinDays)
  if (filters.experienceLevel) params.set('experience_level', filters.experienceLevel)

  const response = await fetch(`/api/jobs?${params.toString()}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch jobs: ${response.status}`)
  }

  return response.json()
}
