import React, { useState } from 'react';
import { SidebarSection, ChannelRow, EventStageBadge } from '@mme/ui-components';
import { sidebarCompany, sidebarEvents, stageColors, dmContacts } from '../data';

export default function Sidebar({ activePage, setActivePage, activeChannel, setActiveChannel, onSelectDm }) {
    const [expandedEvents, setExpandedEvents] = useState(
        Object.fromEntries(sidebarEvents.map((e, i) => [e.name, i === 0]))
    );

    const toggleEvent = (name) =>
        setExpandedEvents((prev) => ({ ...prev, [name]: !prev[name] }));

    const handleChannelClick = (channelName) => {
        setActiveChannel(channelName);
        setActivePage('channel');
    };

    return (
        <div className="sidebar">
            {/* Header */}
            <div className="sidebar__header">
                <div className="sidebar__workspace">
                    <div className="sidebar__workspace-icon">M</div>
                    <div>
                        <div className="sidebar__workspace-name">Luminary Events</div>
                        <div className="sidebar__workspace-sub">Employee Workspace</div>
                    </div>
                </div>
            </div>

            <div className="sidebar__content">
            {/* Company Section */}
            <SidebarSection title="⌂ COMPANY — Workspace" />

            <SidebarSection title="MANDATORY" badge="auto-joined" style={{ paddingTop: 0 }}>
                {sidebarCompany.mandatory.map((ch) => (
                    <ChannelRow
                        key={ch.name}
                        className="sidebar__channel"
                        elementModifier="-"
                        prefixIcon={ch.icon === 'megaphone' ? '⊏' : ch.icon === 'circle' ? '○' : '#'}
                        name={ch.name}
                        locked={ch.locked}
                        isActive={activeChannel === ch.name && activePage === 'channel'}
                        onClick={() => handleChannelClick(ch.name)}
                    />
                ))}
            </SidebarSection>

            <SidebarSection title="DEPARTMENTS" badge="role-based" style={{ paddingTop: 0 }}>
                {sidebarCompany.departments.map((ch) => (
                    <ChannelRow
                        key={ch.name}
                        className="sidebar__channel"
                        elementModifier="-"
                        prefixIcon="#"
                        name={ch.name}
                        locked={ch.locked}
                        isActive={activeChannel === ch.name && activePage === 'channel'}
                        onClick={() => handleChannelClick(ch.name)}
                    />
                ))}
            </SidebarSection>

            {/* Events Section */}
            <SidebarSection title="⌂ EVENTS — Event Channels">
                {sidebarEvents.map((event) => (
                    <div key={event.name} className="sidebar__event-group">
                        <div
                            className="sidebar__event-header"
                            onClick={() => toggleEvent(event.name)}
                        >
                            <span style={{
                                fontSize: 10,
                                color: 'hsl(var(--muted-foreground) / 0.5)',
                                marginRight: 2,
                                display: 'inline-block',
                                transition: 'transform 0.15s',
                                transform: expandedEvents[event.name] ? 'rotate(0deg)' : 'rotate(-90deg)',
                            }}>▾</span>
                            <EventStageBadge
                                className="sidebar__event"
                                color={stageColors[event.stage]?.color}
                                name={event.name}
                                stageLabel={event.stageLabel}
                            />
                            {event.notifications > 0 && (
                                <span className="sidebar__event-notif">⊡ {event.notifications}</span>
                            )}
                        </div>
                        <div className={`sidebar__event-channels${expandedEvents[event.name] ? ' sidebar__event-channels--open' : ''}`}>
                            {event.channels.map((ch) => (
                                <ChannelRow
                                    key={ch.name}
                                    className="sidebar__channel"
                                    elementModifier="-"
                                    prefixIcon={ch.isAlert ? '△' : '#'}
                                    name={ch.name}
                                    locked={ch.locked}
                                    isActive={activeChannel === ch.name && activePage === 'channel'}
                                    onClick={() => handleChannelClick(ch.name)}
                                >
                                    {ch.unread > 0 && <span className="sidebar__channel-badge">{ch.unread}</span>}
                                </ChannelRow>
                            ))}
                        </div>
                    </div>
                ))}
            </SidebarSection>

            {/* DMs Section */}
            <SidebarSection title="⊕ DMs">
                {dmContacts.slice(0, 6).map((dm) => (
                    <div key={dm.name} className="vendor-dm-item" onClick={() => onSelectDm?.(dm)} style={{ cursor: 'pointer' }}>
                        <div className="vendor-dm-avatar">{dm.initials}</div>
                        <div className="vendor-dm-info">
                            <div className="vendor-dm-name-row">
                                <span className="vendor-dm-name">{dm.name}</span>
                                <span className="vendor-dm-time">{dm.time}</span>
                            </div>
                            <span className="vendor-dm-last">{dm.lastMessage}</span>
                        </div>
                        {dm.unread > 0 && (
                            <span className="sidebar__channel-badge">{dm.unread}</span>
                        )}
                    </div>
                ))}
            </SidebarSection>
            </div>

            {/* Footer */}
            <div className="sidebar__footer">
                <div className="sidebar__user-avatar">JD</div>
                <div className="sidebar__user-info">
                    <div className="sidebar__user-name">Jane Doe</div>
                    <div className="sidebar__user-role">Ops Coordinator</div>
                </div>
                <div className="sidebar__user-icons">
                    <span>⊘</span>
                    <div className="sidebar__user-status" />
                </div>
            </div>
        </div>
    );
}
