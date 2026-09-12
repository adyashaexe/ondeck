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
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
    >
      <div className="job-card-header">
        <h3>{job.title}</h3>
        <span className="job-source">{job.source}</span>
      </div>
      <p className="job-company">{job.company}</p>
      <p className="job-meta">
        {job.location || 'Location not specified'}
        {job.remote && ' · Remote'}
        {job.experience_level && ` · ${job.experience_level[0].toUpperCase()}${job.experience_level.slice(1)} level`}
      </p>
      {salaryText && <p className="job-salary">{salaryText}</p>}
      {job.posted_date && <p className="job-date">Posted {job.posted_date}</p>}
    </a>
  )
}
