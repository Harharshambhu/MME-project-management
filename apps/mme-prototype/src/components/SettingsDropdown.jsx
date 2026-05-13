import React, { useState, useEffect, useRef } from 'react';

const TABS = ['Appearance', 'Notifications', 'Account', 'About'];

const FONT_SIZES = ['Default', 'Compact', 'Large'];
const LANGUAGES  = ['English', 'Hindi', 'French', 'German', 'Spanish'];

export default function SettingsDropdown({ isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState('Appearance');
    const [notifToggles, setNotifToggles] = useState({
        mentions:  true,
        replies:   true,
        tasksDue:  true,
        eventLive: false,
    });
    const [fontSize,  setFontSize]  = useState('Default');
    const [language,  setLanguage]  = useState('English');
    const ref = useRef(null);

    useEffect(() => {
        if (!isOpen) return;
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isOpen, onClose]);

    const toggleNotif = (key) =>
        setNotifToggles(prev => ({ ...prev, [key]: !prev[key] }));

    return (
        <div className={`settings-dropdown${isOpen ? ' settings-dropdown--open' : ''}`} ref={ref}>
            {/* Tab bar */}
            <div className="settings-dropdown__tabs">
                {TABS.map(tab => (
                    <button
                        key={tab}
                        className={`settings-dropdown__tab ${activeTab === tab ? 'settings-dropdown__tab--active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Body */}
            <div className="settings-dropdown__body">

                {activeTab === 'Appearance' && (
                    <>
                        <div className="settings-dropdown__row">
                            <div>
                                <div className="settings-dropdown__row-label">Font Size</div>
                                <div className="settings-dropdown__row-sub">Message text density</div>
                            </div>
                            <select
                                className="settings-dropdown__select"
                                value={fontSize}
                                onChange={e => setFontSize(e.target.value)}
                            >
                                {FONT_SIZES.map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="settings-dropdown__row">
                            <div>
                                <div className="settings-dropdown__row-label">Language</div>
                                <div className="settings-dropdown__row-sub">Display language</div>
                            </div>
                            <select
                                className="settings-dropdown__select"
                                value={language}
                                onChange={e => setLanguage(e.target.value)}
                            >
                                {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                            </select>
                        </div>
                    </>
                )}

                {activeTab === 'Notifications' && (
                    <>
                        {[
                            { key: 'mentions',  label: 'Mentions',       sub: 'When someone @mentions you' },
                            { key: 'replies',   label: 'Thread Replies',  sub: 'Replies to your messages' },
                            { key: 'tasksDue',  label: 'Tasks Due',       sub: 'Reminders for overdue tasks' },
                            { key: 'eventLive', label: 'Event Goes Live', sub: 'Stage change to Live' },
                        ].map(({ key, label, sub }) => (
                            <div key={key} className="settings-dropdown__row">
                                <div>
                                    <div className="settings-dropdown__row-label">{label}</div>
                                    <div className="settings-dropdown__row-sub">{sub}</div>
                                </div>
                                <button
                                    className={`settings-dropdown__toggle ${notifToggles[key] ? 'settings-dropdown__toggle--on' : 'settings-dropdown__toggle--off'}`}
                                    onClick={() => toggleNotif(key)}
                                />
                            </div>
                        ))}
                    </>
                )}

                {activeTab === 'Account' && (
                    <>
                        {[
                            { label: 'Name',         val: 'Jane Doe' },
                            { label: 'Role',         val: 'Ops Coordinator' },
                            { label: 'Email',        val: 'jane@mmeagency.com' },
                            { label: 'Workspace',    val: 'Luminary Events' },
                            { label: 'Member since', val: 'Jan 2025' },
                        ].map(({ label, val }) => (
                            <div key={label} className="settings-dropdown__row">
                                <div className="settings-dropdown__row-label">{label}</div>
                                <div style={{ fontSize: 'var(--fs-xs)', color: 'hsl(var(--muted-foreground))' }}>{val}</div>
                            </div>
                        ))}
                    </>
                )}

                {activeTab === 'About' && (
                    <>
                        {[
                            { label: 'App',       val: 'EventEase' },
                            { label: 'Version',   val: '1.0.0-prototype' },
                            { label: 'Build',     val: 'Apr 2026' },
                            { label: 'Platform',  val: 'Web' },
                            { label: 'Design',    val: 'Luminary Events' },
                        ].map(({ label, val }) => (
                            <div key={label} className="settings-dropdown__row">
                                <div className="settings-dropdown__row-label">{label}</div>
                                <div style={{ fontSize: 'var(--fs-xs)', color: 'hsl(var(--muted-foreground))' }}>{val}</div>
                            </div>
                        ))}
                    </>
                )}

            </div>
        </div>
    );
}
