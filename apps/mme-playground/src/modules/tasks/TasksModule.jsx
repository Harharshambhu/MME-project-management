import React, { useState } from 'react';
import './tasks.css';
import { TASKS } from './data';
import ListView      from './ListView';
import KanbanView    from './KanbanView';
import GanttView     from './GanttView';
import AnalyticsView from './AnalyticsView';
import TaskDrawer    from './TaskDrawer';

const VIEWS = [
    { id: 'list',      icon: '≡',  label: 'List'      },
    { id: 'kanban',    icon: '⊞',  label: 'Kanban'    },
    { id: 'gantt',     icon: '▤',  label: 'Gantt'     },
    { id: 'analytics', icon: '↗',  label: 'Analytics' },
];

export default function TasksModule({
    eventName,
    onBack,
    showHeader = true,
    // controlled props — when provided by FormsModule, use these instead of internal state
    tasks:    externalTasks,
    setTasks: setExternalTasks,
    drawer:    externalDrawer,
    setDrawer: setExternalDrawer,
}) {
    const [internalTasks,  setInternalTasks]  = useState(TASKS);
    const [internalDrawer, setInternalDrawer] = useState(null);
    const [activeView,     setActiveView]     = useState('list');
    const [search,         setSearch]         = useState('');

    // use external state if provided, otherwise own state
    const tasks    = externalTasks    ?? internalTasks;
    const setTasks = setExternalTasks ?? setInternalTasks;
    const drawer   = externalDrawer   ?? internalDrawer;
    const setDrawer = setExternalDrawer ?? setInternalDrawer;

    const displayName = eventName || 'Infosys Summit 2025';

    // compute summary live from actual tasks array
    const summary = {
        total:       tasks.length,
        done:        tasks.filter(t => t.status === 'done').length,
        overdue:     tasks.filter(t => t.isOverdue).length,
        critical:    tasks.filter(t => t.priority === 'critical').length,
        completePct: tasks.length
            ? Math.round(tasks.filter(t => t.status === 'done').length / tasks.length * 100)
            : 0,
    };

    const filtered = tasks.filter(t =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
    );

    const markDone = (id) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'done', progress: 100 } : t));
    };

    const addTask = (form) => {
        const newTask = {
            id:               `t${Date.now()}`,
            title:            form.title,
            description:      form.description,
            priority:         form.priority,
            status:           form.status,
            assignee:         form.assignee || 'Unassigned',
            assigneeInitials: form.assignee
                ? form.assignee.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                : 'UA',
            due:              form.due || '—',
            dueRaw:           form.due,
            start:            '—',
            startRaw:         null,
            progress:         0,
            tags:             form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
            linkedForm:       form.linkedForm || null,
            effort:           '0h',
            checklist:        [],
            activityLog:      [],
            isOverdue:        false,
            ganttStart:       14,
            ganttWidth:       6,
        };
        setTasks(prev => [...prev, newTask]);
    };

    return (
        <div className="tasks-module">

            {/* ── Header (standalone mode only) ── */}
            {showHeader && (
                <div className="tasks-header">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <div className="tasks-header__breadcrumb">
                            <a onClick={onBack}>Events</a>
                            <span>/</span>
                            <span>INF25 · Tasks</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <button className="evdash__back" onClick={onBack} title="Back">‹</button>
                            <div className="tasks-header__divider">|</div>
                            <div className="tasks-header__title">{displayName} · Tasks</div>
                        </div>
                    </div>
                    <button className="tasks-header__new-btn" onClick={() => setDrawer({ mode: 'create' })}>
                        + New task
                    </button>
                </div>
            )}

            {/* ── Summary Bar ── */}
            <div className="tasks-summary">
                <div className="tasks-summary__stat">
                    <strong>{summary.total}</strong> Total
                </div>
                <div className="tasks-summary__stat">
                    <strong>{summary.done}</strong> Done
                </div>
                <div className="tasks-summary__stat tasks-summary__stat--overdue">
                    <strong>{summary.overdue}</strong> Overdue
                </div>
                <div className="tasks-summary__stat tasks-summary__stat--critical">
                    <strong>{summary.critical}</strong> Critical
                </div>
                <div className="tasks-summary__progress">
                    <div className="tasks-summary__progress-bar">
                        <div className="tasks-summary__progress-fill" style={{ width: `${summary.completePct}%` }} />
                    </div>
                    <span className="tasks-summary__pct">{summary.completePct}% complete</span>
                </div>
            </div>

            {/* ── Toolbar ── */}
            <div className="tasks-toolbar">
                <div className="tasks-view-tabs">
                    {VIEWS.map(v => (
                        <button
                            key={v.id}
                            className={`tasks-view-tab${activeView === v.id ? ' tasks-view-tab--active' : ''}`}
                            onClick={() => setActiveView(v.id)}
                        >
                            {v.icon} {v.label}
                        </button>
                    ))}
                </div>
                <input
                    className="tasks-search"
                    placeholder="Search tasks..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <button className="tasks-filter-btn">Priority ▾</button>
                <button className="tasks-filter-btn">Assignee ▾</button>
            </div>

            {/* ── Content ── */}
            <div className="tasks-content">
                {activeView === 'list' && (
                    <ListView
                        tasks={filtered}
                        onTaskClick={(task) => setDrawer({ mode: 'edit', task })}
                    />
                )}
                {activeView === 'kanban' && (
                    <KanbanView
                        tasks={filtered}
                        onTaskClick={(task) => setDrawer({ mode: 'edit', task })}
                        onAddTask={() => setDrawer({ mode: 'create' })}
                    />
                )}
                {activeView === 'gantt' && (
                    <GanttView tasks={filtered} />
                )}
                {activeView === 'analytics' && (
                    <AnalyticsView tasks={tasks} />
                )}
            </div>

            {/* ── Drawer ── */}
            {drawer && (
                <TaskDrawer
                    mode={drawer.mode}
                    task={drawer.task}
                    onClose={() => setDrawer(null)}
                    onCreate={addTask}
                    onMarkDone={markDone}
                />
            )}
        </div>
    );
}
