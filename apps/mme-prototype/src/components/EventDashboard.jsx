import React from 'react';
import { activeEvents, archivedEvents, stageColors } from '../data';
import CredentialsDashboardWidget from './widgets/CredentialsDashboardWidget';
import GuestListsDashboardWidget from './widgets/GuestListsDashboardWidget';
import CateringDashboardWidget from './widgets/CateringDashboardWidget';
import AssetsDashboardWidget from './widgets/AssetsDashboardWidget';
import FormsDashboardWidget from './widgets/FormsDashboardWidget';

const allEvents = [...activeEvents, ...archivedEvents];

export default function EventDashboard({ eventId, onBack, onNavigate }) {
    const event = allEvents.find((e) => e.id === eventId) || activeEvents[0];
    const stage = stageColors[event.stage] || stageColors.closed;

    return (
        <div className="pg-dashboard">
            {/* Header */}
            <div className="pg-dashboard__header">
                <div className="pg-dashboard__header-left">
                    <button className="evdash__back" onClick={onBack} title="Back to Events">‹</button>
                    <div
                        className="pg-dashboard__avatar"
                        style={{ background: stage.color }}
                    >
                        {event.name[0]}
                    </div>
                    <div>
                        <div className="pg-dashboard__title">{event.name}</div>
                        <div className="pg-dashboard__sub">
                            {event.stageLabel}
                            {event.countdown && <span style={{ marginLeft: 12 }}>◷ {event.countdown}</span>}
                            {event.location && <span style={{ marginLeft: 12 }}>◈ {event.location}</span>}
                            {event.client && <span style={{ marginLeft: 12 }}>◎ {event.client}</span>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="pg-dashboard__widgets">

                {/* Credentials + Guest Lists */}
                <div className="pg-widget-wrap">
                    <CredentialsDashboardWidget
                        onNavigate={() => onNavigate('credentials')}
                        sidebarExtra={
                            <GuestListsDashboardWidget
                                onSelectEvent={(eid, eName) => onNavigate('guestlist', { eventId: eid, eventName: eName })}
                            />
                        }
                    />
                </div>

                {/* Assets + Forms side by side */}
                <div className="pg-widget-row">
                    <div className="pg-widget-row__assets">
                        <AssetsDashboardWidget
                            onNavigate={(tab) => onNavigate('assets', { tab })}
                        />
                    </div>
                    <div className="pg-widget-row__forms">
                        <FormsDashboardWidget
                            onNavigate={(tab) => onNavigate('forms', { tab })}
                        />
                    </div>
                </div>

                {/* Catering */}
                <div className="pg-widget-wrap">
                    <CateringDashboardWidget
                        onNavigate={(tab) => onNavigate('catering', { tab })}
                    />
                </div>

            </div>
        </div>
    );
}
