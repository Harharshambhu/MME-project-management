import React, { useState } from 'react';
import './guestlists.css';

// ==========================================
// MOCK DATA
// ==========================================
const EVENT = {
  name: "Infosys Leadership Summit 2025",
  date: "Apr 14–16, 2025",
  venue: "Taj Palace, New Delhi",
  globalCapacity: 400,
  confirmed: 312,
  waitlisted: 47
};

// Abbreviated tiers
const TIERS = [
  { id: "gold", name: "Gold", color: "#C9972B", perks: "Front row, lounge access, VIP dinner" },
  { id: "silver", name: "Silver", color: "#78909C", perks: "Main hall access, priority seating" },
  { id: "classic", name: "Classic", color: "#2471A3", perks: "Main hall access" }
];

// Re-engineered schema: companies hold allocations across ALL tiers
const COMPANIES = [
  { 
    id: 1, name: "Acme Corp", 
    allocations: { gold: { cap: 10, used: 10 }, silver: { cap: 40, used: 37 }, classic: { cap: 0, used: 0 } },
    waitlisted: 8, linkActive: true
  },
  { 
    id: 2, name: "TechVentures Ltd", 
    allocations: { gold: { cap: 0, used: 0 }, silver: { cap: 50, used: 50 }, classic: { cap: 30, used: 30 } },
    waitlisted: 19, linkActive: false
  },
  { 
    id: 3, name: "Synapse Capital", 
    allocations: { gold: { cap: 15, used: 12 }, silver: { cap: 15, used: 10 }, classic: { cap: 0, used: 0 } },
    waitlisted: 0, linkActive: true
  },
  { 
    id: 4, name: "Meridian Group", 
    allocations: { gold: { cap: 0, used: 0 }, silver: { cap: 0, used: 0 }, classic: { cap: 60, used: 41 } },
    waitlisted: 12, linkActive: true
  },
  { 
    id: 5, name: "DirectVIP (Manual)", 
    allocations: { gold: { cap: 20, used: 14 }, silver: { cap: 0, used: 0 }, classic: { cap: 0, used: 0 } },
    waitlisted: 0, linkActive: false
  }
];

const CONFIRMED_GUESTS = [
  { id: 1, name: "Rajesh Mehta", company: "Acme Corp", tier: "gold", plusOne: true, dietary: ["Vegetarian", "Nut Allergy"], sessions: 3, ticketCode: "INF25-GLD-0041", status: "confirmed" },
  { id: 2, name: "Sunita Rao", company: "Synapse Capital", tier: "gold", plusOne: false, dietary: ["Jain"], sessions: 2, ticketCode: "INF25-GLD-0018", status: "confirmed" },
  { id: 3, name: "James Okafor", company: "TechVentures Ltd", tier: "silver", plusOne: true, dietary: ["Halal"], sessions: 2, ticketCode: "INF25-SLV-0063", status: "confirmed" },
  { id: 4, name: "Priya Nambiar", company: "DirectVIP", tier: "gold", plusOne: false, dietary: ["None"], sessions: 4, ticketCode: "INF25-GLD-0007", status: "confirmed" }
];

const WAITLIST = [
  { id: 101, name: "Aditya Sharma", company: "Acme Corp", tier: "silver", plusOne: true, dietary: ["Vegetarian"], registeredAt: "2025-03-12 14:32", position: 1 },
  { id: 102, name: "Mei Lin", company: "TechVentures Ltd", tier: "classic", plusOne: false, dietary: ["Vegan"], registeredAt: "2025-03-12 14:41", position: 2 },
  { id: 103, name: "Ravi Krishnamurthy", company: "Meridian Group", tier: "classic", plusOne: true, dietary: ["Halal"], registeredAt: "2025-03-12 15:07", position: 3 },
  { id: 104, name: "Sophie Bernard", company: "TechVentures Ltd", tier: "silver", plusOne: false, dietary: ["None"], registeredAt: "2025-03-12 15:22", position: 4 },
  { id: 105, name: "Karan Patel", company: "Acme Corp", tier: "gold", plusOne: false, dietary: ["Jain"], registeredAt: "2025-03-12 16:04", position: 5 }
];

const DIETARY_AGGREGATE = [
  { label: "Vegetarian", count: 89 },
  { label: "Halal", count: 47 },
  { label: "Vegan", count: 34 },
  { label: "Jain", count: 21 }
];

// Helper to calculate total capacity across all tiers for a company
const getCompanyTotals = (company) => {
  let cap = 0; let used = 0;
  Object.values(company.allocations).forEach(a => { cap += a.cap; used += a.used; });
  return { cap, used, remaining: cap - used };
};

// ==========================================
// SHARED COMPONENTS
// ==========================================
function TierPill({ tier }) {
  const t = TIERS.find(x => x.id === tier);
  if (!t) return <span className="gl-pill">...</span>;
  return <span className="gl-pill gl-pill--tier" style={{ background: `${t.color}20`, color: t.color }}>{t.name}</span>;
}

function StatusPill({ status }) {
  if (status === 'Active' || status === 'confirmed') return <span className="gl-status-pill gl-status-pill--green">{status}</span>;
  if (status === 'CAP REACHED') return <span className="gl-status-pill gl-status-pill--red">CAP REACHED</span>;
  if (status === 'Paused') return <span className="gl-status-pill gl-status-pill--gray">Paused</span>;
  return <span className="gl-status-pill gl-status-pill--navy">{status}</span>;
}

function UtilisationBar({ used, cap, tierColor }) {
  if (cap === 0) return null;
  const percentUsed = Math.min((used / cap) * 100, 100);
  return (
    <div className="gl-util-bar">
      <div className="gl-util-bar__segments">
        <div className="gl-util-bar__seg" style={{ background: tierColor || 'var(--gl-navy)', width: `${percentUsed}%` }} />
      </div>
    </div>
  );
}

function CapacityBar({ confirmed, waitlisted, total }) {
  const confPct = Math.min((confirmed / total) * 100, 100);
  const waitPct = Math.min((waitlisted / total) * 100, 100);
  const remPct = Math.max(100 - confPct, 0);

  return (
    <div className="gl-cap-bar">
      <div className="gl-cap-bar__seg" style={{ width: `${confPct}%`, background: 'var(--gl-green)' }}>{confirmed}</div>
      <div className="gl-cap-bar__seg" style={{ width: `${waitPct}%`, background: 'var(--gl-amber)' }}>{waitlisted}</div>
      <div className="gl-cap-bar__seg" style={{ width: `${remPct}%`, background: '#e0e0e0', color: '#666' }}>{total - confirmed}</div>
    </div>
  );
}

const Icons = {
  Check: () => (
    <span className="gl-icon-circle gl-icon-circle--green">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
    </span>
  ),
  Warn: () => (
    <span className="gl-icon-circle gl-icon-circle--amber">!</span>
  ),
  Cross: () => (
    <span className="gl-icon-circle gl-icon-circle--red">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </span>
  )
};

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="gl-modal-backdrop" onClick={onClose}>
      <div className="gl-modal" onClick={e => e.stopPropagation()}>
        <div className="gl-modal__header">
          {title}
          <button className="gl-modal__close" onClick={onClose}>&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, color }) {
  return (
    <div className="gl-stat-card">
      <span className="gl-stat-card__label" style={{ color }}>{label}</span>
      <span className="gl-stat-card__val">{value}</span>
      {sub && <span className="gl-stat-card__sub">{sub}</span>}
    </div>
  );
}

// ==========================================
// VIEWS
// ==========================================

function ConfigurationView({ companies }) {
  // Removed custom fields (right sidebar) layout entirely. Taking up 100% width.
  return (
    <div className="gl-layout--full">
      <div className="gl-card">
        <div className="gl-card__header">
          <h2 className="gl-card__title">Global Event Capacity</h2>
          <button className="gl-btn gl-btn--secondary">Edit Capacity</button>
        </div>
        <div className="gl-card__body">
          <CapacityBar confirmed={EVENT.confirmed} waitlisted={EVENT.waitlisted} total={EVENT.globalCapacity} />
          <div style={{ display: 'flex', gap: '16px', fontSize: '12px', marginTop: '8px', color: '#555', fontWeight: '500' }}>
            <span><span style={{ color: 'var(--gl-green)' }}>■</span> Confirmed</span>
            <span><span style={{ color: 'var(--gl-amber)' }}>■</span> Waitlisted</span>
            <span><span style={{ color: '#ccc' }}>■</span> Remaining</span>
          </div>
        </div>
      </div>

      <div className="gl-card">
        <div className="gl-card__header">
          <h2 className="gl-card__title">Pass Tiers</h2>
          <button className="gl-btn gl-btn--primary">+ Add Tier</button>
        </div>
        <table className="gl-table">
          <thead>
            <tr>
              <th style={{ width: '25%' }}>Tier Name</th>
              <th style={{ width: '55%' }}>Perks</th>
              <th style={{ textAlign: 'right', width: '20%' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {TIERS.map(t => (
              <tr key={t.id} style={{ '--row-color': t.color }}>
                <td className="tier-border" style={{ fontWeight: '600' }}>{t.name}</td>
                <td style={{ color: '#555' }}>{t.perks}</td>
                <td style={{ textAlign: 'right' }}><button className="gl-btn gl-btn--secondary" style={{ padding: '2px 8px' }}>Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="gl-card">
        <div className="gl-card__header">
          <h2 className="gl-card__title">Multi-Tier Company Allocations Matrix</h2>
          <button className="gl-btn gl-btn--primary">+ Add Company</button>
        </div>
        <table className="gl-table">
          <thead>
            <tr>
              <th style={{ width: '25%' }}>Company</th>
              <th style={{ width: '12%' }}>Gold (used/cap)</th>
              <th style={{ width: '12%' }}>Silver (used/cap)</th>
              <th style={{ width: '12%' }}>Classic (used/cap)</th>
              <th style={{ width: '24%' }}>Overall Utilization</th>
              <th style={{ textAlign: 'right', width: '15%' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map(c => {
              const totals = getCompanyTotals(c);
              return (
                <tr key={c.id}>
                  <td style={{ fontWeight: '600', fontSize: '13px' }}>{c.name}</td>
                  
                  <td style={{ color: c.allocations.gold.cap === 0 ? '#bbb' : (c.allocations.gold.used >= c.allocations.gold.cap ? 'var(--gl-red)' : '#333'), fontWeight: c.allocations.gold.cap > 0 ? 600 : 400 }}>
                    {c.allocations.gold.cap > 0 ? `${c.allocations.gold.used} / ${c.allocations.gold.cap}` : '—'}
                  </td>
                  
                  <td style={{ color: c.allocations.silver.cap === 0 ? '#bbb' : (c.allocations.silver.used >= c.allocations.silver.cap ? 'var(--gl-red)' : '#333'), fontWeight: c.allocations.silver.cap > 0 ? 600 : 400 }}>
                    {c.allocations.silver.cap > 0 ? `${c.allocations.silver.used} / ${c.allocations.silver.cap}` : '—'}
                  </td>
                  
                  <td style={{ color: c.allocations.classic.cap === 0 ? '#bbb' : (c.allocations.classic.used >= c.allocations.classic.cap ? 'var(--gl-red)' : '#333'), fontWeight: c.allocations.classic.cap > 0 ? 600 : 400 }}>
                    {c.allocations.classic.cap > 0 ? `${c.allocations.classic.used} / ${c.allocations.classic.cap}` : '—'}
                  </td>
                  
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '10px', color: '#666', width: '40px' }}>{totals.used}/{totals.cap}</span>
                      <div style={{ flex: 1 }}>
                        <UtilisationBar used={totals.used} cap={totals.cap} tierColor="var(--gl-navy)" />
                      </div>
                    </div>
                  </td>
                  
                  <td style={{ textAlign: 'right' }}><button className="gl-btn gl-btn--secondary" style={{ padding: '2px 8px' }}>Edit Matrix</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CollectionDistributionView({ companies, setModalOpen }) {
  const activeLinks = companies.filter(c => c.linkActive).length;

  return (
    <div className="gl-layout--full">
      <div className="gl-module-header">
        <h1 className="gl-module-title">Collection & Distribution</h1>
        <button className="gl-btn gl-btn--gold" onClick={() => setModalOpen('directVip')}>Generate Direct VIP Ticket</button>
      </div>

      <div className="gl-stat-row">
        <StatCard label="Total Confirmed" value={EVENT.confirmed} color="var(--gl-navy)" sub="Overall attendance" />
        <StatCard label="Waitlisted" value={EVENT.waitlisted} color="var(--gl-amber)" sub="Pending capacity" />
        <StatCard label="Capacity Remaining" value={EVENT.globalCapacity - EVENT.confirmed} color="var(--gl-green)" sub="Global seats open" />
        <StatCard label="Links Active" value={`${activeLinks} / ${companies.filter(c => c.id !== 5).length}`} color="var(--gl-navy)" sub="Companies routing traffic" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {companies.filter(c => c.id !== 5).map(c => {
          const totals = getCompanyTotals(c);
          
          return (
            <div key={c.id} className="gl-card gl-card--hoverable" style={{ marginBottom: 0 }}>
              <div className="gl-card__header" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px' }}>
                <div style={{ fontWeight: '600', fontSize: '15px', color: '#111' }}>{c.name}</div>
                {c.waitlisted > 0 && <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--gl-amber)' }}>{c.waitlisted} waitlisted globally</span>}
              </div>
              
              <div className="gl-card__body" style={{ padding: '0 16px 16px 16px' }}>
                
                {/* Embedded Tier Links Matrix */}
                {Object.entries(c.allocations).map(([tierKey, alloc]) => {
                  if (alloc.cap === 0) return null;
                  const tierColor = TIERS.find(t => t.id === tierKey)?.color || '#999';
                  const isCapped = alloc.used >= alloc.cap;
                  const status = isCapped ? 'CAP REACHED' : (c.linkActive ? 'Active' : 'Paused');
                  const suffix = tierKey.slice(0, 3);
                  const linkString = `mme.io/inf25/${c.name.split(' ')[0].toLowerCase()}-${suffix}`;

                  return (
                    <div key={tierKey} style={{ borderBottom: '1px solid #eee', padding: '12px 0' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                         <TierPill tier={tierKey} />
                         <StatusPill status={status} />
                       </div>
                       
                       <div className="gl-link-block">
                          <span className="gl-link-text">{linkString}</span>
                          <button className="gl-btn gl-btn--secondary" style={{ padding: '2px 8px', fontSize: '10px' }}>Copy</button>
                       </div>
                       
                       <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                         <span style={{ fontSize: '12px', fontWeight: '600', color: isCapped ? 'var(--gl-red)' : 'var(--gl-navy)', width: '60px' }}>{alloc.used} / {alloc.cap}</span>
                         <div style={{ flex: 1 }}>
                           <UtilisationBar used={alloc.used} cap={alloc.cap} tierColor={tierColor} />
                         </div>
                       </div>
                    </div>
                  );
                })}

                <div style={{ marginTop: '16px', background: '#fafafa', padding: '12px', borderRadius: '4px', border: '1px solid #eee' }}>
                  <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px', fontWeight: '600', textTransform: 'uppercase' }}>Overall Company Utilization</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--gl-navy)' }}>{totals.used} / {totals.cap}</span>
                    <div style={{ flex: 1 }}>
                      <UtilisationBar used={totals.used} cap={totals.cap} tierColor="var(--gl-navy)" />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MonitoringWaitlistView({ confirmed, waitlist, setModalOpen }) {
  const [selectAll, setSelectAll] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="gl-layout--split">
        {/* LEFT: Confirmed */}
        <div className="gl-card" style={{ marginBottom: 0 }}>
          <div className="gl-card__header">
            <h2 className="gl-card__title" style={{ fontSize: '16px' }}>Confirmed ({confirmed.length})</h2>
            <input className="gl-search-bar" type="text" placeholder="Search..." style={{ width: '180px' }} />
          </div>
          <table className="gl-table">
            <thead>
              <tr>
                <th style={{ width: '20px' }}>#</th>
                <th>Name</th>
                <th>Company</th>
                <th>Tier</th>
                <th>+1</th>
                <th>Dietary</th>
                <th>Sessions</th>
                <th>Code</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {confirmed.map((g, idx) => (
                <tr key={g.id}>
                  <td style={{ color: '#888' }}>{idx + 1}</td>
                  <td style={{ fontWeight: '600' }}>{g.name}</td>
                  <td style={{ color: '#555', fontSize: '11px' }}>{g.company}</td>
                  <td><TierPill tier={g.tier} /></td>
                  <td style={{ color: '#999' }}>{g.plusOne ? '✓' : '—'}</td>
                  <td>
                    <span className="gl-pill" style={{ background: '#eee', color: '#333' }}>{g.dietary[0]}</span>
                    {g.dietary.length > 1 && <span style={{ fontSize: '10px', color: '#888', marginLeft: '4px' }}>+{g.dietary.length - 1} more</span>}
                  </td>
                  <td style={{ color: '#555', textAlign: 'center' }}>{g.sessions}</td>
                  <td style={{ fontSize: '11px', color: 'var(--gl-navy)' }}>{g.ticketCode}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="gl-btn gl-btn--danger-text" onClick={() => setModalOpen('revokeConfirm')}>Revoke</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="gl-pagination">
            <span>Page 1 of 32</span>
            <div className="gl-pagination-controls">
              <button className="gl-btn gl-btn--secondary" disabled>Prev</button>
              <button className="gl-btn gl-btn--secondary">Next</button>
            </div>
          </div>
        </div>

        <div className="gl-layout__divider"></div>

        {/* RIGHT: Waitlist */}
        <div className="gl-sidebar-panel" style={{ marginBottom: 0 }}>
          <div className="gl-card__header" style={{ background: '#fff' }}>
            <h2 className="gl-card__title" style={{ fontSize: '16px' }}>Waitlist Queue ({waitlist.length})</h2>
          </div>
          <div style={{ padding: '12px 16px', background: '#fff8e1', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--gl-amber)' }}>Deadline: Apr 5 (4 days left)</span>
            <button className="gl-btn gl-btn--primary" disabled>Allocate</button>
          </div>
          
          <table className="gl-table">
            <thead style={{ background: '#f5f5f5' }}>
              <tr>
                <th style={{ width: '24px' }}>
                  <input type="checkbox" checked={selectAll} onChange={e => setSelectAll(e.target.checked)} />
                </th>
                <th style={{ width: '20px' }}>#</th>
                <th>Name</th>
                <th>Company</th>
                <th>Tier</th>
              </tr>
            </thead>
            <tbody>
              {waitlist.map(w => (
                <tr key={w.id}>
                  <td><input type="checkbox" checked={selectAll} readOnly /></td>
                  <td style={{ color: '#888' }}>{w.position}</td>
                  <td style={{ fontWeight: '500' }}>{w.name} {w.plusOne && <span style={{ color: '#999', fontSize: '10px' }}>(+1)</span>}</td>
                  <td style={{ color: '#555', fontSize: '11px' }}>{w.company}</td>
                  <td><TierPill tier={w.tier} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FULL WIDTH: Cancellations Inbox */}
      <div className="gl-card">
        <div className="gl-card__header">
          <h2 className="gl-card__title">Cancellation Inbox (2 pending)</h2>
        </div>
        <table className="gl-table">
          <thead>
            <tr>
              <th>Request Date</th>
              <th>Guest Name</th>
              <th>Company</th>
              <th>Ticket Code</th>
              <th style={{ textAlign: 'right' }}>Resolution</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ color: '#555' }}>Today, 09:14 AM</td>
              <td style={{ fontWeight: '600' }}>John Doe</td>
              <td style={{ color: '#555' }}>Acme Corp</td>
              <td style={{ color: 'var(--gl-navy)' }}>INF25-GLD-0021</td>
              <td style={{ textAlign: 'right' }}>
                <button className="gl-btn gl-btn--secondary" style={{ marginRight: '8px' }}>Dismiss</button>
                <button className="gl-btn gl-btn--danger-fill">Revoke Ticket</button>
              </td>
            </tr>
            <tr>
              <td style={{ color: '#555' }}>Yesterday, 16:40 PM</td>
              <td style={{ fontWeight: '600' }}>Sarah Smith</td>
              <td style={{ color: '#555' }}>TechVentures Ltd</td>
              <td style={{ color: 'var(--gl-navy)' }}>INF25-CLS-0099</td>
              <td style={{ textAlign: 'right' }}>
                <button className="gl-btn gl-btn--secondary" style={{ marginRight: '8px' }}>Dismiss</button>
                <button className="gl-btn gl-btn--danger-fill">Revoke Ticket</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FulfillmentSyncView({ eventName }) {
  return (
    <div className="gl-layout--full">
      <div className="gl-main">
        <div className="gl-module-header">
          <h1 className="gl-module-title">Event Readiness — {eventName}</h1>
          <span style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>Last synced: Today at 14:32</span>
        </div>

        <div className="gl-card">
          <div className="gl-card__body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <Icons.Check />
                <div style={{ marginTop: '-2px' }}>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: '#111' }}>QR Payloads</div>
                  <div style={{ color: '#555', fontSize: '12px', marginTop: '2px' }}>312 tickets encoded. Box office mapping verified.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <Icons.Check />
                <div style={{ marginTop: '-2px' }}>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: '#111' }}>Dietary Data → Catering Module</div>
                  <div style={{ color: '#555', fontSize: '12px', marginTop: '2px' }}>437 dietary entries synced across 312 primary tickets + 125 companions.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <Icons.Warn />
                <div style={{ marginTop: '-2px' }}>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: '#111' }}>Session Registrations → Scheduling Module</div>
                  <div style={{ color: '#555', fontSize: '12px', marginTop: '2px' }}>Sync pending. 312 guests, 847 session slots requested.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <Icons.Check />
                <div style={{ marginTop: '-2px' }}>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: '#111' }}>Will-Call Database Local Sync</div>
                  <div style={{ color: '#555', fontSize: '12px', marginTop: '2px' }}>Local box office DB updated securely. 312 entries live.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <Icons.Cross />
                <div style={{ marginTop: '-2px' }}>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: '#111' }}>No-Show Predictions</div>
                  <div style={{ color: 'var(--gl-red)', fontSize: '12px', marginTop: '2px', fontWeight: '500' }}>Requires post-event data. Available after Apr 16.</div>
                </div>
              </div>
            </div>
            
            <div className="gl-divider" />
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="gl-btn gl-btn--secondary">Force Resync All</button>
              <button className="gl-btn gl-btn--primary">Export Guest List (CSV)</button>
            </div>
          </div>
        </div>

        <div className="gl-card">
          <div className="gl-card__header">
            <h2 className="gl-card__title">Dietary Breakdown Sync Summary</h2>
          </div>
          <div className="gl-card__body">
             {DIETARY_AGGREGATE.map(d => (
                <div key={d.label} className="gl-dietary-row">
                    <div className="gl-dietary-label">{d.label}</div>
                    <div className="gl-dietary-bar-bg">
                        <div className="gl-dietary-bar-fill" style={{ width: `${(d.count / DIETARY_AGGREGATE[0].count) * 100}%` }}></div>
                    </div>
                    <div className="gl-dietary-count">{d.count}</div>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MAIN MODULE SHELL
// ==========================================
export default function GuestListsModule({ eventName, onBack }) {
  const [activeTab, setActiveTab] = useState('configuration');
  const [modalOpen, setModalOpen] = useState(null);
  const displayName = eventName || EVENT.name;

  const TABS = [
    { id: 'configuration', label: 'Configuration' },
    { id: 'collection', label: 'Collection & Distribution' },
    { id: 'monitoring', label: 'Monitoring & Waitlist' },
    { id: 'sync', label: 'Fulfillment & Sync' }
  ];

  return (
    <div className="gl-module">
      <div className="gl-module-topbar">
        {onBack && (
          <button className="evdash__back" onClick={onBack} title="Back to Dashboard">‹</button>
        )}
        <div className="gl-module-event-title">
          <span className="gl-module-event-icon">☐</span>
          <div>
            <div className="gl-module-event-name">Guest Lists</div>
            <div className="gl-module-event-sub">{displayName}</div>
          </div>
        </div>
      </div>

      <div className="gl-nav">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`gl-nav__tab ${activeTab === tab.id ? 'gl-nav__tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="gl-content">
        {activeTab === 'configuration' && <ConfigurationView companies={COMPANIES} />}
        {activeTab === 'collection' && <CollectionDistributionView companies={COMPANIES} setModalOpen={setModalOpen} />}
        {activeTab === 'monitoring' && <MonitoringWaitlistView confirmed={CONFIRMED_GUESTS} waitlist={WAITLIST} setModalOpen={setModalOpen} />}
        {activeTab === 'sync' && <FulfillmentSyncView eventName={displayName} />}
      </div>

      <Modal isOpen={modalOpen === 'directVip'} onClose={() => setModalOpen(null)} title="Generate Direct VIP Ticket">
          <div className="gl-modal__body">
              <div className="gl-form-group">
                  <label className="gl-label">Guest Name *</label>
                  <input type="text" className="gl-input" placeholder="Enter full name" />
              </div>
              <div className="gl-form-group" style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                      <label className="gl-label">Tier</label>
                      <select className="gl-select"><option>Gold</option><option>Silver</option><option>Classic</option></select>
                  </div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', paddingBottom: '8px' }}>
                      <label className="gl-checkbox-label"><input type="checkbox" /> Includes +1</label>
                  </div>
              </div>
          </div>
          <div className="gl-modal__footer">
              <button className="gl-btn gl-btn--secondary" onClick={() => setModalOpen(null)}>Cancel</button>
              <button className="gl-btn gl-btn--gold" onClick={() => setModalOpen(null)}>Generate & Send Ticket</button>
          </div>
      </Modal>

      <Modal isOpen={modalOpen === 'revokeConfirm'} onClose={() => setModalOpen(null)} title="Confirm Revocation">
          <div className="gl-modal__body">
              <p style={{ fontSize: '14px' }}>Revoke this ticket? This will free a seat immediately.</p>
          </div>
          <div className="gl-modal__footer">
              <button className="gl-btn gl-btn--secondary" onClick={() => setModalOpen(null)}>Cancel</button>
              <button className="gl-btn gl-btn--danger-fill" onClick={() => setModalOpen(null)}>Confirm Revoke</button>
          </div>
      </Modal>
    </div>
  );
}
