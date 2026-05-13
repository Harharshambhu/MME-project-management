import React, { useState, useRef, useEffect } from 'react';
import { dmThreads } from '../data/dms';

export default function DMChatPage({ contact, onBack }) {
    const [messages, setMessages] = useState(dmThreads[contact.id] || []);
    const [inputValue, setInputValue] = useState('');
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        const text = inputValue.trim();
        if (!text) return;
        setMessages(prev => [...prev, {
            id: `sent-${Date.now()}`,
            initials: 'JD',
            name: 'Jane Doe',
            isCurrentUser: true,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text,
        }]);
        setInputValue('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="channel-layout">
            <div className="channel-layout__chat">
                {/* Header */}
                <div className="chat-header">
                    <div className="chat-header__left">
                        <button className="evdash__back" onClick={onBack} title="Back to DMs">‹</button>
                        <div className="dm-chat__header-avatar">{contact.initials}</div>
                        <div>
                            <div className="dm-chat__header-name">
                                {contact.name}
                                {contact.memberCount && (
                                    <span className="dm-row__member-count" style={{ marginLeft: 8 }}>{contact.memberCount}</span>
                                )}
                            </div>
                            <div className="dm-chat__header-meta">
                                {contact.role} · {contact.org}
                            </div>
                        </div>
                    </div>
                    <div className="chat-header__actions">
                        <button className="ch-icon-btn" title="Search">⌕</button>
                        <button className="ch-icon-btn" title="More">⋯</button>
                    </div>
                </div>

                {/* Messages */}
                <div className="chat-messages">
                    {/* Profile intro card at top */}
                    <div className="dm-chat__intro">
                        <div className="dm-chat__intro-avatar">{contact.initials}</div>
                        <div className="dm-chat__intro-name">{contact.name}</div>
                        <div className="dm-chat__intro-role">{contact.role} · {contact.org}</div>
                        {contact.description && (
                            <div className="dm-chat__intro-desc">{contact.description}</div>
                        )}
                        <div className="dm-chat__intro-event">Working on: {contact.event}</div>
                    </div>

                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`chat-message ${msg.isCurrentUser ? 'chat-message--sent' : ''}`}
                        >
                            {!msg.isCurrentUser && (
                                <div className="chat-message__avatar">{msg.initials}</div>
                            )}
                            <div className={`chat-message__body ${msg.isCurrentUser ? 'chat-message__body--sent' : ''}`}>
                                {!msg.isCurrentUser && (
                                    <div className="chat-message__header">
                                        <span className="chat-message__name">{msg.name}</span>
                                        <span className="chat-message__time">{msg.time}</span>
                                    </div>
                                )}
                                <div className="chat-message__bubble-wrap">
                                    <div className={`chat-message__bubble ${msg.isCurrentUser ? 'chat-message__bubble--sent' : ''}`}>
                                        <p className="chat-message__text">{msg.text}</p>
                                    </div>
                                </div>
                                {msg.isCurrentUser && (
                                    <div className="chat-message__time chat-message__time--sent">{msg.time}</div>
                                )}
                            </div>
                            {msg.isCurrentUser && (
                                <div className="chat-message__avatar chat-message__avatar--sent">JD</div>
                            )}
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="chat-input">
                    <input
                        className="chat-input__field"
                        type="text"
                        placeholder={`Message ${contact.name}...`}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <div className="chat-input__tools">
                        <span className="chat-input__icon">⊘</span>
                        <span className="chat-input__icon">○</span>
                        <span className="chat-input__send" onClick={sendMessage} style={{ cursor: 'pointer' }}>▷</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
