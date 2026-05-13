import React, { useState, useEffect, useRef } from 'react';

const SAMPLE_BROADCASTS = [
    {
        id: 'bc-1',
        subject: 'Load-in time moved to 6:00 AM on Apr 13',
        body: 'All vendors — please note that the load-in start time has been rescheduled from 8:00 AM to 6:00 AM on April 13. Adjust your arrival plans accordingly. Confirm receipt below.',
        audience: 'All Vendors · Infosys Summit 2025',
        sentAt: '2h ago',
        sentBy: 'Jane Doe',
        requiresAck: true,
        acked: [
            { initials: 'RS', name: 'Rahul Sharma', time: '1h ago' },
            { initials: 'VP', name: 'Vikram Patel', time: '45m ago' },
        ],
        pending: [
            { initials: 'AV', name: 'AV Rentals Co.' },
            { initials: 'FS', name: 'FlexiStage Ltd.' },
        ],
    },
    {
        id: 'bc-2',
        subject: 'Badge collection point changed to Gate C',
        body: 'For all on-site staff — badge collection has moved from Gate A to Gate C. Please update your briefing notes.',
        audience: 'Internal Team · Infosys Summit 2025',
        sentAt: '1d ago',
        sentBy: 'Sofia Davis',
        requiresAck: true,
        acked: [
            { initials: 'JL', name: 'Jackson Lee', time: '1d ago' },
            { initials: 'PS', name: 'Priya Sharma', time: '23h ago' },
            { initials: 'RM', name: 'Rahul Menon', time: '22h ago' },
        ],
        pending: [],
    },
    {
        id: 'bc-3',
        subject: 'Catering headcount confirmed — 200 pax',
        body: 'Catering brief is locked. Final count is 200 pax (80 veg, 120 non-veg, 12 special dietary). No further changes accepted.',
        audience: 'Tastebud Events · Infosys Summit 2025',
        sentAt: '3d ago',
        sentBy: 'Jane Doe',
        requiresAck: false,
        acked: [],
        pending: [],
    },
];

const AUDIENCES = [
    'All Vendors · Infosys Summit 2025',
    'Internal Team · Infosys Summit 2025',
    'All Vendors · Annual Gala 2026',
    'Internal Team · Annual Gala 2026',
    'Clients · Infosys Summit 2025',
];

export default function BroadcastPanel({ isOpen, onClose }) {
    const [tab, setTab] = useState('sent');
    const [expanded, setExpanded] = useState(null);
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [audience, setAudience] = useState(AUDIENCES[0]);
    const [requireAck, setRequireAck] = useState(true);
    const [broadcasts, setBroadcasts] = useState(SAMPLE_BROADCASTS);
    const [sent, setSent] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        if (!isOpen) return;
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) onClose();
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isOpen, onClose]);

    const handleSend = () => {
        if (!subject.trim() || !body.trim()) return;
        const newBc = {
            id: `bc-new-${Date.now()}`,
            subject: subject.trim(),
            body: body.trim(),
            audience,
            sentAt: 'just now',
            sentBy: 'Jane Doe',
            requiresAck: requireAck,
            acked: [],
            pending: requireAck ? [{ initials: '?', name: 'Recipients' }] : [],
        };
        setBroadcasts(prev => [newBc, ...prev]);
        setSubject('');
        setBody('');
        setRequireAck(true);
        setSent(true);
        setTab('sent');
        setTimeout(() => setSent(false), 3000);
    };

    const pendingCount = broadcasts.reduce((s, b) => s + b.pending.length, 0);

    return (
        <div className={`broadcast-panel${isOpen ? ' broadcast-panel--open' : ''}`} ref={ref}>
            {/* Header */}
            <div className="broadcast-panel__header">
                <div className="broadcast-panel__title-row">
                    <span className="broadcast-panel__icon">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                            <path d="M18 11v2H6l-3.5 3.5L1 15V9l1.5-1.5L6 11h12zM20 3v18l-4-4H6v-2h10.17L20 18.83V5.17L16.17 9H6V7h10l4-4z"/>
                        </svg>
                    </span>
                    <span className="broadcast-panel__title">Broadcast</span>
                    {pendingCount > 0 && (
                        <span className="broadcast-panel__pending-badge">{pendingCount} pending ack</span>
                    )}
                </div>
                <div className="broadcast-panel__tabs">
                    <button
                        className={`broadcast-panel__tab ${tab === 'sent' ? 'broadcast-panel__tab--active' : ''}`}
                        onClick={() => setTab('sent')}
                    >
                        Sent
                    </button>
                    <button
                        className={`broadcast-panel__tab ${tab === 'compose' ? 'broadcast-panel__tab--active' : ''}`}
                        onClick={() => { setTab('compose'); setSent(false); }}
                    >
                        + New Broadcast
                    </button>
                </div>
            </div>

            {/* Body */}
            <div className="broadcast-panel__body">

                {/* ── SENT TAB ── */}
                {tab === 'sent' && (
                    <div className="broadcast-panel__list">
                        {sent && (
                            <div className="broadcast-panel__success">
                                ✓ Broadcast sent successfully
                            </div>
                        )}
                        {broadcasts.map((bc) => {
                            const total = bc.acked.length + bc.pending.length;
                            const isOpen = expanded === bc.id;
                            const allAcked = bc.requiresAck && bc.pending.length === 0 && bc.acked.length > 0;
                            return (
                                <div key={bc.id} className="broadcast-item">
                                    <div
                                        className="broadcast-item__header"
                                        onClick={() => setExpanded(isOpen ? null : bc.id)}
                                    >
                                        <div className="broadcast-item__left">
                                            <span className="broadcast-item__chevron" style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}>▾</span>
                                            <div>
                                                <div className="broadcast-item__subject">{bc.subject}</div>
                                                <div className="broadcast-item__meta">
                                                    {bc.audience} · {bc.sentAt}
                                                </div>
                                            </div>
                                        </div>
                                        {bc.requiresAck && (
                                            <div className={`broadcast-item__ack-pill ${allAcked ? 'broadcast-item__ack-pill--done' : bc.pending.length > 0 ? 'broadcast-item__ack-pill--warn' : ''}`}>
                                                {allAcked
                                                    ? '✓ All acked'
                                                    : `${bc.acked.length}/${total} acked`}
                                            </div>
                                        )}
                                    </div>

                                    <div className={`broadcast-item__detail${isOpen ? ' broadcast-item__detail--open' : ''}`}>
                                        <p className="broadcast-item__body">{bc.body}</p>
                                        {bc.requiresAck && (
                                            <div className="broadcast-item__ack-log">
                                                {bc.acked.length > 0 && (
                                                    <div className="broadcast-item__ack-section">
                                                        <div className="broadcast-item__ack-label broadcast-item__ack-label--done">✓ Acknowledged ({bc.acked.length})</div>
                                                        {bc.acked.map((a) => (
                                                            <div key={a.name} className="broadcast-item__ack-row">
                                                                <span className="broadcast-item__ack-avatar">{a.initials}</span>
                                                                <span className="broadcast-item__ack-name">{a.name}</span>
                                                                <span className="broadcast-item__ack-time">{a.time}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {bc.pending.length > 0 && (
                                                    <div className="broadcast-item__ack-section">
                                                        <div className="broadcast-item__ack-label broadcast-item__ack-label--warn">◷ Awaiting ({bc.pending.length})</div>
                                                        {bc.pending.map((p) => (
                                                            <div key={p.name} className="broadcast-item__ack-row">
                                                                <span className="broadcast-item__ack-avatar broadcast-item__ack-avatar--pending">{p.initials}</span>
                                                                <span className="broadcast-item__ack-name">{p.name}</span>
                                                                <button className="broadcast-item__nudge">Nudge</button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ── COMPOSE TAB ── */}
                {tab === 'compose' && (
                    <div className="broadcast-compose">
                        <div className="broadcast-compose__field">
                            <label className="broadcast-compose__label">Audience</label>
                            <select
                                className="broadcast-compose__select"
                                value={audience}
                                onChange={(e) => setAudience(e.target.value)}
                            >
                                {AUDIENCES.map((a) => <option key={a}>{a}</option>)}
                            </select>
                        </div>
                        <div className="broadcast-compose__field">
                            <label className="broadcast-compose__label">Subject</label>
                            <input
                                className="broadcast-compose__input"
                                type="text"
                                placeholder="Brief summary of this broadcast..."
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            />
                        </div>
                        <div className="broadcast-compose__field">
                            <label className="broadcast-compose__label">Message</label>
                            <textarea
                                className="broadcast-compose__textarea"
                                placeholder="Write your broadcast message. Recipients cannot reply — they can only acknowledge."
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                rows={5}
                            />
                        </div>
                        <div className="broadcast-compose__ack-row">
                            <div>
                                <div className="broadcast-compose__ack-label">Require acknowledgement</div>
                                <div className="broadcast-compose__ack-sub">Recipients must confirm they've read this</div>
                            </div>
                            <button
                                className={`broadcast-compose__toggle ${requireAck ? 'broadcast-compose__toggle--on' : 'broadcast-compose__toggle--off'}`}
                                onClick={() => setRequireAck(v => !v)}
                            />
                        </div>
                        <div className="broadcast-compose__footer">
                            <div className="broadcast-compose__warning">
                                ⊘ Recipients cannot reply to broadcasts. Direct them to their event channel for questions.
                            </div>
                            <button
                                className="broadcast-compose__send"
                                onClick={handleSend}
                                disabled={!subject.trim() || !body.trim()}
                            >
                                Send Broadcast
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
