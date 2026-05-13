import React, { useState } from 'react';
import { dmContacts } from '../data';

const filterTabs = ['All', 'Internal', 'External', 'Clients', 'Vendors'];

export default function DMsPage({ onSelectContact }) {
    const [activeFilter, setActiveFilter] = useState('All');

    const filtered = activeFilter === 'All'
        ? dmContacts
        : dmContacts.filter((c) => c.type === activeFilter.toLowerCase());

    return (
        <div className="main-content">
            <div className="dms-page__header">
                <span style={{ fontSize: 'var(--fs-xl)' }}>◯</span>
                <span className="dms-page__title">Direct Messages</span>
                <span className="dms-page__badge">3 unread</span>
            </div>
            <div className="dms-page__subtitle">
                Your private conversations with team members, clients, and vendors.
            </div>

            {/* Search */}
            <div className="dms-page__search-wrapper">
                <span className="dms-page__search-icon">○</span>
                <input
                    className="dms-page__search"
                    type="text"
                    placeholder="Search by name, role, company, or event..."
                    readOnly
                />
            </div>

            {/* Filter Tabs */}
            <div className="filter-tabs">
                {filterTabs.map((tab) => (
                    <button
                        key={tab}
                        className={`filter-tabs__tab ${activeFilter === tab ? 'filter-tabs__tab--active' : ''}`}
                        onClick={() => setActiveFilter(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Contact List */}
            <div className="card">
                {filtered.map((contact, i) => (
                    <div key={i} className="dm-row" onClick={() => onSelectContact?.(contact)} style={{ cursor: 'pointer' }}>
                        <div className={`dm-row__avatar ${contact.isGroup ? 'dm-row__avatar--group' : ''}`}>
                            {contact.initials}
                            {contact.hasUnreadDot && <span className="dm-row__unread-dot" />}
                        </div>
                        <div className="dm-row__info">
                            <div className="dm-row__name-row">
                                <span className="dm-row__name">{contact.name}</span>
                                {contact.memberCount && (
                                    <span className="dm-row__member-count">{contact.memberCount}</span>
                                )}
                            </div>
                            <div className="dm-row__meta">
                                {contact.role === 'Client POC' || contact.role === 'AV Vendor Lead' ? (
                                    <span className="dm-row__role-badge">{contact.role}</span>
                                ) : (
                                    <span>{contact.role}</span>
                                )}
                                <span>·</span>
                                <span>{contact.org}</span>
                                <span>·</span>
                                <span>{contact.event}</span>
                            </div>
                            <div className="dm-row__message">{contact.lastMessage}</div>
                        </div>
                        <div className="dm-row__right">
                            <span className="dm-row__time">{contact.time}</span>
                            {contact.unread > 0 && (
                                <span className="dm-row__unread-badge">{contact.unread}</span>
                            )}
                        </div>
                        <span className="dm-row__arrow">›</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
