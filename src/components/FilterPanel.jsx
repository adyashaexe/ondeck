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
      <input
        type="text"
        placeholder="Job title or keywords"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Location (or leave blank)"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <input
        type="number"
        placeholder="Min salary"
        value={minSalary}
        onChange={(e) => setMinSalary(e.target.value)}
      />
      <input
        type="number"
        placeholder="Posted within (days)"
        value={postedWithinDays}
        onChange={(e) => setPostedWithinDays(e.target.value)}
      />
      <select
        value={experienceLevel}
        onChange={(e) => setExperienceLevel(e.target.value)}
      >
        <option value="">Any experience level</option>
        <option value="entry">Entry level</option>
        <option value="mid">Mid level</option>
        <option value="senior">Senior level</option>
      </select>
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={remoteOnly}
          onChange={(e) => setRemoteOnly(e.target.checked)}
        />
        Remote only
      </label>
      <button type="submit" disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>
    </form>
  )
}
