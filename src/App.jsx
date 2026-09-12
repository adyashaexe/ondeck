import { useState } from 'react'
import FilterPanel from './components/FilterPanel.jsx'
import JobList from './components/JobList.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import { fetchJobs } from './api.js'

export default function App() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSearch(filters) {
    setLoading(true)
    setError(null)
    try {
      const results = await fetchJobs(filters)
      setJobs(results)
    } catch (err) {
      setError('Something went wrong fetching jobs.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-top">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 32 32" width="22" height="22" fill="none">
                <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                <circle cx="16" cy="16" r="4.5" fill="currentColor" />
              </svg>
            </span>
            <h1>Ondeck</h1>
          </div>
          <ThemeToggle />
        </div>
        <p>Filtered job search across multiple sources.</p>
      </header>
      <FilterPanel onSearch={handleSearch} loading={loading} />
      <JobList jobs={jobs} loading={loading} error={error} />
    </div>
  )
}
