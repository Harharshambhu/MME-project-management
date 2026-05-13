# EventEase — Information Architecture
*Prototype build as of Apr 2026 · Agency Employee view*

---

## 1. Shell — Persistent Chrome

```
┌─────────────────────────────────────────────────────────────┐
│  TOP NAV                                                     │
│  [E] EventEase  │ Overview · Events · DMs  │ Search         │
│                 │                           │ 📡 Bell ⚙     │
├──────────────┬──────────────────────────────────────────────┤
│  LEFT        │  MAIN CONTENT AREA                           │
│  SIDEBAR     │                                              │
│              │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

### Top Nav actions
| Element | Behaviour |
|---|---|
| Overview / Events / DMs | Switch main content area |
| Search bar | Read-only placeholder |
| 📡 Broadcast icon | Opens BroadcastPanel dropdown |
| 🔔 Bell (badge: 3) | Opens NotificationsDropdown |
| ⚙ Settings | Opens SettingsDropdown (Appearance / Notifications / Account / About) |

---

## 2. Left Sidebar

```
COMPANY — Workspace
  MANDATORY  [auto-joined]
    ⊏ company-general  [locked]
    ○ company-wins
    ○ company-random

  DEPARTMENTS  [role-based]
    # dept-operations
    # dept-production
    # dept-marketing
    # dept-finance  [locked]
    # dept-logistics
    # dept-registration

EVENTS — Event Channels
  ● Infosys Summit  [Planning · yellow]  ⚠3
      # inf25-general       3 unread
      # inf25-ops           1 unread
      # inf25-production
      # inf25-registration
      # inf25-marketing
      # inf25-finance  [locked]
      # inf25-logistics
      △ inf25-alerts

  ● Wipro Retreat   [Build-Up · orange]  ⚠1
      # wip24-general       1 unread
      # wip24-ops
      # wip24-logistics
      △ wip24-alerts

  ● Annual Gala     [Active · red]
      # gla26-general

  ● TCS Summit      [Archived · green]
      # tcs24-general

DMs
  SD  Sofia Davis       2 unread
  JL  Jackson Lee       1 unread
  AV  Anita Verma
  TS  Team Standup (5)
  PS  Priya Sharma
  RM  Rahul Menon  [online dot]

[JD]  Jane Doe · Ops Coordinator   ⚙  ●
```

Clicking any channel → Channel Chat page  
Clicking any DM → DM Chat page

---

## 3. Main Content Pages

### 3.1 Overview (`/overview`)
Default landing page.
```
Header: [L] Luminary Events · Employee Workspace

├── Event Channel Lifecycle  (horizontal pipeline Lead→Closed)
├── Activity Feed            (unread messages, form reviews, tasks)
├── Company Channels         (company-* and dept-* with member counts)
└── Event Channels           (active event clusters with channel counts)
```

---

### 3.2 Events (`/events`)
```
Active Events
  ┌─ Infosys Summit 2025   [PLANNING · yellow]  △3  →  Event Dashboard
  ├─ Wipro Retreat 2024    [BUILD-UP · orange]  △1  →  Event Dashboard
  └─ Annual Gala 2026      [ACTIVE · red]           →  Event Dashboard

Archived Events
  └─ TCS Summit 2024       [CLOSED · green]         →  Event Dashboard

[+ New Event]  →  EventCreator modal
```

---

### 3.3 Event Dashboard (`/event-dashboard`)
Entry point to all event modules. Per-event.
```
Header: [Stage colour avatar]  Event Name · Stage · Countdown · Location · Client

Widgets (3 rows):
  Row 1:  Credentials + Guest Lists   (side by side in one card)
  Row 2:  Assets & Equipment  |  Forms & Tasks   (2-column grid)
  Row 3:  Catering                    (full width)

Each widget has a [View Full Module] link → deep-links into module
```

---

### 3.4 Channel Chat (`/channel`)
Rendered when any sidebar channel is clicked.
```
┌──────────────────────────────────┬─────────────────────┐
│  CHAT COLUMN                     │  RIGHT SIDEBAR      │
│                                  │                     │
│  Header: # channel-name          │  Tabs:              │
│    [Event stage badge]           │  · Overview         │
│    [Invite] [Huddle] [Bell] [⋯]  │  · Members          │
│                                  │  · Pinned Docs      │
│  Messages (scrollable)           │  · Forms            │
│    · Text messages               │  · Tasks            │
│    · File attachments            │                     │
│    · Poll cards (WhatsApp style) │                     │
│    · System notices              │                     │
│    · Date separators             │                     │
│                                  │                     │
│  [ Input bar ▷ ]                 │                     │
└──────────────────────────────────┴─────────────────────┘

Modals triggered from header:
  · Channel Window  (details, members, pinned, settings)
  · Invite Modal    (invite teammates)
  · Profile Sidebar (click avatar → user profile slide-in)
  · Message Context Menu (right-click / ⌄ on message)
```

Each channel has distinct message data:
- `inf25-general`, `inf25-ops`, `inf25-production`, `inf25-registration`, `inf25-marketing`, `inf25-finance`, `inf25-logistics`, `inf25-alerts` — own message threads
- All other channels — shared default messages

---

### 3.5 DMs (`/dms`)
```
Header: Direct Messages  [3 unread]
Search bar
Filter tabs: All · Internal · External · Clients · Vendors

Contact list (8 contacts):
  SD  Sofia Davis       Internal · Infosys Summit 2025   2 unread  ›
  JL  Jackson Lee       Internal · Infosys Summit 2025   1 unread  ›
  AV  Anita Verma       Client   · Infosys Summit 2025            ›
  TS  Team Standup [5]  Internal · Infosys Summit 2025            ›
  PS  Priya Sharma      Internal · Infosys Summit 2025            ›
  RM  Rahul Menon       Internal · Annual Gala 2026               ›
  RS  Rahul Sharma      Vendor   · Infosys Summit 2025            ›
  VP  Vikram Patel      Vendor   · Infosys Summit 2025            ›

Click any row → DM Chat page
```

---

### 3.6 DM Chat (`/dm-chat`)
```
Header: ‹  [Avatar]  Contact Name · Role · Org

Profile intro card (top of thread):
  Large avatar + Name + Role · Org + Description + "Working on: Event"

Messages (per-contact thread, real data for all 8 contacts)
  · Sender bubbles (left)
  · Own bubbles (right, blue)

Input bar: "Message [Name]..." ▷
```

---

## 4. Event Modules

All modules open full-screen from the Event Dashboard widget links.  
All have a `‹` circular back button → returns to Event Dashboard.

---

### 4.1 Credentials Module
```
Topbar: ‹  [icon] Credentials · Event Name

Tabs:
  · Configuration        Tier setup (Gold/Silver/Classic), perks, colours
  · Collection & Dist.   Staff + vendor credential distribution table
  · Monitoring           Live pickup tracking, waitlist
  · Fulfillment & Sync   Sync status, fulfilment log
```

---

### 4.2 Guest Lists Module
```
Topbar: ‹  [icon] Guest Lists · Event Name

Tabs (GuestListsModule):
  · RSVP & Confirmation  Guest table, tier badges, dietary, RSVP status
  · Waitlist             Waitlisted guests with position + promotion
  · Check-in             On-day check-in scanner view
  · Export               Download options (CSV, PDF)
```

---

### 4.3 Catering Module
```
Topbar: ‹  [icon] Catering · Event Name

Tabs:
  · Catering Setup    Menu builder, dietary config, session meal mapping
  · Final Count       Lock headcount, per-session confirmation
```

---

### 4.4 Assets & Equipment Module
```
Topbar: ‹  [icon] Assets · Event Name

Tabs:
  · Asset Setup              ← Phase 2 complete (tracker view)
  · Distribution & Billback  ← existing

Asset Setup (tracker view):
  Stat cards:  Total (8) · Confirmed (5) · Pending (2) · Draft (1)

  Load-In Schedule Summary (timeline):
    Apr 12, 2:00 PM  ●──  Stage Rigging Kit
    Apr 13, 6:00 AM  ●──  LED Wall 12×4m  ·  FOH Audio Console
    Apr 13, 7:00 AM  ●──  Catering Warmer Units ×6
    Apr 13, 8:00 AM  ●──  Registration Kiosks ×8  ·  Badge Printer ×4
    Apr 13, 9:00 AM  ●──  Sponsor Banners ×12
    Apr 13, 10:00 AM ●──  Podium + Lectern

  Filter bar:  Search  │  AV · Staging · Registration · Catering · Branding
                        │  Confirmed · Pending · Draft  │  [+ Add asset]

  Asset table: Asset · Category · Zone · Vendor · Load-In · Load-Out · Status
    Status pill is clickable → cycles draft → pending → confirmed → draft

  Phase 3 (planned): "+ Add asset" drawer
```

---

### 4.5 Forms & Tasks Module (combined)
```
Topbar: ‹  [icon] Forms · Event Name
Tab strip:  [Forms & Pipelines]  [Tasks]

── FORMS & PIPELINES TAB ──

  Pipeline list view:
    Cards per pipeline (Vendor Onboarding, Stage Tech Brief, etc.)
    Each shows: stage count, last activity, status
    [+ Create form] button (top right)

  Pipeline detail view (click a card):
    Stage rail:  Draft → Sent → Submitted → Reviewed → Approved
    Each stage has: Submit / Review actions
    Submitting a stage → auto-creates a linked Task in the Tasks tab

── TASKS TAB ──

  View switcher:  List · Kanban · Gantt · Analytics

  List view:
    Task rows: title, assignee, priority, due date, status, tags
    [+ New task] button
    Search + filter bar
    Task drawer (create / edit): title, description, assignee, due, priority, tags, linked form, activity log

  Kanban view:
    Columns: To Do · In Progress · In Review · Done · Blocked
    Draggable cards with priority colour coding

  Gantt view:
    Timeline bars per task, grouped by assignee

  Analytics view (live, computed from tasks state):
    Status Distribution  — bar chart from real task counts
    Workload Distribution — per-assignee assigned vs done
    Form Linkage         — tasks grouped by linkedForm field
    Velocity + Burndown  — static historical data
```

---

## 5. Broadcast Panel (TopNav overlay)

```
Triggered by: 📡 icon in TopNav

Sent tab (default):
  List of past broadcasts, each expandable:
    · Subject + Audience + Time
    · Acknowledgement pill: "X/Y acked" or "✓ All acked"
  Expanded:
    · Full message body
    · ✓ Acknowledged list (avatar + name + time)
    · ◷ Awaiting list (avatar + name + [Nudge] button)

New Broadcast tab:
  · Audience selector (event + role group)
  · Subject input
  · Message textarea
  · Require acknowledgement toggle
  · [Send Broadcast] button (disabled until subject + body filled)
  · Warning: "Recipients cannot reply to broadcasts"
```

---

## 6. Data Sources

| Domain | File |
|---|---|
| Channels, sidebar events | `src/data/channels.js` |
| Channel messages (per-channel) | `src/data/messages.js` |
| DM contacts + threads | `src/data/dms.js` |
| Event list (active + archived) | `src/data/events.js` |
| Notifications | `src/data/notifications.js` |
| Assets (8 records) | `mme-playground/modules/assets/data.js` |
| Forms / pipelines | `mme-playground/modules/forms/data.js` |
| Tasks | `mme-playground/modules/tasks/data.js` |
| Catering | `mme-playground/modules/catering/data.js` |
| Credentials / Guest Lists | `mme-playground/modules/credentials/data.js` |

---

## 7. Planned / Phase 3+

| Feature | Status |
|---|---|
| Assets: "+ Add asset" drawer | Phase 3 planned |
| Assets: Dashboard widget sync (live counts) | Done (Phase 1) |
| Forms: create form wizard | Placeholder only |
| Broadcast: real recipient list from event data | Static data |
| Channel right sidebar: Forms + Tasks tabs | Placeholder components |
| Vendor Portal page | Stub exists (`VendorPortalPage.jsx`) |
