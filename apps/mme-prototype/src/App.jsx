import React, { useState, useEffect } from 'react';
import TopNav from './components/TopNav';
import Sidebar from './components/Sidebar';
import OverviewPage from './components/OverviewPage';
import EventsPage from './components/EventsPage';
import EventDashboard from './components/EventDashboard';
import EventCreator from './components/EventCreator';
import DMsPage from './components/DMsPage';
import DMChatPage from './components/DMChatPage';
import ChannelChatPage from './components/ChannelChatPage';
import { AppLayout } from '@mme/ui-components';
import CredentialsModule from '../../mme-playground/src/modules/credentials/CredentialsModule';
import GuestListsModule from '../../mme-playground/src/modules/guestlists/GuestListsModule';
import CateringModule from '../../mme-playground/src/modules/catering/CateringModule';
import AssetsModule from '../../mme-playground/src/modules/assets/AssetsModule';
import FormsModule from '../../mme-playground/src/modules/forms/FormsModule';

export default function App() {
  const [activePage, setActivePage] = useState('overview');
  const [activeChannel, setActiveChannel] = useState(null);
  const [activeEventId, setActiveEventId] = useState(null);
  const [activeModuleTab, setActiveModuleTab] = useState(null);
  const [activeModuleEventName, setActiveModuleEventName] = useState(null);
  const [showEventCreator, setShowEventCreator] = useState(false);
  const [activeDmContact, setActiveDmContact] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  const navigate = (page, opts = {}) => {
    if (opts.eventId !== undefined) setActiveEventId(opts.eventId);
    if (opts.eventName !== undefined) setActiveModuleEventName(opts.eventName);
    if (opts.tab !== undefined) setActiveModuleTab(opts.tab);
    else setActiveModuleTab(null);
    if (opts.channel) setActiveChannel(opts.channel);
    setActivePage(page);
  };

  const backToDashboard = () => {
    setActivePage('event-dashboard');
    setActiveModuleTab(null);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'overview':
        return <OverviewPage />;
      case 'events':
        return <EventsPage onNavigate={navigate} onCreateEvent={() => setShowEventCreator(true)} />;
      case 'event-dashboard':
        return (
          <div className="main-content">
            <EventDashboard eventId={activeEventId} onBack={() => setActivePage('events')} onNavigate={navigate} />
          </div>
        );
      case 'credentials':
        return (
          <div className="main-content" style={{ padding: 0 }}>
            <CredentialsModule onBack={backToDashboard} />
          </div>
        );
      case 'guestlist':
        return (
          <div className="main-content" style={{ padding: 0 }}>
            <GuestListsModule eventId={activeEventId} eventName={activeModuleEventName} onBack={backToDashboard} />
          </div>
        );
      case 'catering':
        return (
          <div className="main-content" style={{ padding: 0 }}>
            <CateringModule initialTab={activeModuleTab} eventName={activeModuleEventName} onBack={backToDashboard} />
          </div>
        );
      case 'assets':
        return (
          <div className="main-content" style={{ padding: 0 }}>
            <AssetsModule initialTab={activeModuleTab} onBack={backToDashboard} />
          </div>
        );
      case 'forms':
        return (
          <div className="main-content" style={{ padding: 0 }}>
            <FormsModule initialTab={activeModuleTab} eventName={activeModuleEventName} onBack={backToDashboard} />
          </div>
        );
      case 'dms':
        return (
          <DMsPage
            onSelectContact={(contact) => {
              setActiveDmContact(contact);
              setActivePage('dm-chat');
            }}
          />
        );
      case 'dm-chat':
        return (
          <DMChatPage
            contact={activeDmContact}
            onBack={() => setActivePage('dms')}
          />
        );
      case 'channel':
        return (
          <ChannelChatPage
            key={activeChannel}
            channelName={activeChannel || 'inf25-general'}
            onBack={() => setActivePage('overview')}
          />
        );
      default:
        return <OverviewPage />;
    }
  };

  return (
    <>
      <AppLayout
        topNav={
          <TopNav
            activePage={activePage}
            setActivePage={setActivePage}
          />
        }
        sidebar={
          <Sidebar
            activePage={activePage}
            setActivePage={setActivePage}
            activeChannel={activeChannel}
            setActiveChannel={setActiveChannel}
            onSelectDm={(contact) => {
              setActiveDmContact(contact);
              setActivePage('dm-chat');
            }}
          />
        }
      >
        <div key={activePage} className="page-enter">
          {renderPage()}
        </div>
      </AppLayout>

      {showEventCreator && (
        <EventCreator onClose={() => setShowEventCreator(false)} />
      )}
    </>
  );
}
