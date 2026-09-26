// ---------------------------------------------------------------------------
// Project registry for the portfolio.
//
// The site is organized around the 6 lab formats documented in
// docs/prompt-templates.md. Each lab has a `type` — one of the keys in
// PROJECT_TYPES below — which drives its folder, its icon/color on the
// homepage, and the filter chips. You do NOT need to pick an icon or color
// per project; it's inherited from the type unless you override it.
//
// To add a new lab:
//   1. Generate it with the matching prompt from docs/prompt-templates.md.
//   2. Save it under projects/<type>/<slug>.html  (e.g. projects/protocol/stp.html)
//      — the back-link in its header should point to ../../index.html.
//   3. Add one object to PROJECTS below.
//
// Project object fields:
//   title        string
//   description  string   — one-line summary shown on the card
//   type         string   — one of the PROJECT_TYPES keys below (required).
//                           This is the UI FORMAT (state machine, logic tree,
//                           pipeline, etc) — it drives the folder, icon, color,
//                           and the fixed filter chips.
//   topic        string   — the SUBJECT DOMAIN (e.g. "Routing", "Switching",
//                           "Security", "Automation"). Independent of `type` —
//                           two labs can share a type but cover different
//                           topics (STP and VLAN are both `protocol`-type but
//                           both happen to be "Switching" topic; OSPF is
//                           `protocol`-type but "Routing" topic). Free text —
//                           the "Topic" dropdown on the homepage is built from
//                           whatever values show up here, no fixed list to edit.
//   tags         string[] — searchable keywords
//   href         string   — "projects/<type>/<slug>.html"
//   status       "live" | "soon"
//   dateAdded    "YYYY-MM-DD" — used by the "Newest" sort
//   icon/accent  optional — overrides the type's default icon/gradient
// ---------------------------------------------------------------------------

const PROJECT_TYPES = {
    protocol: {
        label: 'Protocol Simulator',
        short: 'Protocol',
        icon: 'fa-route',
        accent: 'from-blue-500 to-indigo-600',
        description: 'State machine over time — how a protocol actually forms.',
    },
    troubleshooting: {
        label: 'Troubleshooting Lab',
        short: 'Troubleshooting',
        icon: 'fa-stethoscope',
        accent: 'from-amber-500 to-orange-600',
        description: 'Symptom → ruled-out hypotheses → root cause → fix.',
    },
    'packet-walk': {
        label: 'Security Packet Walk',
        short: 'Packet Walk',
        icon: 'fa-shield-halved',
        accent: 'from-rose-500 to-red-600',
        description: 'One packet traced through NAT, policy, and inspection.',
    },
    'change-mop': {
        label: 'Change / MOP Flow',
        short: 'Change / MOP',
        icon: 'fa-clipboard-check',
        accent: 'from-emerald-500 to-teal-600',
        description: 'Pre-checks → execution → post-checks → rollback.',
    },
    automation: {
        label: 'Automation Workflow',
        short: 'Automation',
        icon: 'fa-robot',
        accent: 'from-purple-500 to-fuchsia-600',
        description: 'Script/API request-response, with real error handling.',
    },
    failover: {
        label: 'Failover / HA Drill',
        short: 'Failover / HA',
        icon: 'fa-heart-pulse',
        accent: 'from-cyan-500 to-blue-600',
        description: 'Trigger an outage, watch timers and convergence play out.',
    },
};

const PROJECTS = [
    {
        title: 'OSPF Neighbor Adjacency',
        topic: 'Routing',
        description:
            'Step through OSPF forming a Full adjacency between two routers — Hello packets, DBD exchange, and LSDB sync.',
        type: 'protocol',
        tags: ['OSPF', 'Cisco IOS', 'Routing', 'Link State'],
        href: 'projects/protocol/ospf-adjacency.html',
        status: 'live',
        dateAdded: '2026-09-20',
    },
    {
        title: 'STP Convergence',
        topic: 'Switching',
        description:
            'Visualize Spanning Tree electing a root bridge and moving ports from Blocking to Forwarding.',
        type: 'protocol',
        tags: ['STP', 'Layer 2', 'Root Bridge', 'Switching'],
        href: '#',
        status: 'soon',
        dateAdded: '2026-09-26',
    },
    {
        title: 'VLAN Trunking',
        topic: 'Switching',
        description: 'Walk through 802.1Q tagging across a trunk link between two switches.',
        type: 'protocol',
        tags: ['VLAN', '802.1Q', 'Trunking', 'Switching'],
        href: '#',
        status: 'soon',
        dateAdded: '2026-09-26',
    },
    {
        title: 'Branch Site Outage — Root Cause Hunt',
        topic: 'Routing',
        description:
            "A branch can't reach the file server. Walk the hypothesis list down to the real cause and the fix.",
        type: 'troubleshooting',
        tags: ['Outage', 'Root Cause', 'Post-Mortem'],
        href: '#',
        status: 'soon',
        dateAdded: '2026-09-26',
    },
    {
        title: 'Packet Walk Through a Firewall',
        topic: 'Security',
        description:
            'Trace one packet through ingress, NAT, security policy, and IPS to its final Accept/Deny verdict.',
        type: 'packet-walk',
        tags: ['Firewall', 'NAT', 'Security Policy'],
        href: '#',
        status: 'soon',
        dateAdded: '2026-09-26',
    },
    {
        title: 'Core Switch Cutover',
        topic: 'Switching',
        description:
            'A full MOP for replacing a core switch — pre-checks, execution, post-checks, and rollback if it fails.',
        type: 'change-mop',
        tags: ['Change Management', 'SPOF', 'Rollback'],
        href: '#',
        status: 'soon',
        dateAdded: '2026-09-26',
    },
    {
        title: 'Netmiko Push With Retry Logic',
        topic: 'Automation',
        description:
            'Pushing config to 3 switches via SSH — what the script does when one of them times out.',
        type: 'automation',
        tags: ['Python', 'Netmiko', 'Error Handling'],
        href: '#',
        status: 'soon',
        dateAdded: '2026-09-26',
    },
    {
        title: 'HSRP Failover Drill',
        topic: 'Routing',
        description:
            'Trigger an outage on the active router and watch HSRP timers count down to convergence.',
        type: 'failover',
        tags: ['HSRP', 'Convergence', 'Timers'],
        href: '#',
        status: 'soon',
        dateAdded: '2026-09-26',
    },
];
