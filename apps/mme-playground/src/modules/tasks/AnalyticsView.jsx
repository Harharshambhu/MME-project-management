import React from 'react';
import { ANALYTICS_VELOCITY, ANALYTICS_BURNDOWN } from './data';

/* ── Live status bar chart ────────────────────────────────── */
function StatusChart({ tasks }) {
    const STATUS_DEFS = [
        { key: 'backlog',    label: 'Backlog',      color: '#94a3b8' },
        { key: 'todo',       label: 'To Do',        color: '#60a5fa' },
        { key: 'inprogress', label: 'In Progress',  color: '#f59e0b' },
        { key: 'review',     label: 'Review',       color: '#a78bfa' },
        { key: 'done',       label: 'Done',         color: '#22c55e' },
    ];

    const data = STATUS_DEFS.map(s => ({
        ...s,
        count: tasks.filter(t => t.status === s.key).length,
    }));

    const max    = Math.max(...data.map(s => s.count), 1);
    const chartH = 110;

    return (
        <div className="tasks-analytics-card__chart" style={{ alignItems: 'flex-end', gap: 16 }}>
            {data.map(s => {
                const h = Math.max(4, (s.count / max) * chartH);
                return (
                    <div key={s.key} className="tasks-bar-group">
                        <div className="tasks-bar-value">{s.count}</div>
                        <div className="tasks-bar" style={{ height: h, background: s.color, width: '100%' }} />
                        <div className="tasks-bar-label" style={{ fontSize: 10, textAlign: 'center' }}>{s.label}</div>
                    </div>
                );
            })}
        </div>
    );
}

/* ── Live workload bars ────────────────────────────────────── */
function WorkloadChart({ tasks }) {
    const map = {};
    tasks.forEach(t => {
        const name = t.assignee || 'Unassigned';
        const short = name.split(' ')[0];
        if (!map[name]) map[name] = { name: short, assigned: 0, done: 0 };
        map[name].assigned++;
        if (t.status === 'done') map[name].done++;
    });

    const data   = Object.values(map).sort((a, b) => b.assigned - a.assigned).slice(0, 6);
    const max    = Math.max(...data.map(w => w.assigned), 1);
    const chartH = 100;

    return (
        <div className="tasks-analytics-card__chart" style={{ alignItems: 'flex-end', gap: 14 }}>
            {data.map(w => {
                const h = Math.max(4, (w.assigned / max) * chartH);
                return (
                    <div key={w.name} className="tasks-workload-group">
                        <div className="tasks-workload-bars" style={{ height: h + 4 }}>
                            <div className="tasks-workload-bar-assigned" style={{ height: h, background: '#22c55e' }} />
                            <div className="tasks-workload-bar-done" style={{ height: Math.max(2, (w.done / max) * chartH), background: '#e2e8f0' }} />
                        </div>
                        <div className="tasks-bar-label">{w.name}</div>
                    </div>
                );
            })}
        </div>
    );
}

/* ── SVG line chart (static historical data) ──────────────── */
function LineChart({ data, valueKey, color = '#1e293b', dashed = false, dateKey = 'week' }) {
    const W = 400, H = 110;
    const pad = { t: 10, r: 10, b: 20, l: 24 };
    const iW = W - pad.l - pad.r;
    const iH = H - pad.t - pad.b;

    const vals  = data.map(d => d[valueKey]);
    const minV  = Math.min(...vals);
    const maxV  = Math.max(...vals);
    const range = maxV - minV || 1;

    const px = (i) => pad.l + (i / (data.length - 1)) * iW;
    const py = (v) => pad.t + iH - ((v - minV) / range) * iH;

    const points = data.map((d, i) => `${px(i)},${py(d[valueKey])}`).join(' ');
    const ticks  = [minV, Math.round((minV + maxV) / 2), maxV];

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="tasks-line-chart" preserveAspectRatio="none">
            {ticks.map(t => (
                <line key={t}
                    x1={pad.l} y1={py(t)} x2={W - pad.r} y2={py(t)}
                    stroke="hsl(240 5.9% 90%)" strokeWidth={0.5}
                />
            ))}
            {ticks.map(t => (
                <text key={t} x={pad.l - 3} y={py(t) + 3} textAnchor="end"
                    fontSize={9} fill="hsl(240 3.8% 46.1%)">{t}</text>
            ))}
            <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth={1.5}
                strokeDasharray={dashed ? '4 3' : undefined}
            />
            {data.map((d, i) => (
                <circle key={i} cx={px(i)} cy={py(d[valueKey])} r={3}
                    fill={color} stroke="#fff" strokeWidth={1.5} />
            ))}
            {data.map((d, i) => (
                <text key={i} x={px(i)} y={H - 4} textAnchor="middle"
                    fontSize={9} fill="hsl(240 3.8% 46.1%)">{d[dateKey]}</text>
            ))}
        </svg>
    );
}

/* ── Form-to-Task linkage section (live from tasks) ──────── */
function FormLinkage({ tasks }) {
    const linked = tasks.filter(t => t.linkedForm);

    if (linked.length === 0) {
        return (
            <div className="tasks-f2t-section">
                <div className="tasks-f2t-section__title">Form-to-Task Linkage</div>
                <div className="tasks-f2t-section__sub">Auto-generated tasks from form stage submissions</div>
                <div style={{ padding: '20px 0', fontSize: 13, color: 'hsl(var(--muted-foreground))' }}>
                    No form-linked tasks yet. Submit a form stage to auto-generate a task here.
                </div>
            </div>
        );
    }

    // group by linkedForm
    const groups = {};
    linked.forEach(t => {
        if (!groups[t.linkedForm]) {
            groups[t.linkedForm] = {
                form:  t.linkedForm,
                count: 0,
                date:  t.activityLog?.[0]?.time || 'Today',
            };
        }
        groups[t.linkedForm].count++;
    });

    return (
        <div className="tasks-f2t-section">
            <div className="tasks-f2t-section__title">Form-to-Task Linkage</div>
            <div className="tasks-f2t-section__sub">
                Auto-generated tasks from form stage submissions · {linked.length} linked task{linked.length !== 1 ? 's' : ''}
            </div>
            {Object.values(groups).map((g, i) => (
                <div key={i} className="tasks-f2t-row">
                    <span className="tasks-f2t-icon">◈</span>
                    <div style={{ flex: 1 }}>
                        <div className="tasks-f2t-form-name">{g.form}</div>
                        <div className="tasks-f2t-trigger">↻ Stage submission → task auto-created</div>
                    </div>
                    <div className="tasks-f2t-badge">
                        <span className="tasks-f2t-count">+{g.count} task{g.count !== 1 ? 's' : ''}</span>
                        <span style={{ marginLeft: 8, fontSize: 11, color: 'hsl(var(--muted-foreground))' }}>
                            {g.date}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ── Main ─────────────────────────────────────────────────── */
export default function AnalyticsView({ tasks = [] }) {
    return (
        <div className="tasks-analytics">
            <div className="tasks-analytics-grid">

                <div className="tasks-analytics-card">
                    <div className="tasks-analytics-card__title">Task Status Distribution</div>
                    <div className="tasks-analytics-card__sub">Across all Kanban columns</div>
                    <StatusChart tasks={tasks} />
                </div>

                <div className="tasks-analytics-card">
                    <div className="tasks-analytics-card__title">Workload Distribution</div>
                    <div className="tasks-analytics-card__sub">Tasks per assignee vs completed</div>
                    <WorkloadChart tasks={tasks} />
                </div>

                <div className="tasks-analytics-card">
                    <div className="tasks-analytics-card__title">Completion Velocity</div>
                    <div className="tasks-analytics-card__sub">Tasks completed per week</div>
                    <LineChart data={ANALYTICS_VELOCITY} valueKey="count" color="#1e293b" dateKey="week" />
                </div>

                <div className="tasks-analytics-card">
                    <div className="tasks-analytics-card__title">Burndown Chart</div>
                    <div className="tasks-analytics-card__sub">Remaining tasks over time</div>
                    <LineChart data={ANALYTICS_BURNDOWN} valueKey="remaining" color="#ef4444" dashed dateKey="date" />
                </div>
            </div>

            <FormLinkage tasks={tasks} />
        </div>
    );
}
