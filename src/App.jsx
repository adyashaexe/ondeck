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
      setError(err instanceof Error ? err.message : 'Unable to fetch jobs. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />

      <main className="app">
        <header className="app-header">
          <a className="brand" href="/" aria-label="Ondeck home">
            <span className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 32 32" width="25" height="25" fill="none">
                <circle cx="16" cy="16" r="12.5" stroke="currentColor" strokeWidth="1.7" strokeDasharray="3.5 3.5" />
                <circle cx="16" cy="16" r="4.5" fill="currentColor" />
                <path d="M16 1.5v4M16 26.5v4M1.5 16h4M26.5 16h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </span>
            <span className="brand-name">ondeck<span className="brand-period">.</span></span>
            <span className="brand-divider" aria-hidden="true" />
            <span className="brand-caption">CAREER RADAR</span>
          </a>
          <ThemeToggle />
        </header>

        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-dot" /> YOUR NEXT CHAPTER STARTS HERE</p>
            <h1>Good work.<br /><span>Better opportunities.</span></h1>
            <p className="hero-description">
              A more focused way to find your next role. Search across sources,
              fine-tune what matters, and keep your momentum.
            </p>
          </div>

          <div className="hero-aside" aria-label="Search benefits">
            <div className="orbit-art" aria-hidden="true">
              <span className="orbit-ring orbit-ring-one" />
              <span className="orbit-ring orbit-ring-two" />
              <span className="orbit-core"><span /></span>
              <span className="orbit-point orbit-point-one" />
              <span className="orbit-point orbit-point-two" />
              <span className="orbit-point orbit-point-three" />
            </div>
            <div className="hero-aside-copy">
              <span className="aside-kicker">A CLEARER WAY FORWARD</span>
              <span className="aside-note">Less scrolling. More direction.</span>
            </div>
          </div>
        </section>

        <FilterPanel onSearch={handleSearch} loading={loading} />

        <section className="results-section" aria-label="Job search results">
          <div className="section-heading">
            <div>
              <p className="section-kicker">THE OPPORTUNITY FEED</p>
              <h2>Explore what’s next</h2>
            </div>
            <span className="results-context">
              {loading ? 'UPDATING' : jobs.length ? `${jobs.length} MATCHES` : 'READY WHEN YOU ARE'}
            </span>
          </div>
          <JobList jobs={jobs} loading={loading} error={error} />
        </section>

        <footer className="app-footer">
          <span>ondeck<span className="brand-period">.</span></span>
          <span>Stay curious. Keep moving.</span>
        </footer>
      </main>
    </div>
  )
}
