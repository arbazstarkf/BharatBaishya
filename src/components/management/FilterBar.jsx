'use client';

/**
 * Filter bar for the appointments dashboard, styled like the Daily Register ledger.
 * @param {{
 *   search: string,
 *   onSearchChange: (v: string) => void,
 *   dateFilter: string,
 *   onDateChange: (v: string) => void,
 *   customStart: string,
 *   onCustomStartChange: (v: string) => void,
 *   customEnd: string,
 *   onCustomEndChange: (v: string) => void,
 * }} props
 */
export default function FilterBar({
  search,
  onSearchChange,
  dateFilter,
  onDateChange,
  customStart,
  onCustomStartChange,
  customEnd,
  onCustomEndChange,
}) {
  return (
    <div className="ledger-filter-toolbar">
      {/* Search */}
      <div className="search-box-container">
        <i className="fa-solid fa-magnifying-glass search-icon" />
        <input
          type="text"
          placeholder="Quick search by name, phone or reason..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search appointments"
        />
      </div>

      <div className="toolbar-actions">
        {/* Timeline Filter Modes */}
        {!search ? (
          <div className="filter-modes-group">
            {['today', 'week', 'month', 'all', 'custom'].map((p) => (
              <button
                key={p}
                className={`mode-btn ${dateFilter === p ? 'active' : ''}`}
                onClick={() => onDateChange(p)}
              >
                {p === 'week' ? '1 Week' : p === 'month' ? '1 Month' : p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        ) : (
          <div className="search-active-badge">
            <i className="fa-solid fa-bolt-lightning" />
            Searching Global Database
          </div>
        )}

        {/* Custom Range Inputs */}
        {dateFilter === 'custom' && !search && (
          <div className="custom-range-inputs animate-slideIn">
            <input
              type="date"
              value={customStart}
              onChange={(e) => onCustomStartChange(e.target.value)}
              aria-label="Start date"
            />
            <span className="arrow-sep">→</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => onCustomEndChange(e.target.value)}
              aria-label="End date"
            />
          </div>
        )}
      </div>
    </div>
  );
}
