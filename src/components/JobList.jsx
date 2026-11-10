import JobCard from './JobCard.jsx'

function SkeletonCard({ index }) {
  return (
    <div
      className="job-card skeleton"
      style={{ animationDelay: `${index * 75}ms` }}
      aria-hidden="true"
    >
      <div className="skeleton-content">
        <div className="skeleton-line skeleton-title" />
        <div className="skeleton-line skeleton-sub" />
        <div className="skeleton-line skeleton-meta" />
      </div>
      <div className="skeleton-circle" />
    </div>
  )
}

function EmptyState() {
  return (
    <div className="status-card">
      <span className="empty-icon" aria-hidden="true">
        <svg viewBox="0 0 32 32" width="27" height="27" fill="none">
          <circle cx="13.5" cy="13.5" r="8.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="m20 20 6 6M10 13.5h7M13.5 10v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </span>
      <h3>Your next opportunity is out there.</h3>
      <p>Start with a role or a skill. Your results will show up here.</p>
    </div>
  )
}

export default function JobList({ jobs, loading, error }) {
  if (loading) {
    return (
      <div className="job-list" aria-label="Loading job results" aria-busy="true">
        {[0, 1, 2, 3].map((i) => (
          <SkeletonCard key={i} index={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return <p className="status-text error" role="alert">{error}</p>
  }

  if (jobs.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="job-list" aria-live="polite">
      {jobs.map((job, i) => (
        <JobCard key={`${job.source}-${job.url || i}`} job={job} index={i} />
      ))}
    </div>
  )
}
