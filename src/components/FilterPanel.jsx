import { useState } from 'react'

export default function FilterPanel({ onSearch, loading }) {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [minSalary, setMinSalary] = useState('')
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [postedWithinDays, setPostedWithinDays] = useState('')
  const [experienceLevel, setExperienceLevel] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onSearch({ query, location, minSalary, remoteOnly, postedWithinDays, experienceLevel })
  }

  return (
    <form className="filter-panel" onSubmit={handleSubmit}>
      <div className="filter-intro">
        <span className="filter-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="21" height="21" fill="none">
            <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.7" />
            <path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </span>
        <div>
          <h2>Find your fit</h2>
          <p>Tell us what you’re looking for. We’ll handle the digging.</p>
        </div>
      </div>

      <div className="field-grid">
        <label className="field field-wide">
          <span>ROLE OR KEYWORDS</span>
          <input
            type="text"
            placeholder="e.g. Product designer, data analyst..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
          />
        </label>

        <label className="field">
          <span>LOCATION</span>
          <input
            type="text"
            placeholder="City, country, or anywhere"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>

        <label className="field">
          <span>MINIMUM SALARY (USD)</span>
          <input
            type="number"
            min="0"
            placeholder="e.g. 60000"
            value={minSalary}
            onChange={(e) => setMinSalary(e.target.value)}
          />
        </label>

        <label className="field">
          <span>POSTED WITHIN</span>
          <input
            type="number"
            min="1"
            placeholder="Any time"
            value={postedWithinDays}
            onChange={(e) => setPostedWithinDays(e.target.value)}
          />
        </label>

        <label className="field">
          <span>EXPERIENCE LEVEL</span>
          <select
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
          >
            <option value="">All experience levels</option>
            <option value="entry">Entry level</option>
            <option value="mid">Mid level</option>
            <option value="senior">Senior level</option>
          </select>
        </label>
      </div>

      <div className="filter-actions">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={remoteOnly}
            onChange={(e) => setRemoteOnly(e.target.checked)}
          />
          <span className="custom-checkbox" aria-hidden="true">
            <svg viewBox="0 0 16 16" width="12" height="12" fill="none">
              <path d="m3.5 8 3 3 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          Remote opportunities only
        </label>

        <button type="submit" className="search-button" disabled={loading}>
          <span>{loading ? 'Searching' : 'Search opportunities'}</span>
          {loading ? (
            <span className="button-spinner" aria-hidden="true" />
          ) : (
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true">
              <path d="M3.5 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>
    </form>
  )
}
