export const EVENT = {
    name: 'Infosys Summit 2025',
    fullName: 'Infosys Leadership Summit 2025',
    date: 'Apr 13–14, 2025',
    days: 2,
};

// Category metadata — used for filter chips and coloured pills
export const ASSET_CATEGORIES = [
    { id: 'AV',           label: 'AV',           color: '#2471A3', bg: '#EBF5FB' },
    { id: 'Staging',      label: 'Staging',      color: '#CA6F1E', bg: '#FDF2E9' },
    { id: 'Registration', label: 'Registration', color: '#1E8449', bg: '#E9F7EF' },
    { id: 'Catering',     label: 'Catering',     color: '#7D3C98', bg: '#F5EEF8' },
    { id: 'Branding',     label: 'Branding',     color: '#B7950B', bg: '#FEF9E7' },
];

// Primary asset registry — the source of truth for the tracker view
export const ASSETS = [
    {
        id: 'ast-1',
        name: 'LED Wall 12×4m',
        category: 'AV',
        zone: 'Stage — Hall B',
        vendor: 'AV Solutions',
        loadIn:  'Apr 13, 6:00 AM',
        loadOut: 'Apr 14, 8:00 PM',
        status: 'confirmed',
        notes: 'Requires 3-phase power. Confirm with venue electrician on Apr 12.',
    },
    {
        id: 'ast-2',
        name: 'FOH Audio Console',
        category: 'AV',
        zone: 'FOH Position',
        vendor: 'AV Solutions',
        loadIn:  'Apr 13, 6:00 AM',
        loadOut: 'Apr 14, 8:00 PM',
        status: 'confirmed',
        notes: '',
    },
    {
        id: 'ast-3',
        name: 'Stage Rigging Kit',
        category: 'Staging',
        zone: 'Stage — Hall B',
        vendor: 'AV Solutions',
        loadIn:  'Apr 12, 2:00 PM',
        loadOut: 'Apr 14, 10:00 PM',
        status: 'pending',
        notes: 'Awaiting venue ceiling load cert before confirming.',
    },
    {
        id: 'ast-4',
        name: 'Registration Kiosks × 8',
        category: 'Registration',
        zone: 'Lobby A',
        vendor: 'RegTech India',
        loadIn:  'Apr 13, 8:00 AM',
        loadOut: 'Apr 14, 6:00 PM',
        status: 'confirmed',
        notes: '',
    },
    {
        id: 'ast-5',
        name: 'Badge Printer × 4',
        category: 'Registration',
        zone: 'Reg Desk',
        vendor: 'RegTech India',
        loadIn:  'Apr 13, 8:00 AM',
        loadOut: 'Apr 14, 6:00 PM',
        status: 'confirmed',
        notes: 'Label stock confirmed. Backup cartridges in ops kit.',
    },
    {
        id: 'ast-6',
        name: 'Podium + Lectern',
        category: 'Staging',
        zone: 'Stage — Hall A',
        vendor: 'Decor Co.',
        loadIn:  'Apr 13, 10:00 AM',
        loadOut: 'Apr 14, 8:00 PM',
        status: 'draft',
        notes: 'Vendor quote pending — not yet confirmed.',
    },
    {
        id: 'ast-7',
        name: 'Catering Warmer Units × 6',
        category: 'Catering',
        zone: 'Catering Bay',
        vendor: 'Grand Caterers',
        loadIn:  'Apr 13, 7:00 AM',
        loadOut: 'Apr 14, 11:00 PM',
        status: 'confirmed',
        notes: '',
    },
    {
        id: 'ast-8',
        name: 'Sponsor Banners × 12',
        category: 'Branding',
        zone: 'Main Entrance + Hall A',
        vendor: 'PrintEdge',
        loadIn:  'Apr 13, 9:00 AM',
        loadOut: 'Apr 14, 9:00 PM',
        status: 'confirmed',
        notes: 'HDFC and Infosys logos — approved by client on Apr 3.',
    },
];

export const DISTRIBUTION_LOG = [
    { id: 1, assetName: 'Walkie Talkie', vendorName: 'Acme AV Solutions',      distributed: 18, returned: 17, days: 3, pricePerDay: 500,  billbackAmount: 27000 },
    { id: 2, assetName: 'Golf Cart',     vendorName: 'Acme AV Solutions',      distributed: 5,  returned: 5,  days: 3, pricePerDay: 2500, billbackAmount: 37500 },
    { id: 3, assetName: 'PA Speaker',    vendorName: 'StageRight Productions', distributed: 8,  returned: 8,  days: 3, pricePerDay: 800,  billbackAmount: 19200 },
    { id: 4, assetName: 'Round Table',   vendorName: 'Elite Hospitality',      distributed: 30, returned: 28, days: 3, pricePerDay: 300,  billbackAmount: 27000 },
];

export const BILLBACK_BY_VENDOR = [
    { vendorName: 'Acme AV Solutions',      assetCount: 2, total: 64500 },
    { vendorName: 'StageRight Productions', assetCount: 1, total: 19200 },
    { vendorName: 'Elite Hospitality',      assetCount: 1, total: 27000 },
];

export const RETURN_STATUS = { returned: 58, pending: 3, unreturned: 0 };

export const BILLBACK = {
    totalAmount: 110700,
    vendorCount: 3,
    locked:      false,
};

export const WIDGET_STATS = {
    total:     8,
    confirmed: 5,
    pending:   2,
    draft:     1,
};

export const WIDGET_RETURN = { returned: 312, pending: 47, damaged: 8 };
