import React, { useEffect, useRef } from 'react';
import { sampleNotifications } from '../data';
import { stageColors } from '../data';

const iconMap = {
    chat:      '◯',
    stage:     '▤',
    broadcast: '◁',
    overdue:   '◷',
    member:    '⊕',
    event:     '▦',
    pin:       '⊞',
};

export default function NotificationsDropdown({ isOpen, onClose }) {
    const ref = useRef(null);

    useEffect(() => {
        if (!isOpen) return;
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) onClose();
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isOpen, onClose]);

    const unreadCount = sampleNotifications.filter((n) => n.unread).length;

    return (
        <div className={`notif-dropdown${isOpen ? ' notif-dropdown--open' : ''}`} ref={ref}>
            <div className="notif-dropdown__header">
                <span className="notif-dropdown__title">Notifications</span>
                {unreadCount > 0 && (
                    <span className="notif-dropdown__badge">{unreadCount} new</span>
                )}
                <button className="notif-dropdown__mark-all" onClick={onClose}>
                    Mark all read
                </button>
            </div>
            <div className="notif-dropdown__list">
                {sampleNotifications.map((n) => (
                    <div
                        key={n.id}
                        className={`notif-item ${n.unread ? 'notif-item--unread' : ''}`}
                        onClick={onClose}
                    >
                        <div className="notif-item__icon-wrap">
                            <span
                                className="notif-item__stage-dot"
                                style={{ background: n.stage ? stageColors[n.stage]?.color : '#94a3b8' }}
                            />
                            {n.unread && <span className="notif-item__dot" />}
                        </div>
                        <div className="notif-item__body">
                            <div className="notif-item__text">{n.text}</div>
                            <div className="notif-item__meta">
                                {n.channel && (
                                    <span className="notif-item__channel">#{n.channel}</span>
                                )}
                                <span className="notif-item__time">{n.time}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
