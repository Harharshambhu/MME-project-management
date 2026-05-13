import React, { useState, useRef, useEffect } from 'react';
import { channelMessages, defaultChannelMessages } from '../data/messages';
import { channelMeta } from '../data/channels';
import MessageContextMenu from './MessageContextMenu';
import ChannelWindow from './ChannelWindow';
import InviteModal from './InviteModal';
import ProfileSidebar from './ProfileSidebar';

export default function ChannelChatPage({ channelName, onBack }) {
    const [contextMenu, setContextMenu] = useState({ open: false, x: 0, y: 0, messageId: null });
    const [localMessages, setLocalMessages] = useState(() => channelMessages[channelName] || defaultChannelMessages);
    const [inputValue, setInputValue] = useState('');
    const [latestMsgId, setLatestMsgId] = useState(null);
    const bottomRef = useRef(null);

    // New modal/panel state
    const [channelWindowOpen, setChannelWindowOpen] = useState(false);
    const [inviteOpen, setInviteOpen] = useState(false);
    const [huddleMenuOpen, setHuddleMenuOpen] = useState(false);
    const [notifMenuOpen, setNotifMenuOpen] = useState(false);
    const [channelMenuOpen, setChannelMenuOpen] = useState(false);
    const [profileUser, setProfileUser] = useState(null);

    const meta = channelMeta[channelName] || null;

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [localMessages]);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleMouseDown = (e) => {
            if (!e.target.closest('.ch-icon-group')) {
                setHuddleMenuOpen(false);
                setNotifMenuOpen(false);
                setChannelMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleMouseDown);
        return () => document.removeEventListener('mousedown', handleMouseDown);
    }, []);

    const sendMessage = () => {
        const text = inputValue.trim();
        if (!text) return;
        const id = `sent-${Date.now()}`;
        setLocalMessages(prev => [...prev, {
            id,
            initials: 'JD',
            name: 'Jane Doe',
            isCurrentUser: true,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text,
            replies: 0,
        }]);
        setLatestMsgId(id);
        setInputValue('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleMoreClick = (e, messageId) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        setContextMenu({ open: true, x: rect.left - 140, y: rect.bottom + 4, messageId });
    };

    const closeContextMenu = () => setContextMenu({ open: false, x: 0, y: 0, messageId: null });

    const openProfile = (msg) => {
        setProfileUser({ name: msg.name, initials: msg.initials, isCurrentUser: msg.isCurrentUser, role: 'Team Member' });
    };

    return (
        <div className="channel-layout">
            {/* Chat Column */}
            <div className="channel-layout__chat">
                {/* Header */}
                <div className="chat-header">
                    {/* Left */}
                    <div className="chat-header__left">
                        <button className="chat-header__channel-btn" onClick={() => setChannelWindowOpen(true)}>
                            <span className="chat-header__prefix">#</span>
                            <span className="chat-header__name">{channelName}</span>
                        </button>
                        {meta && <span className="chat-header__group">{meta.groupName}</span>}
                    </div>

                    {/* Right actions */}
                    <div className="chat-header__actions">
                        {/* Invite */}
                        <button className="ch-invite-btn" onClick={() => setInviteOpen(true)}>
                            ⊕ Invite teammates
                        </button>

                        {/* Huddle group */}
                        <div className="ch-icon-group" style={{ position: 'relative' }}>
                            <button className="ch-icon-btn ch-icon-btn--huddle">◎</button>
                            <button className="ch-icon-btn ch-icon-btn--caret" onClick={() => setHuddleMenuOpen(v => !v)}>▾</button>
                            {huddleMenuOpen && (
                                <div className="ch-dropdown">
                                    <div className="ch-dropdown__item" onClick={() => setHuddleMenuOpen(false)}>◎ Start huddle</div>
                                    <div className="ch-dropdown__item" onClick={() => setHuddleMenuOpen(false)}>⊞ Copy huddle link</div>
                                </div>
                            )}
                        </div>

                        {/* Notifications */}
                        <div className="ch-icon-group" style={{ position: 'relative' }}>
                            <button
                                className={`ch-icon-btn${notifMenuOpen ? ' ch-icon-btn--active' : ''}`}
                                onClick={() => setNotifMenuOpen(v => !v)}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                                </svg>
                            </button>
                            {notifMenuOpen && (
                                <div className="ch-dropdown ch-dropdown--wide">
                                    <div className="ch-dropdown__label">Notify you about...</div>
                                    <div className="ch-dropdown__item ch-dropdown__item--checked" onClick={() => setNotifMenuOpen(false)}>
                                        <span className="ch-dropdown__check">✓</span>
                                        <div>
                                            <div>All new posts</div>
                                            <div className="ch-dropdown__sub">Messages and threads that you follow</div>
                                        </div>
                                    </div>
                                    <div className="ch-dropdown__item" onClick={() => setNotifMenuOpen(false)}>
                                        <span className="ch-dropdown__check" />
                                        <div>
                                            <div>Just mentions</div>
                                            <div className="ch-dropdown__sub">@you, @channel, @here</div>
                                        </div>
                                    </div>
                                    <div className="ch-dropdown__item" onClick={() => setNotifMenuOpen(false)}>
                                        <span className="ch-dropdown__check" />
                                        <div>
                                            <div>Mute and hide</div>
                                            <div className="ch-dropdown__sub">Only badge the channel when someone @mentions you</div>
                                        </div>
                                    </div>
                                    <div className="ch-dropdown__divider" />
                                    <div className="ch-dropdown__item" onClick={() => setNotifMenuOpen(false)}>Advanced options</div>
                                    <div className="ch-dropdown__item" onClick={() => setNotifMenuOpen(false)}>Edit default preferences</div>
                                </div>
                            )}
                        </div>

                        {/* Search */}
                        <button className="ch-icon-btn" title="Search in channel (Ctrl+F)">⌕</button>

                        {/* 3-dot menu */}
                        <div className="ch-icon-group" style={{ position: 'relative' }}>
                            <button
                                className={`ch-icon-btn${channelMenuOpen ? ' ch-icon-btn--active' : ''}`}
                                onClick={() => setChannelMenuOpen(v => !v)}
                            >
                                ⋯
                            </button>
                            {channelMenuOpen && (
                                <div className="ch-dropdown ch-dropdown--menu">
                                    <div className="ch-dropdown__item" onClick={() => { setChannelWindowOpen(true); setChannelMenuOpen(false); }}>Open channel details</div>
                                    <div className="ch-dropdown__item" onClick={() => setChannelMenuOpen(false)}>Summarise channel</div>
                                    <div className="ch-dropdown__divider" />
                                    <div className="ch-dropdown__item" onClick={() => setChannelMenuOpen(false)}>Edit notifications →</div>
                                    <div className="ch-dropdown__item" onClick={() => setChannelMenuOpen(false)}>☆ Star channel</div>
                                    <div className="ch-dropdown__divider" />
                                    <div className="ch-dropdown__item" onClick={() => setChannelMenuOpen(false)}>Add template to channel</div>
                                    <div className="ch-dropdown__item" onClick={() => setChannelMenuOpen(false)}>Add a workflow</div>
                                    <div className="ch-dropdown__item" onClick={() => setChannelMenuOpen(false)}>Edit settings</div>
                                    <div className="ch-dropdown__divider" />
                                    <div className="ch-dropdown__item" onClick={() => setChannelMenuOpen(false)}>Copy →</div>
                                    <div className="ch-dropdown__item" onClick={() => setChannelMenuOpen(false)}>Search in channel</div>
                                    <div className="ch-dropdown__divider" />
                                    <div className="ch-dropdown__item ch-dropdown__item--danger" onClick={() => setChannelMenuOpen(false)}>Leave channel</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="chat-messages" onClick={closeContextMenu}>
                    <div className="chat-messages__spacer" />
                    {localMessages.map((msg) => {
                        /* ── Date separator ── */
                        if (msg.type === 'date-separator') {
                            return (
                                <div key={msg.id} className="chat-date-separator">
                                    <span className="chat-date-separator__line" />
                                    {msg.text}
                                    <span className="chat-date-separator__line" />
                                </div>
                            );
                        }
                        /* ── System notice ── */
                        if (msg.type === 'system') {
                            return (
                                <div key={msg.id} className="chat-system">
                                    ——— {msg.text} ———
                                </div>
                            );
                        }

                        const isNew = msg.id === latestMsgId;

                        /* ── Bubble content (text / file / poll) ── */
                        const renderBubbleContent = () => {
                            if (msg.type === 'file') {
                                const extIcons = { pdf: '📄', xlsx: '📊', docx: '📝', pptx: '📋', zip: '🗜' };
                                const icon = extIcons[msg.file.ext] || '📎';
                                return (
                                    <div className="chat-file-card">
                                        <div className="chat-file-card__icon">{icon}</div>
                                        <div style={{ overflow: 'hidden' }}>
                                            <div className="chat-file-card__name">{msg.file.name}</div>
                                            <div className="chat-file-card__meta">{msg.file.ext.toUpperCase()} · {msg.file.size}</div>
                                        </div>
                                    </div>
                                );
                            }
                            if (msg.type === 'poll') {
                                const { poll } = msg;
                                const total     = poll.totalVotes || poll.options.reduce((s, o) => s + o.votes, 0);
                                const maxVotes  = Math.max(...poll.options.map(o => o.votes), 1);
                                const leadIdx   = poll.options.reduce((best, o, i, arr) => o.votes > arr[best].votes ? i : best, 0);
                                return (
                                    <div className="chat-poll-card">
                                        <div className="chat-poll-card__header">
                                            <span className="chat-poll-card__icon">◆</span>
                                            <div>
                                                <div className="chat-poll-card__question">{poll.question}</div>
                                                <div className="chat-poll-card__meta">
                                                    {poll.multiSelect ? 'Select one or more' : 'Select one'} · {total} votes
                                                </div>
                                            </div>
                                        </div>
                                        <div className="chat-poll-card__options">
                                            {poll.options.map((opt, i) => {
                                                const pct     = total > 0 ? Math.round((opt.votes / total) * 100) : 0;
                                                const fillPct = Math.round((opt.votes / maxVotes) * 100);
                                                const isLead  = i === leadIdx && opt.votes > 0;
                                                return (
                                                    <div
                                                        key={i}
                                                        className={`chat-poll-card__option${opt.voted ? ' chat-poll-card__option--voted' : ''}${isLead ? ' chat-poll-card__option--lead' : ''}`}
                                                    >
                                                        {/* background fill bar */}
                                                        <div
                                                            className="chat-poll-card__option-fill"
                                                            style={{ width: `${fillPct}%` }}
                                                        />
                                                        {/* content row on top of fill */}
                                                        <div className="chat-poll-card__option-content">
                                                            <span className={`chat-poll-card__check${opt.voted ? ' chat-poll-card__check--voted' : ''}`}>
                                                                {opt.voted ? '✓' : ''}
                                                            </span>
                                                            <span className="chat-poll-card__option-text">{opt.label}</span>
                                                            {isLead && <span className="chat-poll-card__lead-dot" title="Leading" />}
                                                        </div>
                                                        <div className="chat-poll-card__option-stats">
                                                            <span className="chat-poll-card__pct">{pct}%</span>
                                                            <span className="chat-poll-card__votes">{opt.votes}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="chat-poll-card__footer">
                                            <span className="chat-poll-card__total">{total} votes total</span>
                                            <button className="chat-poll-card__view-btn">View votes →</button>
                                        </div>
                                    </div>
                                );
                            }
                            /* default: plain text */
                            return <p className="chat-message__text">{msg.text}</p>;
                        };

                        const isCard = msg.type === 'file' || msg.type === 'poll';

                        return (
                            <div
                                key={msg.id}
                                className={`chat-message ${msg.isCurrentUser ? 'chat-message--sent' : ''} ${isNew ? 'chat-message--new' : ''}`}
                            >
                                {!msg.isCurrentUser && (
                                    <div
                                        className="chat-message__avatar chat-message__avatar--clickable"
                                        onClick={() => openProfile(msg)}
                                    >
                                        {msg.initials}
                                    </div>
                                )}
                                <div className={`chat-message__body ${msg.isCurrentUser ? 'chat-message__body--sent' : ''}`}>
                                    {!msg.isCurrentUser && (
                                        <div className="chat-message__header">
                                            <span
                                                className="chat-message__name chat-message__name--clickable"
                                                onClick={() => openProfile(msg)}
                                            >
                                                {msg.name}
                                            </span>
                                            <span className="chat-message__time">{msg.time}</span>
                                        </div>
                                    )}
                                    <div className="chat-message__bubble-wrap">
                                        {isCard ? (
                                            renderBubbleContent()
                                        ) : (
                                            <div className={`chat-message__bubble ${msg.isCurrentUser ? 'chat-message__bubble--sent' : ''}`}>
                                                {renderBubbleContent()}
                                            </div>
                                        )}
                                        {/* Hover action bar */}
                                        <div className={`chat-message__actions ${msg.isCurrentUser ? 'chat-message__actions--sent' : ''}`}>
                                            <span className="chat-message__action-emoji" title="React">👍</span>
                                            <span className="chat-message__action-emoji" title="React">❤️</span>
                                            <span className="chat-message__action-emoji" title="React">😊</span>
                                            <button
                                                className="chat-message__action-more"
                                                onClick={(e) => handleMoreClick(e, msg.id)}
                                                title="More options"
                                            >
                                                ⌄
                                            </button>
                                        </div>
                                    </div>
                                    {msg.isCurrentUser && (
                                        <div className="chat-message__time chat-message__time--sent">{msg.time}</div>
                                    )}
                                    {msg.replies > 0 && (
                                        <span className="chat-message__reply-link">
                                            ↩ {msg.replies} {msg.replies === 1 ? 'reply' : 'replies'}
                                        </span>
                                    )}
                                </div>
                                {msg.isCurrentUser && (
                                    <div
                                        className="chat-message__avatar chat-message__avatar--sent chat-message__avatar--clickable"
                                        onClick={() => openProfile(msg)}
                                    >
                                        JD
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="chat-input">
                    <input
                        className="chat-input__field"
                        type="text"
                        placeholder={`Message #${channelName}`}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <div className="chat-input__tools">
                        <span className="chat-input__icon">⊘</span>
                        <span className="chat-input__icon">○</span>
                        <span className="chat-input__icon">@</span>
                        <span className="chat-input__send" onClick={sendMessage} style={{ cursor: 'pointer' }}>▷</span>
                    </div>
                </div>
            </div>

            {/* Profile Sidebar — flex sibling */}
            <ProfileSidebar
                user={profileUser}
                isOpen={!!profileUser}
                onClose={() => setProfileUser(null)}
            />

            {/* Modals */}
            <ChannelWindow
                channelId={channelName}
                isOpen={channelWindowOpen}
                onClose={() => setChannelWindowOpen(false)}
            />
            <InviteModal
                channelId={channelName}
                isOpen={inviteOpen}
                onClose={() => setInviteOpen(false)}
            />

            {/* Context Menu */}
            <MessageContextMenu
                isOpen={contextMenu.open}
                x={contextMenu.x}
                y={contextMenu.y}
                onClose={closeContextMenu}
            />
        </div>
    );
}
