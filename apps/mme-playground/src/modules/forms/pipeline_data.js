// Forms Module — Pipeline Data

export const PIPELINE_STATS = {
    total: 6,
    active: 3,
    complete: 2,
};

// stage.status: 'complete' | 'current' | 'locked'
// stage.direction: string
export const PIPELINES = [
    {
        id: 'av-brief',
        name: 'AV Brief',
        vendor: 'AV Solutions',
        status: 'active',
        stagesComplete: 2,
        totalStages: 5,
        autoTrigger: 'Stage D unlocks when Stage C is approved. Stage E locks until T-3 days.',
        stages: [
            {
                id: 'a', label: 'Stage A: Initial Requirements',
                direction: 'Agency → AV Solutions',
                status: 'complete',
                submittedDate: 'Mar 20', resolution: 'approved',
                fields: [
                    { id: 'f1', type: 'text',     label: 'Event Name',         required: true  },
                    { id: 'f2', type: 'text',     label: 'Venue Name',         required: true  },
                    { id: 'f3', type: 'textarea', label: 'AV Requirements Overview', required: true },
                    { id: 'f4', type: 'number',   label: 'Expected Attendance', required: false },
                ],
            },
            {
                id: 'b', label: 'Stage B: Equipment Confirmation',
                direction: 'AV Solutions → Agency',
                status: 'complete',
                submittedDate: 'Apr 1', resolution: 'approved',
                fields: [
                    { id: 'f1', type: 'text',     label: 'Equipment List',      required: true  },
                    { id: 'f2', type: 'number',   label: 'Total Equipment Units', required: true },
                    { id: 'f3', type: 'textarea', label: 'Notes / Caveats',     required: false },
                ],
            },
            {
                id: 'c', label: 'Stage C: Technical Specs',
                direction: 'AV Solutions → Agency',
                status: 'current',
                due: 'Apr 5', submitted: false,
                fields: [
                    { id: 'f1', type: 'text',     label: 'Audio System Specs',  required: true  },
                    { id: 'f2', type: 'text',     label: 'Lighting Rig Details', required: true },
                    { id: 'f3', type: 'text',     label: 'LED Wall Configuration', required: true },
                    { id: 'f4', type: 'file',     label: 'Technical Drawings (PDF)', required: false },
                    { id: 'f5', type: 'textarea', label: 'Special Requirements', required: false },
                ],
            },
            {
                id: 'd', label: 'Stage D: Load-In Schedule',
                direction: 'Agency → AV Solutions',
                status: 'locked',
                fields: [
                    { id: 'f1', type: 'text',     label: 'Load-In Start Time', required: true },
                    { id: 'f2', type: 'text',     label: 'Bay Assignment',     required: true },
                    { id: 'f3', type: 'textarea', label: 'Access Instructions', required: true },
                ],
            },
            {
                id: 'e', label: 'Stage E: Final Sign-Off',
                direction: 'Both parties',
                status: 'locked',
                fields: [
                    { id: 'f1', type: 'checkbox', label: 'All equipment confirmed on-site', required: true },
                    { id: 'f2', type: 'checkbox', label: 'Safety checks completed',          required: true },
                    { id: 'f3', type: 'textarea', label: 'Sign-off Notes',                   required: false },
                ],
            },
        ],
    },
    {
        id: 'catering-brief',
        name: 'Catering Brief',
        vendor: 'Grand Caterers',
        status: 'active',
        stagesComplete: 1,
        totalStages: 4,
        autoTrigger: 'Stage 2 auto-triggers when headcount is confirmed from guest list.',
        stages: [
            {
                id: 'a', label: 'Stage A: Event Overview',
                direction: 'Agency → Grand Caterers',
                status: 'complete',
                submittedDate: 'Mar 25', resolution: 'approved',
                fields: [
                    { id: 'f1', type: 'text',   label: 'Event Name',     required: true },
                    { id: 'f2', type: 'number', label: 'Expected Pax',   required: true },
                    { id: 'f3', type: 'text',   label: 'Meal Style',     required: true },
                ],
            },
            {
                id: 'b', label: 'Stage B: Menu Proposal',
                direction: 'Grand Caterers → Agency',
                status: 'current',
                due: 'Apr 8', submitted: false,
                fields: [
                    { id: 'f1', type: 'textarea', label: 'Proposed Menu',   required: true },
                    { id: 'f2', type: 'number',   label: 'Per-Head Cost',   required: true },
                    { id: 'f3', type: 'file',     label: 'Menu PDF',        required: false },
                ],
            },
            {
                id: 'c', label: 'Stage C: Final Headcount',
                direction: 'Agency → Grand Caterers',
                status: 'locked',
                fields: [
                    { id: 'f1', type: 'number',   label: 'Final Veg Count',    required: true },
                    { id: 'f2', type: 'number',   label: 'Final Non-Veg Count', required: true },
                    { id: 'f3', type: 'number',   label: 'Special Dietary',     required: false },
                ],
            },
            {
                id: 'd', label: 'Stage D: Invoice Sign-Off',
                direction: 'Both parties',
                status: 'locked',
                fields: [
                    { id: 'f1', type: 'file',     label: 'Final Invoice',       required: true },
                    { id: 'f2', type: 'checkbox', label: 'Amount Verified',     required: true },
                    { id: 'f3', type: 'textarea', label: 'Payment Notes',       required: false },
                ],
            },
        ],
    },
    {
        id: 'equipment-check',
        name: 'Equipment Check',
        vendor: null,
        status: 'complete',
        stagesComplete: 4,
        totalStages: 4,
        autoTrigger: 'Completion of Section 4 auto-marks Stage C of AV Brief as submitted.',
        stages: [
            { id: 'a', label: 'Stage A: Audio',     direction: 'Internal', status: 'complete', submittedDate: 'Mar 28', resolution: 'approved', fields: [] },
            { id: 'b', label: 'Stage B: Lighting',  direction: 'Internal', status: 'complete', submittedDate: 'Mar 30', resolution: 'approved', fields: [] },
            { id: 'c', label: 'Stage C: Video',     direction: 'Internal', status: 'complete', submittedDate: 'Apr 1',  resolution: 'approved', fields: [] },
            { id: 'd', label: 'Stage D: Rigging',   direction: 'Internal', status: 'complete', submittedDate: 'Apr 2',  resolution: 'approved', fields: [] },
        ],
    },
    {
        id: 'rigging-spec',
        name: 'Rigging Spec',
        vendor: 'AV Solutions',
        status: 'active',
        stagesComplete: 3,
        totalStages: 5,
        autoTrigger: 'Stage 4 unlocks after structural load data is approved.',
        stages: [
            { id: 'a', label: 'Stage A: Load Calculations',   direction: 'AV Solutions → Agency', status: 'complete', submittedDate: 'Apr 1', resolution: 'approved', fields: [] },
            { id: 'b', label: 'Stage B: Safety Officer Review', direction: 'Agency Internal',      status: 'complete', submittedDate: 'Apr 3', resolution: 'approved', fields: [] },
            { id: 'c', label: 'Stage C: Venue Ops Sign-Off',  direction: 'Venue → Agency',        status: 'complete', submittedDate: 'Apr 5', resolution: 'approved', fields: [] },
            { id: 'd', label: 'Stage D: PM Final Approval',   direction: 'Agency Internal',        status: 'current',  due: 'Apr 9', submitted: false, fields: [
                { id: 'f1', type: 'checkbox', label: 'All specs reviewed',   required: true },
                { id: 'f2', type: 'textarea', label: 'Approval Notes',       required: false },
            ]},
            { id: 'e', label: 'Stage E: Crew Mobilisation Go', direction: 'Agency → Vendor',      status: 'locked',   fields: [] },
        ],
    },
    {
        id: 'venue-confirmation',
        name: 'Venue Confirmation',
        vendor: null,
        status: 'complete',
        stagesComplete: 3,
        totalStages: 3,
        autoTrigger: 'Completion triggers Credentials and Catering module activation.',
        stages: [
            { id: 'a', label: 'Stage A: Site Visit', direction: 'Internal', status: 'complete', submittedDate: 'Mar 10', resolution: 'approved', fields: [] },
            { id: 'b', label: 'Stage B: Contract',   direction: 'Internal', status: 'complete', submittedDate: 'Mar 15', resolution: 'approved', fields: [] },
            { id: 'c', label: 'Stage C: Payment',    direction: 'Internal', status: 'complete', submittedDate: 'Mar 20', resolution: 'approved', fields: [] },
        ],
    },
    {
        id: 'security-brief',
        name: 'Security Brief',
        vendor: null,
        status: 'not-started',
        stagesComplete: 0,
        totalStages: 3,
        autoTrigger: 'Stage 1 must be completed before security vendor is assigned.',
        stages: [
            { id: 'a', label: 'Stage A: Threat Assessment',  direction: 'Internal', status: 'locked', fields: [] },
            { id: 'b', label: 'Stage B: Vendor Selection',   direction: 'Internal', status: 'locked', fields: [] },
            { id: 'c', label: 'Stage C: Briefing Sign-Off',  direction: 'Internal', status: 'locked', fields: [] },
        ],
    },
];
