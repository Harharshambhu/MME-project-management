import React, { useState } from 'react';
import './credentials.css';
import CredentialsDashboardWidget from './CredentialsDashboardWidget';
import Phase1Configuration from './Phase1Configuration';
import Phase2Collection from './Phase2Collection';
import Phase3Review from './Phase3Review';
import Phase4Issuance from './Phase4Issuance';

const phaseLabels = {
    config: 'Phase 1 — Configuration',
    collection: 'Phase 2 — Collection',
    review: 'Phase 3 — Review & Approval',
    issuance: 'Phase 4 — Issuance & On-Site',
};

export default function CredentialsModule({ onBack, initialView }) {
    const [activeView, setActiveView] = useState(initialView || 'config'); // 'dashboard' | 'config' | 'collection' | 'review' | 'issuance'

    const renderPhase = () => {
        switch (activeView) {
            case 'config': return <Phase1Configuration />;
            case 'collection': return <Phase2Collection />;
            case 'review': return <Phase3Review />;
            case 'issuance': return <Phase4Issuance />;
            default: return null;
        }
    };

    // Dashboard view
    if (activeView === 'dashboard') {
        return (
            <div className="cred-module">
                <div className="cred-module__header">
                    {onBack && (
                        <button className="evdash__back" onClick={onBack} title="Back to Dashboard">‹</button>
                    )}
                    <div className="cred-module__header-icon">⊡</div>
                    <div className="cred-module__header-text">
                        <h1>Credentials</h1>
                        <span>Pass & Access Management — Infosys Summit 2025</span>
                    </div>
                </div>
                <CredentialsDashboardWidget onNavigate={(phase) => setActiveView(phase)} />
            </div>
        );
    }

    // Phase detail view
    return (
        <div className="cred-module">
            <div className="cred-module__header">
                <button className="cred-module__back" onClick={onBack}>
                    ← Dashboard
                </button>
                <div className="cred-module__header-icon">⊡</div>
                <div className="cred-module__header-text">
                    <h1>Credentials</h1>
                    <span>{phaseLabels[activeView]}</span>
                </div>
            </div>

            {/* Phase Tabs */}
            <div className="cred-tabs">
                {Object.entries(phaseLabels).map(([key, label]) => (
                    <button
                        key={key}
                        className={`cred-tabs__item ${activeView === key ? 'cred-tabs__item--active' : ''}`}
                        onClick={() => setActiveView(key)}
                    >
                        {label.split(' — ')[1]}
                    </button>
                ))}
            </div>

            {renderPhase()}
        </div>
    );
}
