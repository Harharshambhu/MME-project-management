import React, { useState } from 'react';

const STAGE_COUNTS = [2, 3, 4, 5, 6];

const FORM_TYPES = [
    { id: 'agency',   label: 'Agency Form',        sub: 'Sent to vendor or external party' },
    { id: 'internal', label: 'Internal Checklist',  sub: 'Internal team use only'           },
];

export default function CreateFormModal({ onClose, onCreate }) {
    const [name,        setName]        = useState('');
    const [stageCount,  setStageCount]  = useState(3);
    const [formType,    setFormType]    = useState('agency');
    const [vendor,      setVendor]      = useState('');
    const [autoTrigger, setAutoTrigger] = useState('');

    const handle = () => {
        if (!name.trim()) return;
        onCreate && onCreate({ name, stageCount, formType, vendor, autoTrigger });
        onClose();
    };

    return (
        <div className="forms-modal-overlay" onClick={onClose}>
            <div className="forms-modal" onClick={e => e.stopPropagation()}>

                <div className="forms-modal__header">
                    <div>
                        <div className="forms-modal__title">Create Form</div>
                        <div className="forms-modal__sub">Multi-stage form or vendor brief</div>
                    </div>
                    <button className="forms-modal__close" onClick={onClose}>×</button>
                </div>

                <div className="forms-modal__body">

                    <div className="forms-modal-field">
                        <label className="forms-modal-field__label">Form Name *</label>
                        <input
                            className="forms-modal-field__input"
                            placeholder="e.g. AV Brief, Security Checklist..."
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>

                    <div className="forms-modal-field">
                        <label className="forms-modal-field__label">Number of Stages</label>
                        <div className="forms-modal-stage-picker">
                            {STAGE_COUNTS.map(n => (
                                <button
                                    key={n}
                                    className={`forms-modal-stage-btn${stageCount === n ? ' forms-modal-stage-btn--active' : ''}`}
                                    onClick={() => setStageCount(n)}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                        <div className="forms-modal-field__hint">
                            {stageCount} stages · stages unlock sequentially
                        </div>
                    </div>

                    <div className="forms-modal-field">
                        <label className="forms-modal-field__label">Form Type</label>
                        <div className="forms-modal-type-grid">
                            {FORM_TYPES.map(t => (
                                <button
                                    key={t.id}
                                    className={`forms-modal-type-btn${formType === t.id ? ' forms-modal-type-btn--active' : ''}`}
                                    onClick={() => setFormType(t.id)}
                                >
                                    <div className="forms-modal-type-btn__label">{t.label}</div>
                                    <div className="forms-modal-type-btn__sub">{t.sub}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="forms-modal-field">
                        <label className="forms-modal-field__label">Assign to Vendor (optional)</label>
                        <input
                            className="forms-modal-field__input"
                            placeholder="e.g. AV Solutions, Grand Caterers..."
                            value={vendor}
                            onChange={e => setVendor(e.target.value)}
                        />
                    </div>

                    <div className="forms-modal-field">
                        <label className="forms-modal-field__label">Auto-trigger rule (optional)</label>
                        <input
                            className="forms-modal-field__input"
                            placeholder="e.g. Stage 2 unlocks when Stage 1 approved..."
                            value={autoTrigger}
                            onChange={e => setAutoTrigger(e.target.value)}
                        />
                    </div>

                    <div className="forms-modal-info">
                        Stages unlock sequentially by default. Each stage can have its own assignee
                        and due date. Form submissions can auto-trigger task creation in the Task Module.
                    </div>
                </div>

                <div className="forms-modal__footer">
                    <button className="forms-modal__cancel" onClick={onClose}>Cancel</button>
                    <button
                        className={`forms-modal__create${!name.trim() ? ' forms-modal__create--disabled' : ''}`}
                        onClick={handle}
                        disabled={!name.trim()}
                    >
                        + Create form
                    </button>
                </div>
            </div>
        </div>
    );
}
