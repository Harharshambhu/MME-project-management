import React from 'react';
import { Card, SectionHeader, ActivityRow, ChannelRow, EventLifecycleBoard } from '@mme/ui-components';
import {
    stageColors,
    lifecycleEvents,
    activityFeed,
    companyChannels,
    eventChannels,
    overviewDMs,
} from '../data';

function ActivityIcon() {
    return <span className="activity-item__icon">•</span>;
}

export default function OverviewPage() {
    return (
        <div className="main-content">
            {/* Header */}
            <div className="overview__header">
                <div className="overview__avatar">L</div>
                <div>
                    <div className="overview__title">Luminary Events</div>
                    <div className="overview__subtitle">Employee Workspace</div>
                </div>
            </div>

            {/* Event Channel Lifecycle */}
            <Card headerTitle="EVENT CHANNEL LIFECYCLE">
                <EventLifecycleBoard stageColors={stageColors} lifecycleEvents={lifecycleEvents} />
            </Card>

            {/* Activity Feed */}
            <Card headerTitle="ACTIVITY FEED">
                {activityFeed.map((item, i) => (
                    <ActivityRow
                        key={i}
                        icon={<ActivityIcon type={item.icon} />}
                        text={item.text}
                        tier={item.tier}
                        time={item.time}
                        showArrow={true}
                    />
                ))}
            </Card>

            {/* Company Channels */}
            <Card>
                <SectionHeader 
                    icon="⌂"
                    prefix="COMPANY"
                    title="Company Channels"
                    description="Permanent, role-independent channels. The organisational backbone of the agency."
                    stats={
                        <>
                            <span># 12 channels</span>
                            <span>⊕ All</span>
                        </>
                    }
                />
                {companyChannels.map((ch) => (
                    <ChannelRow
                        key={ch.name}
                        prefixIcon="#"
                        name={ch.name}
                        locked={ch.locked}
                        tagText={ch.type}
                        showArrow={true}
                    />
                ))}
            </Card>

            {/* Event Channels */}
            <Card>
                <SectionHeader 
                    icon="▦"
                    prefix="EVENT"
                    title="Event Channels"
                    description="Temporary, event-specific channel clusters. Created per event, archived on completion. Never deleted."
                    stats={
                        <>
                            <span># 15 channels</span>
                            <span>⊕ Assigned</span>
                        </>
                    }
                />
                {eventChannels.map((ch) => (
                    <ChannelRow
                        key={ch.name}
                        prefixIcon={ch.isAlert ? '△' : '#'}
                        name={ch.name}
                        tagText={`${ch.tag} · ${ch.stage}`}
                        showArrow={true}
                    >
                        {ch.archived && <span className="channel-row__archived"> ☐</span>}
                    </ChannelRow>
                ))}
            </Card>

            {/* Direct Messages */}
            <Card>
                <SectionHeader 
                    icon="◯"
                    prefix="DMs"
                    title="Direct Messages"
                    description="Individual, self-managed. Invisible to everyone else, cannot be administered by workspace admin."
                    stats={
                        <>
                            <span># ∞ channels</span>
                            <span>⊕ Private</span>
                        </>
                    }
                />
                {overviewDMs.map((dm) => (
                    <ChannelRow
                        key={dm.name}
                        prefixIcon={dm.icon === 'bookmark' ? '☐' : '⊕'}
                        name={dm.name}
                        tagText={dm.type}
                        showArrow={true}
                    />
                ))}
            </Card>



            <div className="footer-label">
                LOW FIDELITY WIREFRAME — MmE EMPLOYEE WORKSPACE — OVERVIEW
            </div>
        </div>
    );
}

