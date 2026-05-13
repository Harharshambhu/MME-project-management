import React, { useState, useEffect } from 'react';
import './assets.css';
import Phase1AssetSetup          from './Phase1AssetSetup';
import Phase2DistributionBillback from './Phase2DistributionBillback';
import { EVENT } from './data';

const TABS = [
    { id: 'asset-setup',   label: 'Asset Setup'           },
    { id: 'distribution',  label: 'Distribution & Billback' },
];

export default function AssetsModule({ initialTab, onBack }) {
    const [activeTab,       setActiveTab]       = useState(initialTab || 'asset-setup');
    const [requestStatuses, setRequestStatuses] = useState({});
    const [toast,           setToast]           = useState('');

    useEffect(() => {
        if (initialTab) setActiveTab(initialTab);
    }, [initialTab]);

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 2500);
    };

    const handleApprove = (id) => {
        setRequestStatuses(prev => ({ ...prev, [id]: 'approved' }));
        showToast('Request approved.');
    };

    const handleDeny = (id) => {
        setRequestStatuses(prev => ({ ...prev, [id]: 'denied' }));
        showToast('Request denied.');
    };

    const renderTab = () => {
        switch (activeTab) {
            case 'asset-setup':  return (
                <Phase1AssetSetup
                    requestStatuses={requestStatuses}
                    onApprove={handleApprove}
                    onDeny={handleDeny}
                    showToast={showToast}
                />
            );
            case 'distribution': return <Phase2DistributionBillback showToast={showToast} />;
            default:             return null;
        }
    };

    return (
        <div className="ast-module">

            {/* Topbar */}
            <div className="ast-topbar">
                {onBack && (
                    <button className="evdash__back" onClick={onBack} title="Back to Dashboard">‹</button>
                )}
                <div className="ast-topbar__title-block">
                    <span className="ast-topbar__icon">▣</span>
                    <div>
                        <div className="ast-topbar__name">Assets</div>
                        <div className="ast-topbar__sub">{EVENT.name}</div>
                    </div>
                </div>
            </div>

            {/* Tab Nav */}
            <div className="ast-nav">
                {TABS.map(t => (
                    <button
                        key={t.id}
                        className={`ast-nav__tab ${activeTab === t.id ? 'ast-nav__tab--active' : ''}`}
                        onClick={() => setActiveTab(t.id)}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            {renderTab()}

            {/* Toast */}
            {toast && <div className="ast-toast">{toast}</div>}
        </div>
    );
}
