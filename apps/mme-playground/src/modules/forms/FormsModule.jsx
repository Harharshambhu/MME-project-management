import React, { useState } from 'react';
import './forms.css';
import { PIPELINES, PIPELINE_STATS } from './pipeline_data';
import { TASKS } from '../tasks/data';
import FillFormDrawer  from './FillFormDrawer';
import CreateFormModal from './CreateFormModal';
import TasksModule     from '../tasks/TasksModule';

/* ── Helpers ──────────────────────────────────────────────── */
function StatusBadge({ status }) {
    const cfg = {
        active:      { cls: 'forms-badge--active',      label: '→ Active'      },
        complete:    { cls: 'forms-badge--complete',     label: '✓ Complete'    },
        'not-started':{ cls: 'forms-badge--not-started', label: 'Not started'  },
    };
    const c = cfg[status] || cfg['not-started'];
    return <span className={`forms-badge ${c.cls}`}>{c.label}</span>;
}

function StageDots({ stages }) {
    return (
        <div className="forms-stage-dots">
            {stages.map((s, i) => (
                <React.Fragment key={s.id}>
                    <span className={`forms-stage-dot forms-stage-dot--${s.status}`} title={s.label} />
                    {i < stages.length - 1 && <span className="forms-stage-line" />}
                </React.Fragment>
            ))}
        </div>
    );
}

/* ── Pipeline Card (grid) ─────────────────────────────────── */
function PipelineCard({ pipeline, onClick }) {
    return (
        <div className="forms-pipeline-card" onClick={() => onClick(pipeline)}>
            <div className="forms-pipeline-card__head">
                <div>
                    <div className="forms-pipeline-card__name">{pipeline.name}</div>
                    {pipeline.vendor && (
                        <div className="forms-pipeline-card__vendor">{pipeline.vendor}</div>
                    )}
                </div>
                <StatusBadge status={pipeline.status} />
            </div>

            <StageDots stages={pipeline.stages} />

            <div className="forms-pipeline-card__progress">
                {pipeline.stagesComplete}/{pipeline.totalStages} stages complete
            </div>

            {pipeline.autoTrigger && (
                <div className="forms-pipeline-card__trigger">
                    ↻ {pipeline.autoTrigger.length > 70
                        ? pipeline.autoTrigger.slice(0, 70) + '...'
                        : pipeline.autoTrigger}
                </div>
            )}
        </div>
    );
}

/* ── Pipelines List View ──────────────────────────────────── */
function PipelinesView({ pipelines, onSelect, onCreateNew }) {
    return (
        <>
            {/* Stats */}
            <div className="forms-stats-row">
                <div className="forms-stat-card">
                    <div className="forms-stat-card__label">TOTAL FORMS</div>
                    <div className="forms-stat-card__value">{PIPELINE_STATS.total}</div>
                </div>
                <div className="forms-stat-card">
                    <div className="forms-stat-card__label">ACTIVE</div>
                    <div className="forms-stat-card__value">{PIPELINE_STATS.active}</div>
                </div>
                <div className="forms-stat-card">
                    <div className="forms-stat-card__label">COMPLETE</div>
                    <div className="forms-stat-card__value">{PIPELINE_STATS.complete}</div>
                </div>
            </div>

            {/* Grid */}
            <div className="forms-pipeline-grid">
                {pipelines.map(p => (
                    <PipelineCard key={p.id} pipeline={p} onClick={onSelect} />
                ))}

                {/* Create new */}
                <div className="forms-pipeline-card forms-pipeline-card--new" onClick={onCreateNew}>
                    <div className="forms-pipeline-card--new__icon">+</div>
                    <div className="forms-pipeline-card--new__label">Create new form</div>
                </div>
            </div>
        </>
    );
}

/* ── Stage Icon ───────────────────────────────────────────── */
function StageIcon({ status }) {
    if (status === 'complete') return (
        <span className="forms-stage-icon forms-stage-icon--complete">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
            </svg>
        </span>
    );
    if (status === 'current') return <span className="forms-stage-icon forms-stage-icon--current">→</span>;
    return <span className="forms-stage-icon forms-stage-icon--locked">🔒</span>;
}

/* ── Form Detail View ─────────────────────────────────────── */
function FormDetail({ pipeline, onBack, onFillStage }) {
    return (
        <div className="forms-detail">
            {/* Breadcrumb */}
            <div className="forms-detail__breadcrumb">
                <span onClick={onBack} style={{ cursor: 'pointer' }}>← Forms</span>
                <span className="forms-detail__breadcrumb-sep">·</span>
                <span>{pipeline.name}</span>
            </div>

            <div className="forms-detail__header">
                <div className="forms-detail__title">{pipeline.name}</div>
                {pipeline.vendor && (
                    <span className="forms-detail__vendor-badge">Vendor: {pipeline.vendor}</span>
                )}
            </div>

            {/* Description */}
            <div className="forms-detail__card">
                <div className="forms-detail__desc">
                    Multi-stage {pipeline.formType === 'internal' ? 'internal checklist' : 'brief'} from agency
                    {pipeline.vendor ? ` to vendor. Each stage unlocks after the previous is confirmed.` : '.'}
                </div>
                {pipeline.autoTrigger && (
                    <div className="forms-detail__trigger-banner">
                        <span className="forms-detail__trigger-icon">⏱</span>
                        <span>Auto-trigger: {pipeline.autoTrigger}</span>
                    </div>
                )}
            </div>

            {/* Stages */}
            <div className="forms-detail__card">
                <div className="forms-detail__stages-header">
                    <div className="forms-detail__stages-title">Stages</div>
                    <div className="forms-detail__stages-sub">
                        {pipeline.stagesComplete}/{pipeline.totalStages} stages complete
                    </div>
                </div>

                <div className="forms-detail__stages">
                    {pipeline.stages.map((stage, i) => (
                        <React.Fragment key={stage.id}>
                            <div className={`forms-detail__stage forms-detail__stage--${stage.status}`}>
                                <StageIcon status={stage.status} />
                                <div className="forms-detail__stage-body">
                                    <div className="forms-detail__stage-label">{stage.label}</div>
                                    <div className="forms-detail__stage-direction">{stage.direction}</div>
                                    {stage.status === 'complete' && stage.submittedDate && (
                                        <div className="forms-detail__stage-resolution">
                                            Submitted {stage.submittedDate} — {stage.resolution}
                                        </div>
                                    )}
                                    {stage.status === 'current' && !stage.submitted && (
                                        <div className="forms-detail__stage-due">
                                            ⚠ Due {stage.due} — not yet submitted
                                        </div>
                                    )}
                                </div>
                                {stage.status === 'current' && (
                                    <button
                                        className="forms-detail__fill-btn"
                                        onClick={() => onFillStage(stage)}
                                    >
                                        Fill form →
                                    </button>
                                )}
                            </div>
                            {i < pipeline.stages.length - 1 && (
                                <div className="forms-detail__stage-connector" />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <button className="forms-detail__channel-btn">
                ↗ View in channel context
            </button>
        </div>
    );
}

/* ── Main Module Shell ────────────────────────────────────── */
export default function FormsModule({ eventName, onBack }) {
    const [activeTab,      setActiveTab]      = useState('forms');
    const [pipelines,      setPipelines]      = useState(PIPELINES);
    const [activePipeline, setActivePipeline] = useState(null);
    const [fillStage,      setFillStage]      = useState(null);
    const [showCreate,     setShowCreate]     = useState(false);
    // tasks state lives here so it persists across tab switches and can receive auto-tasks from form submissions
    const [tasks,          setTasks]          = useState(TASKS);
    const [taskDrawer,     setTaskDrawer]     = useState(null);

    const displayName = eventName || 'Infosys Summit 2025';

    const handleFillStage = (stage) => {
        setFillStage(stage);
    };

    const handleSubmitStage = (pipelineId, stageId) => {
        // find pipeline + stage before mutating state
        const pipeline = pipelines.find(p => p.id === pipelineId);
        const stage    = pipeline?.stages.find(s => s.id === stageId);

        // auto-create a linked task in the Tasks tab
        if (pipeline && stage) {
            const autoTask = {
                id:               `t-auto-${Date.now()}`,
                title:            `Follow up: ${stage.label} submitted`,
                description:      `Auto-generated when "${stage.label}" was submitted in ${pipeline.name}.`,
                priority:         'medium',
                status:           'todo',
                assignee:         'Unassigned',
                assigneeInitials: 'UA',
                due:              'Apr 15',
                dueRaw:           null,
                start:            '—',
                startRaw:         null,
                progress:         0,
                tags:             ['Auto-generated', pipeline.name],
                linkedForm:       pipeline.name,
                effort:           '0h',
                checklist:        [],
                activityLog:      [
                    { user: 'System', initials: '⚡', action: 'created', note: `Auto-created from form submission: ${stage.label}`, time: 'Today' },
                ],
                isOverdue:  false,
                ganttStart: 14,
                ganttWidth: 5,
            };
            setTasks(prev => [...prev, autoTask]);
        }

        setPipelines(prev => prev.map(p => {
            if (p.id !== pipelineId) return p;
            const stages = p.stages.map(s => {
                if (s.id === stageId) return { ...s, status: 'complete', submittedDate: 'Today', resolution: 'submitted' };
                return s;
            });
            let unlocked = false;
            const updated = stages.map(s => {
                if (!unlocked && s.status === 'locked') {
                    unlocked = true;
                    return { ...s, status: 'current', due: 'Apr 15', submitted: false };
                }
                return s;
            });
            const newComplete = updated.filter(s => s.status === 'complete').length;
            return { ...p, stages: updated, stagesComplete: newComplete };
        }));

        setActivePipeline(prev => {
            if (!prev || prev.id !== pipelineId) return prev;
            return pipelines.find(p => p.id === pipelineId) || prev;
        });
    };

    const handleCreate = (formData) => {
        const stages = Array.from({ length: formData.stageCount }, (_, i) => ({
            id: String.fromCharCode(97 + i),
            label: `Stage ${String.fromCharCode(65 + i)}: Untitled Stage`,
            direction: formData.formType === 'agency' ? 'Agency → Vendor' : 'Internal',
            status: i === 0 ? 'current' : 'locked',
            fields: [],
        }));
        const newPipeline = {
            id: `pipeline-${Date.now()}`,
            name: formData.name,
            vendor: formData.vendor || null,
            status: 'active',
            stagesComplete: 0,
            totalStages: formData.stageCount,
            autoTrigger: formData.autoTrigger || null,
            formType: formData.formType,
            stages,
        };
        setPipelines(prev => [...prev, newPipeline]);
    };

    const headerTitle = () => {
        if (activeTab === 'tasks') return `${displayName} · Tasks`;
        if (activePipeline)       return `${displayName} · Forms · ${activePipeline.name}`;
        return `${displayName} · Forms`;
    };

    const breadcrumbSuffix = activeTab === 'tasks' ? 'INF25 · Tasks' : 'INF25 · Forms';

    const handleBack = () => {
        if (activeTab === 'forms' && activePipeline) {
            setActivePipeline(null);
        } else {
            onBack();
        }
    };

    return (
        <div className="forms-module">

            {/* ── Header ── */}
            <div className="forms-module__header">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div className="forms-module__breadcrumb">
                        <span className="forms-module__breadcrumb-link" onClick={onBack}>Events</span>
                        <span> / </span>
                        <span>{breadcrumbSuffix}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <button className="evdash__back" onClick={handleBack} title="Back">‹</button>
                        <div className="forms-module__header-divider">|</div>
                        <div className="forms-module__title">{headerTitle()}</div>
                    </div>
                </div>

                {/* Action button — context-sensitive */}
                {activeTab === 'forms' && !activePipeline && (
                    <button className="forms-module__create-btn" onClick={() => setShowCreate(true)}>
                        + Create form
                    </button>
                )}
                {activeTab === 'tasks' && (
                    <button className="forms-module__create-btn" onClick={() => setTaskDrawer({ mode: 'create' })}>
                        + New task
                    </button>
                )}
            </div>

            {/* ── Top-level tab strip ── */}
            <div className="forms-module__tabs">
                <button
                    className={`forms-module__tab${activeTab === 'forms' ? ' forms-module__tab--active' : ''}`}
                    onClick={() => { setActiveTab('forms'); setActivePipeline(null); }}
                >
                    Forms &amp; Pipelines
                </button>
                <button
                    className={`forms-module__tab${activeTab === 'tasks' ? ' forms-module__tab--active' : ''}`}
                    onClick={() => setActiveTab('tasks')}
                >
                    Tasks
                </button>
            </div>

            {/* ── Forms tab ── */}
            {activeTab === 'forms' && (
                <>
                    {!activePipeline && (
                        <div className="forms-module__subheader">
                            <h1 className="forms-module__page-title">Forms &amp; Stage Pipelines</h1>
                        </div>
                    )}
                    <div className="forms-module__content">
                        {activePipeline ? (
                            <FormDetail
                                pipeline={activePipeline}
                                onBack={() => setActivePipeline(null)}
                                onFillStage={handleFillStage}
                            />
                        ) : (
                            <PipelinesView
                                pipelines={pipelines}
                                onSelect={setActivePipeline}
                                onCreateNew={() => setShowCreate(true)}
                            />
                        )}
                    </div>

                    {fillStage && (
                        <FillFormDrawer
                            pipeline={activePipeline}
                            stage={fillStage}
                            onClose={() => setFillStage(null)}
                            onSubmit={handleSubmitStage}
                        />
                    )}

                    {showCreate && (
                        <CreateFormModal
                            onClose={() => setShowCreate(false)}
                            onCreate={handleCreate}
                        />
                    )}
                </>
            )}

            {/* ── Tasks tab — always mounted so state (view, search) survives tab switches ── */}
            <div style={{
                display:        activeTab === 'tasks' ? 'flex' : 'none',
                flex:           1,
                flexDirection:  'column',
                overflow:       'hidden',
                minHeight:      0,
            }}>
                <TasksModule
                    eventName={eventName}
                    showHeader={false}
                    tasks={tasks}
                    setTasks={setTasks}
                    drawer={taskDrawer}
                    setDrawer={setTaskDrawer}
                />
            </div>
        </div>
    );
}
