import React, { useState } from 'react';
import { channelMeta } from '../data/channels';
import OverviewTab from './RightSidebarTabs/OverviewTab';
import TasksTab from './RightSidebarTabs/TasksTab';
import FormsTab from './RightSidebarTabs/FormsTab';
import PinnedDocsTab from './RightSidebarTabs/PinnedDocsTab';
import MembersTab from './RightSidebarTabs/MembersTab';

const TABS = [
    { id: 'overview',  label: 'Overview' },
    { id: 'tasks',     label: 'Tasks' },
    { id: 'forms',     label: 'Forms' },
    { id: 'pinned',    label: 'Docs' },
    { id: 'members',   label: 'Members' },
];

export default function ChannelRightSidebar({ channelId, isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState('overview');
    const meta = channelMeta[channelId] || null;

    return (
        <div className={`right-sidebar ${isOpen ? 'right-sidebar--open' : ''}`}>
            <div className="right-sidebar__inner">
                {/* Header */}
                <div className="rsb-header">
                    <span className="rsb-header__title">#{channelId}</span>
                    <button className="rsb-header__close" onClick={onClose}>✕</button>
                </div>

                {/* Tab Bar */}
                <div className="rsb-tabs">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            className={`rsb-tab-btn ${activeTab === tab.id ? 'rsb-tab-btn--active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="rsb-content" key={activeTab}>
                    {activeTab === 'overview' && <OverviewTab meta={meta} />}
                    {activeTab === 'tasks'    && <TasksTab channelId={channelId} />}
                    {activeTab === 'forms'    && <FormsTab channelId={channelId} />}
                    {activeTab === 'pinned'   && <PinnedDocsTab channelId={channelId} />}
                    {activeTab === 'members'  && <MembersTab channelId={channelId} />}
                </div>
            </div>
        </div>
    );
}
