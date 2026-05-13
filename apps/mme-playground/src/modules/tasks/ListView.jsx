import React from 'react';

const PRIORITY_COLORS = {
    critical: '#dc2626',
    high:     '#d97706',
    medium:   '#2563eb',
    low:      '#94a3b8',
};

function PriorityBadge({ priority }) {
    return (
        <span className={`tasks-priority tasks-priority--${priority}`}>
            <span className={`tasks-priority-dot tasks-priority-dot--${priority}`} />
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </span>
    );
}

export default function ListView({ tasks, onTaskClick }) {
    return (
        <table className="tasks-list-table">
            <thead>
                <tr>
                    <th style={{ width: '36%' }}>Task</th>
                    <th style={{ width: '10%' }}>Priority</th>
                    <th style={{ width: '14%' }}>Assignee</th>
                    <th style={{ width: '10%' }}>Due</th>
                    <th style={{ width: '16%' }}>Progress</th>
                    <th style={{ width: '14%' }}>Form</th>
                </tr>
            </thead>
            <tbody>
                {tasks.map(task => (
                    <tr key={task.id} onClick={() => onTaskClick(task)}>
                        <td>
                            <div className="tasks-list__row-inner">
                                <div
                                    className="tasks-list__priority-bar"
                                    style={{ background: PRIORITY_COLORS[task.priority] }}
                                />
                                <div className="tasks-list__task-cell">
                                    <div className="tasks-list__task-name"
                                         style={{ textDecoration: task.status === 'done' ? 'line-through' : 'none',
                                                  color: task.status === 'done' ? 'hsl(var(--muted-foreground))' : undefined }}>
                                        {task.title}
                                    </div>
                                    <div className="tasks-list__task-tags">
                                        {task.tags.map(t => (
                                            <span key={t} className="tasks-tag">{t}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td><PriorityBadge priority={task.priority} /></td>
                        <td>
                            <div className="tasks-list__assignee-cell">
                                <div className="tasks-avatar">{task.assigneeInitials}</div>
                                <span style={{ fontSize: 'var(--fs-xs)' }}>{task.assignee.split(' ')[0]}</span>
                            </div>
                        </td>
                        <td>
                            <div className={`tasks-list__due-cell${task.isOverdue ? ' tasks-overdue' : ''}`}>
                                {task.isOverdue ? '⚠ ' : ''}{task.due}
                                {task.status === 'done' && <span style={{ color: '#22c55e', marginLeft: 4 }}>✓</span>}
                            </div>
                        </td>
                        <td>
                            <div className="tasks-list__progress-cell">
                                <div className="tasks-progress-bar">
                                    <div className="tasks-progress-fill" style={{ width: `${task.progress}%` }} />
                                </div>
                                <span>{task.progress}%</span>
                            </div>
                        </td>
                        <td>
                            {task.linkedForm ? (
                                <div className="tasks-list__form-cell">
                                    <span className="tasks-list__form-icon">◈</span>
                                    <span>{task.linkedForm}</span>
                                </div>
                            ) : (
                                <span style={{ color: 'hsl(var(--muted-foreground))', fontSize: 'var(--fs-xs)' }}>—</span>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
