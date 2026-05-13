import React, { useState, useEffect } from 'react';
import './catering.css';
import Phase1OccasionSetup  from './Phase1OccasionSetup';
import Phase3FinalCountLock from './Phase3FinalCountLock';
import { EVENT } from './data';

const TABS = [
    { id: 'occasion-setup', label: 'Catering Setup'   },
    { id: 'count-lock',     label: 'Final Count' },
];

export default function CateringModule({ initialTab, eventName, onBack }) {
    const [activeTab,     setActiveTab]     = useState(initialTab || 'occasion-setup');
    const [bufferPercent, setBufferPercent] = useState(10);
    const [uploadState,   setUploadState]   = useState('idle');
    const [toast,         setToast]         = useState('');

    useEffect(() => {
        if (initialTab) setActiveTab(initialTab);
    }, [initialTab]);

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 2500);
    };

    const renderTab = () => {
        switch (activeTab) {
            case 'occasion-setup': return <Phase1OccasionSetup showToast={showToast} />;
            case 'count-lock':     return <Phase3FinalCountLock bufferPercent={bufferPercent} setBufferPercent={setBufferPercent} uploadState={uploadState} setUploadState={setUploadState} showToast={showToast} />;
            default:               return null;
        }
    };

    return (
        <div className="cat-module">

            {/* Topbar */}
            <div className="cat-topbar">
                {onBack && (
                    <button className="evdash__back" onClick={onBack} title="Back to Dashboard">‹</button>
                )}
                <div className="cat-topbar__title-block">
                    <span className="cat-topbar__icon">◇</span>
                    <div>
                        <div className="cat-topbar__name">Catering</div>
                        <div className="cat-topbar__sub">{eventName || EVENT.name}</div>
                    </div>
                </div>
            </div>

            {/* Tab Nav */}
            <div className="cat-nav">
                {TABS.map(t => (
                    <button
                        key={t.id}
                        className={`cat-nav__tab ${activeTab === t.id ? 'cat-nav__tab--active' : ''}`}
                        onClick={() => setActiveTab(t.id)}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            {renderTab()}

            {/* Toast */}
            {toast && <div className="cat-toast">{toast}</div>}
        </div>
    );
}
