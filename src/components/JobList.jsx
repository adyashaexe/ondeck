import JobCard from './JobCard.jsx'

function SkeletonCard() {
  return (
    <div className="job-card skeleton" aria-hidden="true">
      <div className="skeleton-line skeleton-title" />
      <div className="skeleton-line skeleton-sub" />
      <div className="skeleton-line skeleton-meta" />
    </div>
  )
}

export default function JobList({ jobs, loading, error }) {
  if (loading) {
    return (
      <div className="job-list">
        {[0, 1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (error) return <p className="status-text error">{error}</p>
  if (jobs.length === 0) return <p className="status-text">No jobs found yet — try a search above.</p>

  return (
    <div className="job-list">
      {jobs.map((job, i) => (
        <JobCard key={`${job.source}-${i}`} job={job} index={i} />
      ))}
    </div>
  )
}
