import React, { useState } from 'react';
import { ASSETS, ASSET_CATEGORIES } from './data';

const CAT_FILTERS    = ['All', 'AV', 'Staging', 'Registration', 'Catering', 'Branding'];
const STATUS_FILTERS = ['All', 'Confirmed', 'Pending', 'Draft'];
const STATUS_CYCLE   = { draft: 'pending', pending: 'confirmed', confirmed: 'draft' };

function groupByLoadIn(assets) {
    const map = {};
    assets.forEach(a => {
        if (!map[a.loadIn]) map[a.loadIn] = [];
        map[a.loadIn].push(a);
    });
    return Object.entries(map).sort((a, b) => {
        // Sort by date string: "Apr 12, 2:00 PM" etc.
        return new Date(a[0]) - new Date(b[0]) || a[0].localeCompare(b[0]);
    });
}

export default function Phase1AssetSetup({ showToast }) {
    const [assets,       setAssets]       = useState(ASSETS);
    const [search,       setSearch]       = useState('');
    const [catFilter,    setCatFilter]    = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');

    const confirmed = assets.filter(a => a.status === 'confirmed').length;
    const pending   = assets.filter(a => a.status === 'pending').length;
    const draft     = assets.filter(a => a.status === 'draft').length;

    const filtered = assets.filter(a => {
        const matchCat    = catFilter === 'All' || a.category === catFilter;
        const matchStatus = statusFilter === 'All' || a.status === statusFilter.toLowerCase();
        const q           = search.toLowerCase();
        const matchSearch = !q || a.name.toLowerCase().includes(q) || a.vendor.toLowerCase().includes(q) || a.zone.toLowerCase().includes(q);
        return matchCat && matchStatus && matchSearch;
    });

    const timeline = groupByLoadIn(assets);

    const cycleStatus = (id) => {
        setAssets(prev => prev.map(a =>
            a.id === id ? { ...a, status: STATUS_CYCLE[a.status] } : a
        ));
        showToast?.('Status updated');
    };

    return (
        <div className="ast-layout--full">

            {/* ── Stat Cards ── */}
            <div className="ast-stat-row ast-stat-row--4">
                <div className="ast-stat-card">
                    <div className="ast-stat-card__label">Total Assets</div>
                    <div className="ast-stat-card__value">{assets.length}</div>
                </div>
                <div className="ast-stat-card">
                    <div className="ast-stat-card__label">Confirmed</div>
                    <div className="ast-stat-card__value ast-stat-card__value--green">{confirmed}</div>
                </div>
                <div className="ast-stat-card">
                    <div className="ast-stat-card__label">Pending</div>
                    <div className="ast-stat-card__value ast-stat-card__value--amber">{pending}</div>
                </div>
                <div className="ast-stat-card">
                    <div className="ast-stat-card__label">Draft</div>
                    <div className="ast-stat-card__value ast-stat-card__value--muted">{draft}</div>
                </div>
            </div>

            {/* ── Load-In Schedule Summary ── */}
            <div className="ast-card">
                <div className="ast-card__header">
                    <span className="ast-card__title">Load-In Schedule Summary</span>
                </div>
                <div className="ast-timeline">
                    {timeline.map(([time, items], idx) => (
                        <div key={time} className={`ast-timeline__row ${idx === timeline.length - 1 ? 'ast-timeline__row--last' : ''}`}>
                            <div className="ast-timeline__time">{time}</div>
                            <div className="ast-timeline__line-col">
                                <div className="ast-timeline__dot" />
                                {idx < timeline.length - 1 && <div className="ast-timeline__stem" />}
                            </div>
                            <div className="ast-timeline__tags">
                                {items.map(a => {
                                    const cat = ASSET_CATEGORIES.find(c => c.id === a.category);
                                    return (
                                        <span
                                            key={a.id}
                                            className="ast-tag"
                                            style={{ background: cat?.bg, color: cat?.color, borderColor: cat?.color + '55' }}
                                        >
                                            {a.name}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Filter Bar ── */}
            <div className="ast-filter-bar">
                <div className="ast-filter-bar__search-wrap">
                    <span className="ast-filter-bar__search-icon">○</span>
                    <input
                        className="ast-filter-bar__input"
                        type="text"
                        placeholder="Search assets..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                <div className="ast-filter-bar__chips">
                    {CAT_FILTERS.map(f => (
                        <button
                            key={f}
                            className={`ast-chip ${catFilter === f ? 'ast-chip--active' : ''}`}
                            onClick={() => setCatFilter(f)}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className="ast-filter-bar__divider" />

                <div className="ast-filter-bar__chips">
                    {STATUS_FILTERS.map(f => (
                        <button
                            key={f}
                            className={`ast-chip ${statusFilter === f ? 'ast-chip--active' : ''}`}
                            onClick={() => setStatusFilter(f)}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <button className="ast-btn ast-btn--primary ast-btn--sm ast-filter-bar__add">
                    + Add asset
                </button>
            </div>

            {/* ── Asset Table ── */}
            <div className="ast-card">
                <table className="ast-table">
                    <thead>
                        <tr>
                            <th>Asset</th>
                            <th>Category</th>
                            <th>Zone</th>
                            <th>Vendor</th>
                            <th>Load-In</th>
                            <th>Load-Out</th>
                            <th style={{ textAlign: 'center' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(a => {
                            const cat = ASSET_CATEGORIES.find(c => c.id === a.category);
                            return (
                                <tr key={a.id}>
                                    <td>
                                        <div className="ast-asset-name-cell">
                                            <span className="ast-asset-icon">◈</span>
                                            <span className="ast-asset-name">{a.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span
                                            className="ast-pill"
                                            style={{ background: cat?.bg, color: cat?.color }}
                                        >
                                            {a.category}
                                        </span>
                                    </td>
                                    <td className="ast-table-muted">{a.zone}</td>
                                    <td className="ast-table-muted">{a.vendor}</td>
                                    <td className="ast-table-mono">{a.loadIn}</td>
                                    <td className="ast-table-mono">{a.loadOut}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button
                                            className={`ast-status-btn ast-status-btn--${a.status}`}
                                            onClick={() => cycleStatus(a.id)}
                                            title="Click to cycle status"
                                        >
                                            {a.status === 'confirmed' && <><span>✓</span> Confirmed</>}
                                            {a.status === 'pending'   && <><span>◷</span> Pending</>}
                                            {a.status === 'draft'     && <><span>○</span> Draft</>}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        {filtered.length === 0 && (
                            <tr>
                                <td
                                    colSpan={7}
                                    style={{ textAlign: 'center', color: 'hsl(var(--muted-foreground))', padding: '28px', fontSize: 'var(--text-sm)' }}
                                >
                                    No assets match your filters
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
}
