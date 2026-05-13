import React from 'react';
import { GANTT_DATE_LABELS, GANTT_TODAY_COL } from './data';

const STATUS_COLOR = {
    done:       'tasks-gantt-bar--done',
    inprogress: 'tasks-gantt-bar--inprogress',
    todo:       'tasks-gantt-bar--pending',
    backlog:    'tasks-gantt-bar--pending',
    review:     'tasks-gantt-bar--pending',
};

function getStatusClass(task) {
    if (task.isOverdue) return 'tasks-gantt-bar--overdue';
    return STATUS_COLOR[task.status] || 'tasks-gantt-bar--pending';
}

export default function GanttView({ tasks }) {
    const COLS      = GANTT_DATE_LABELS.length;
    const COL_W_PCT = 100 / COLS;
    const TODAY_PCT = (GANTT_TODAY_COL / COLS) * 100;

    return (
        <div className="tasks-gantt">
            {/* Header row */}
            <div style={{ display: 'grid', gridTemplateColumns: '200px 44px 1fr', background: 'hsl(var(--muted))', borderBottom: '1px solid hsl(var(--border))' }}>
                <div className="tasks-gantt-head-cell">Task</div>
                <div className="tasks-gantt-head-cell">Who</div>
                <div style={{ display: 'flex', borderBottom: 'none' }}>
                    {GANTT_DATE_LABELS.map(d => (
                        <div key={d} className="tasks-gantt-date-label">{d}</div>
                    ))}
                </div>
            </div>

            {/* Rows */}
            {tasks.map(task => (
                <div key={task.id} style={{ display: 'grid', gridTemplateColumns: '200px 44px 1fr' }}>
                    {/* Task name */}
                    <div className="tasks-gantt-row-cell">
                        <span className={`tasks-priority-dot tasks-priority-dot--${task.priority}`} />
                        <span style={{ fontSize: 'var(--fs-xs)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {task.title.length > 28 ? task.title.slice(0, 28) + '…' : task.title}
                        </span>
                    </div>

                    {/* Assignee */}
                    <div className="tasks-gantt-row-cell" style={{ justifyContent: 'center', padding: '6px' }}>
                        <div className="tasks-avatar" style={{ width: 22, height: 22, fontSize: 9 }}>{task.assigneeInitials}</div>
                    </div>

                    {/* Bar area */}
                    <div className="tasks-gantt-bar-cell" style={{ position: 'relative', borderBottom: '1px solid hsl(var(--border))', padding: '0 2px' }}>
                        {/* Today line */}
                        <div className="tasks-gantt-today" style={{ left: `${TODAY_PCT}%` }} />

                        {/* Bar */}
                        <div
                            className={`tasks-gantt-bar ${getStatusClass(task)}`}
                            style={{
                                left:  `${(task.ganttStart / (COLS * 3)) * 100}%`,
                                width: `${(task.ganttWidth  / (COLS * 3)) * 100}%`,
                                position: 'absolute',
                            }}
                        />

                        {/* Overdue marker */}
                        {task.isOverdue && (
                            <span style={{
                                position: 'absolute',
                                left: `${((task.ganttStart + task.ganttWidth) / (COLS * 3)) * 100}%`,
                                fontSize: 10, color: '#ef4444', lineHeight: 1,
                            }}>△</span>
                        )}
                    </div>
                </div>
            ))}

            {/* Legend */}
            <div className="tasks-gantt-legend">
                {[
                    { cls: 'tasks-gantt-bar--done',       bg: '#22c55e', label: 'Done'        },
                    { cls: 'tasks-gantt-bar--inprogress',  bg: '#f59e0b', label: 'In Progress' },
                    { cls: 'tasks-gantt-bar--overdue',     bg: '#ef4444', label: 'Overdue'     },
                    { cls: 'tasks-gantt-bar--pending',     bg: '#cbd5e1', label: 'Pending'     },
                ].map(l => (
                    <div key={l.label} className="tasks-gantt-legend-item">
                        <div className="tasks-gantt-legend-dot" style={{ background: l.bg }} />
                        {l.label}
                    </div>
                ))}
                <div className="tasks-gantt-today-label">Today (Apr 6)</div>
            </div>
        </div>
    );
}
