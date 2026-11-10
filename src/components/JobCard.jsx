export default function JobCard({ job, index = 0 }) {
  const salaryText =
    job.salary_min && job.salary_max
      ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`
      : null

  return (
    <a
      className="job-card"
      href={job.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ animationDelay: `${Math.min(index, 8) * 55}ms` }}
    >
      <div className="job-card-content">
        <div className="job-card-title-row">
          <h3>{job.title}</h3>
          <span className="job-source">{job.source}</span>
        </div>
        <p className="job-company">{job.company}</p>
        <p className="job-meta">
          <span>{job.location || 'Location not specified'}</span>
          {job.remote && <span className="meta-separator">REMOTE</span>}
          {job.experience_level && (
            <span>{job.experience_level[0].toUpperCase()}{job.experience_level.slice(1)} level</span>
          )}
        </p>
        <div className="job-card-bottom">
          {salaryText && <p className="job-salary">{salaryText}</p>}
          {job.posted_date && <p className="job-date">Posted {job.posted_date}</p>}
        </div>
      </div>
      <span className="job-card-arrow" aria-hidden="true">
        <svg viewBox="0 0 20 20" width="17" height="17" fill="none">
          <path d="M5 15 15 5M6 5h9v9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </a>
  )
}
