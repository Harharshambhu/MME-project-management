import React from 'react';
import { KANBAN_COLUMNS } from './data';

function PriorityBadge({ priority }) {
    return (
        <span className={`tasks-priority tasks-priority--${priority}`}>
            <span className={`tasks-priority-dot tasks-priority-dot--${priority}`} />
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </span>
    );
}

function KanbanCard({ task, onClick }) {
    const doneCount  = (task.checklist || []).filter(c => c.done).length;
    const totalCount = (task.checklist || []).length;

    return (
        <div className="tasks-kanban-card" onClick={() => onClick(task)}>
            <div className="tasks-kanban-card__top">
                <PriorityBadge priority={task.priority} />
                {task.tags.map(t => (
                    <span key={t} className="tasks-tag">{t}</span>
                ))}
            </div>

            <div className="tasks-kanban-card__title">{task.title}</div>

            {task.linkedForm && (
                <div className="tasks-kanban-card__linked-form">
                    <span>◈</span>
                    <span>{task.linkedForm}</span>
                </div>
            )}

            {task.progress > 0 && task.status !== 'done' && (
                <div style={{ marginBottom: 8 }}>
                    <div className="tasks-progress-bar" style={{ width: '100%', display: 'block' }}>
                        <div className="tasks-progress-fill" style={{ width: `${task.progress}%` }} />
                    </div>
                </div>
            )}

            <div className="tasks-kanban-card__footer">
                <div className="tasks-avatar" title={task.assignee}>{task.assigneeInitials}</div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
                    {totalCount > 0 && (
                        <span className="tasks-kanban-card__subtask">✓ {doneCount}/{totalCount}</span>
                    )}
                    <span className={`tasks-kanban-card__due${task.isOverdue ? ' tasks-kanban-card__due--overdue' : ''}`}>
                        {task.isOverdue ? `⚠ ${task.due} ⚠` : task.status === 'done' ? `${task.due} ✓` : task.due}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function KanbanView({ tasks, onTaskClick, onAddTask }) {
    const byStatus = (statusId) => tasks.filter(t => t.status === statusId);

    return (
        <div className="tasks-kanban">
            {KANBAN_COLUMNS.map(col => {
                const colTasks = byStatus(col.id);
                return (
                    <div key={col.id} className="tasks-kanban-col">
                        <div className="tasks-kanban-col__header">
                            <span className="tasks-kanban-col__dot" style={{ background: col.dot }} />
                            <span className="tasks-kanban-col__label">{col.label}</span>
                            <span className="tasks-kanban-col__count">{colTasks.length}</span>
                        </div>

                        <div className="tasks-kanban-col__cards">
                            {colTasks.map(task => (
                                <KanbanCard key={task.id} task={task} onClick={onTaskClick} />
                            ))}
                        </div>

                        <button
                            className="tasks-kanban-add"
                            onClick={() => onAddTask && onAddTask(col.id)}
                        >
                            + Add
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
