import React, { useState } from 'react';

export default function FillFormDrawer({ pipeline, stage, onClose, onSubmit }) {
    const [values, setValues] = useState({});
    const [submitted, setSubmitted] = useState(false);

    if (!pipeline || !stage) return null;

    const set = (id, v) => setValues(prev => ({ ...prev, [id]: v }));

    const handleSubmit = () => {
        setSubmitted(true);
        setTimeout(() => {
            onSubmit && onSubmit(pipeline.id, stage.id);
            onClose();
        }, 800);
    };

    const allRequired = (stage.fields || [])
        .filter(f => f.required)
        .every(f => values[f.id] && values[f.id] !== '');

    return (
        <div className="forms-drawer-overlay" onClick={onClose}>
            <div className="forms-drawer" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="forms-drawer__header">
                    <div>
                        <div className="forms-drawer__breadcrumb">{pipeline.name}</div>
                        <div className="forms-drawer__title">{stage.label}</div>
                        <div className="forms-drawer__direction">{stage.direction}</div>
                    </div>
                    <button className="forms-drawer__close" onClick={onClose}>×</button>
                </div>

                {/* Body */}
                <div className="forms-drawer__body">
                    {submitted ? (
                        <div className="forms-drawer-success">
                            <div className="forms-drawer-success__icon">✓</div>
                            <div className="forms-drawer-success__title">Submitted successfully</div>
                            <div className="forms-drawer-success__sub">Stage marked as complete. Next stage will unlock shortly.</div>
                        </div>
                    ) : (
                        <>
                            {(stage.fields || []).length === 0 ? (
                                <div className="forms-drawer-empty">No fields configured for this stage.</div>
                            ) : (
                                (stage.fields || []).map(field => (
                                    <div key={field.id} className="forms-drawer-field">
                                        <label className="forms-drawer-field__label">
                                            {field.label}
                                            {field.required && <span className="forms-drawer-field__req"> *</span>}
                                        </label>

                                        {field.type === 'textarea' && (
                                            <textarea
                                                className="forms-drawer-field__input"
                                                rows={3}
                                                placeholder={`Enter ${field.label.toLowerCase()}...`}
                                                value={values[field.id] || ''}
                                                onChange={e => set(field.id, e.target.value)}
                                            />
                                        )}
                                        {field.type === 'text' && (
                                            <input
                                                type="text"
                                                className="forms-drawer-field__input"
                                                placeholder={`Enter ${field.label.toLowerCase()}...`}
                                                value={values[field.id] || ''}
                                                onChange={e => set(field.id, e.target.value)}
                                            />
                                        )}
                                        {field.type === 'number' && (
                                            <input
                                                type="number"
                                                className="forms-drawer-field__input"
                                                placeholder="0"
                                                value={values[field.id] || ''}
                                                onChange={e => set(field.id, e.target.value)}
                                            />
                                        )}
                                        {field.type === 'file' && (
                                            <div className="forms-drawer-field__file">
                                                <input type="file" id={field.id}
                                                    onChange={e => set(field.id, e.target.files[0]?.name)} />
                                                <label htmlFor={field.id} className="forms-drawer-field__file-btn">
                                                    ↑ Upload file
                                                </label>
                                                {values[field.id] && (
                                                    <span className="forms-drawer-field__file-name">📎 {values[field.id]}</span>
                                                )}
                                            </div>
                                        )}
                                        {field.type === 'checkbox' && (
                                            <label className="forms-drawer-field__check">
                                                <input
                                                    type="checkbox"
                                                    checked={!!values[field.id]}
                                                    onChange={e => set(field.id, e.target.checked)}
                                                />
                                                <span>{field.label}</span>
                                            </label>
                                        )}
                                    </div>
                                ))
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                {!submitted && (
                    <div className="forms-drawer__footer">
                        <button className="forms-drawer__cancel" onClick={onClose}>Cancel</button>
                        <button
                            className="forms-drawer__submit"
                            onClick={handleSubmit}
                        >
                            Submit Stage →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
