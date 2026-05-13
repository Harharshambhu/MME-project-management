import React, { useState } from 'react';

const PRIORITY_OPTIONS = [
    { value: 'critical', label: 'Critical', cls: 'critical' },
    { value: 'high',     label: 'High',     cls: 'high'     },
    { value: 'medium',   label: 'Medium',   cls: 'medium'   },
    { value: 'low',      label: 'Low',      cls: 'low'      },
];

const STATUS_OPTIONS = [
    { value: 'backlog',    label: 'Backlog'     },
    { value: 'todo',       label: 'To Do'       },
    { value: 'inprogress', label: 'In Progress' },
    { value: 'review',     label: 'Review'      },
];

function PriorityBadge({ priority }) {
    return <span className={`tasks-priority tasks-priority--${priority}`}>
        <span className={`tasks-priority-dot tasks-priority-dot--${priority}`} />
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>;
}

function StatusBadge({ status }) {
    const labels = { backlog: 'Backlog', todo: 'To Do', inprogress: 'In Progress', review: 'Review', done: 'Done' };
    return <span className={`tasks-status-badge tasks-status-badge--${status}`}>{labels[status] || status}</span>;
}

/* ── CREATE DRAWER ────────────────────────────────────────── */
function CreateDrawer({ onClose, onCreate }) {
    const [form, setForm] = useState({
        title: '', description: '', priority: 'medium',
        status: 'todo', assignee: '', due: '', linkedForm: '', tags: '',
    });

    const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

    return (
        <>
            <div className="tasks-drawer__header">
                <span className="tasks-drawer__header-title">New Task</span>
                <button className="tasks-drawer__close" onClick={onClose}>×</button>
            </div>

            <div className="tasks-drawer__body">
                <div className="tasks-drawer-field">
                    <label>Title *</label>
                    <input
                        placeholder="What needs to be done?"
                        value={form.title}
                        onChange={e => set('title', e.target.value)}
                    />
                </div>

                <div className="tasks-drawer-field">
                    <label>Description</label>
                    <textarea
                        rows={3}
                        placeholder="Add context, acceptance criteria, or notes..."
                        value={form.description}
                        onChange={e => set('description', e.target.value)}
                    />
                </div>

                <div className="tasks-drawer-field">
                    <label>Priority</label>
                    <div className="tasks-drawer-radio-group">
                        {PRIORITY_OPTIONS.map(o => (
                            <button
                                key={o.value}
                                className={`tasks-drawer-radio-item tasks-drawer-radio-item--${o.cls}${form.priority === o.value ? ' tasks-drawer-radio-item--active' : ''}`}
                                onClick={() => set('priority', o.value)}
                            >
                                <span className={`tasks-priority-dot tasks-priority-dot--${o.value}`} />
                                {o.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="tasks-drawer-field">
                    <label>Status</label>
                    <div className="tasks-drawer-radio-group">
                        {STATUS_OPTIONS.map(o => (
                            <button
                                key={o.value}
                                className={`tasks-drawer-radio-item${form.status === o.value ? ' tasks-drawer-radio-item--active' : ''}`}
                                onClick={() => set('status', o.value)}
                            >
                                {o.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="tasks-drawer-field">
                    <label>Assignee</label>
                    <input
                        placeholder="Assign to..."
                        value={form.assignee}
                        onChange={e => set('assignee', e.target.value)}
                    />
                </div>

                <div className="tasks-drawer-field">
                    <label>Due Date</label>
                    <input
                        type="date"
                        value={form.due}
                        onChange={e => set('due', e.target.value)}
                    />
                </div>

                <div className="tasks-drawer-field">
                    <label>Link to Form (optional)</label>
                    <input
                        placeholder="e.g. AV Brief, Catering Brief..."
                        value={form.linkedForm}
                        onChange={e => set('linkedForm', e.target.value)}
                    />
                </div>

                <div className="tasks-drawer-field">
                    <label>Tags (comma-separated)</label>
                    <input
                        placeholder="AV, Stage, Technical..."
                        value={form.tags}
                        onChange={e => set('tags', e.target.value)}
                    />
                </div>

                <div className="tasks-drawer-info-note">
                    Tasks can also be auto-generated from form submissions. When a form stage is approved,
                    the system creates linked tasks based on the objective fields.
                </div>
            </div>

            <div className="tasks-drawer__footer">
                <button className="tasks-drawer__cancel-btn" onClick={onClose}>Cancel</button>
                <button
                    className="tasks-drawer__primary-btn"
                    onClick={() => { onCreate && onCreate(form); onClose(); }}
                    disabled={!form.title.trim()}
                >
                    + Create task
                </button>
            </div>
        </>
    );
}

/* ── EDIT / DETAIL DRAWER ─────────────────────────────────── */
function EditDrawer({ task, onClose, onMarkDone }) {
    const [checklist, setChecklist] = useState(task.checklist || []);
    const [comment, setComment]     = useState('');
    const [comments, setComments]   = useState(task.activityLog || []);
    const [effort, setEffort]       = useState(30);

    const doneCount = checklist.filter(c => c.done).length;

    const toggleCheck = (id) => {
        setChecklist(prev => prev.map(c => c.id === id ? { ...c, done: !c.done } : c));
    };

    const postComment = () => {
        if (!comment.trim()) return;
        setComments(prev => [...prev, {
            user: 'Jane Doe', initials: 'JD',
            action: 'commented', note: comment,
            time: 'Just now',
        }]);
        setComment('');
    };

    return (
        <>
            <div className="tasks-drawer__header">
                <div style={{ display: 'flex', gap: 6 }}>
                    <PriorityBadge priority={task.priority} />
                    <StatusBadge status={task.status} />
                </div>
                <button className="tasks-drawer__close" onClick={onClose}>×</button>
            </div>

            <div className="tasks-drawer__body">
                <div className="tasks-drawer__task-title">{task.title}</div>

                <div className="tasks-drawer-meta-grid">
                    <div className="tasks-drawer-meta-item">
                        <div className="tasks-drawer-meta-item__label">Assignee</div>
                        <div className="tasks-drawer-meta-item__value">{task.assignee}</div>
                    </div>
                    <div className="tasks-drawer-meta-item">
                        <div className="tasks-drawer-meta-item__label">Due</div>
                        <div className={`tasks-drawer-meta-item__value${task.isOverdue ? ' tasks-overdue' : ''}`}>
                            {task.isOverdue ? '⚠ ' : ''}{task.due}
                        </div>
                    </div>
                    <div className="tasks-drawer-meta-item">
                        <div className="tasks-drawer-meta-item__label">Start</div>
                        <div className="tasks-drawer-meta-item__value">{task.start}</div>
                    </div>
                    <div className="tasks-drawer-meta-item">
                        <div className="tasks-drawer-meta-item__label">Progress</div>
                        <div className="tasks-drawer-meta-item__value">{task.progress}%</div>
                    </div>
                </div>

                <div className="tasks-drawer-progress">
                    <div className="tasks-drawer-progress-fill" style={{ width: `${task.progress}%` }} />
                </div>

                {task.description && (
                    <div className="tasks-drawer-section">
                        <div className="tasks-drawer-section__label">Description</div>
                        <div className="tasks-drawer-section__value">{task.description}</div>
                    </div>
                )}

                {task.tags?.length > 0 && (
                    <div className="tasks-drawer-section">
                        <div className="tasks-drawer-section__label">Tags</div>
                        <div className="tasks-drawer-tags">
                            {task.tags.map(t => (
                                <span key={t} className="tasks-drawer-tag">○ {t}</span>
                            ))}
                        </div>
                    </div>
                )}

                {task.linkedForm && (
                    <div className="tasks-drawer-section">
                        <div className="tasks-drawer-section__label">Linked Form</div>
                        <div className="tasks-drawer-linked-form">
                            <span>◈ {task.linkedForm}</span>
                            <span style={{ color: 'hsl(var(--muted-foreground))' }}>›</span>
                        </div>
                    </div>
                )}

                <div className="tasks-drawer-section">
                    <div className="tasks-drawer-section__label">Effort</div>
                    <div className="tasks-drawer-effort">
                        <input
                            type="range" min={0} max={100}
                            value={effort}
                            onChange={e => setEffort(e.target.value)}
                        />
                        <span style={{ fontSize: 'var(--fs-xs)', color: 'hsl(var(--muted-foreground))' }}>
                            {task.effort || `${Math.round(effort * 0.04)}h / 4h`}
                        </span>
                    </div>
                </div>

                {checklist.length > 0 && (
                    <div className="tasks-drawer-section">
                        <div className="tasks-drawer-section__label">
                            Checklist
                            <span className="tasks-drawer-checklist-progress" style={{ float: 'right' }}>
                                {doneCount}/{checklist.length}
                            </span>
                        </div>
                        <div className="tasks-drawer-checklist">
                            {checklist.map(item => (
                                <label
                                    key={item.id}
                                    className={`tasks-drawer-checklist-item${item.done ? ' tasks-drawer-checklist-item--done' : ''}`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={item.done}
                                        onChange={() => toggleCheck(item.id)}
                                    />
                                    {item.text}
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                <div className="tasks-drawer-section">
                    <div className="tasks-drawer-section__label">Activity Log</div>
                    <div className="tasks-drawer-activity">
                        {comments.map((log, i) => (
                            <div key={i} className="tasks-drawer-activity-item">
                                <div className="tasks-drawer-activity-avatar">{log.initials}</div>
                                <div className="tasks-drawer-activity-content">
                                    <span className="tasks-drawer-activity-user">{log.user} </span>
                                    <span className="tasks-drawer-activity-action">{log.action}</span>
                                    {log.note && <div className="tasks-drawer-activity-note">"{log.note}"</div>}
                                    <div className="tasks-drawer-activity-time">{log.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="tasks-drawer-comment">
                        <input
                            placeholder="Add a comment..."
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && postComment()}
                        />
                        <button className="tasks-drawer-comment-btn" onClick={postComment}>Post</button>
                    </div>
                </div>
            </div>

            <div className="tasks-drawer__footer">
                <button className="tasks-drawer__cancel-btn" onClick={onClose}>Edit</button>
                <button className="tasks-drawer__done-btn" onClick={() => { onMarkDone && onMarkDone(task.id); onClose(); }}>
                    ✓ Mark done
                </button>
            </div>
        </>
    );
}

/* ── MAIN EXPORT ──────────────────────────────────────────── */
export default function TaskDrawer({ mode, task, onClose, onCreate, onMarkDone }) {
    return (
        <div className="tasks-drawer-overlay" onClick={onClose}>
            <div className="tasks-drawer" onClick={e => e.stopPropagation()}>
                {mode === 'create'
                    ? <CreateDrawer onClose={onClose} onCreate={onCreate} />
                    : <EditDrawer task={task} onClose={onClose} onMarkDone={onMarkDone} />
                }
            </div>
        </div>
    );
}
