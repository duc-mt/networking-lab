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
        label: 'Mô Phỏng Giao Thức',
        short: 'Giao Thức',
        icon: 'fa-route',
        accent: 'from-blue-500 to-indigo-600',
        description: 'Trạng thái theo thời gian — cách một giao thức thực sự hình thành.',
    },
    troubleshooting: {
        label: 'Xử Lý Sự Cố',
        short: 'Sự Cố',
        icon: 'fa-stethoscope',
        accent: 'from-amber-500 to-orange-600',
        description: 'Triệu chứng → loại trừ giả thuyết → nguyên nhân gốc → khắc phục.',
    },
    'packet-walk': {
        label: 'Truy Vết Gói Tin',
        short: 'Truy Vết',
        icon: 'fa-shield-halved',
        accent: 'from-rose-500 to-red-600',
        description: 'Truy vết một gói tin qua NAT, policy và inspection.',
    },
    'change-mop': {
        label: 'Quy Trình Chuyển Đổi (MOP)',
        short: 'MOP / Thay Đổi',
        icon: 'fa-clipboard-check',
        accent: 'from-emerald-500 to-teal-600',
        description: 'Kiểm tra trước → thực thi → kiểm tra sau → hoàn tác.',
    },
    automation: {
        label: 'Tự Động Hóa',
        short: 'Tự Động',
        icon: 'fa-robot',
        accent: 'from-purple-500 to-fuchsia-600',
        description: 'Request-response của Script/API, kèm xử lý lỗi thực tế.',
    },
    failover: {
        label: 'Diễn Tập HA / Failover',
        short: 'Dự Phòng / HA',
        icon: 'fa-heart-pulse',
        accent: 'from-cyan-500 to-blue-600',
        description: 'Kích hoạt sự cố, theo dõi timer và quá trình hội tụ.',
    },
    'topology-design': {
        label: 'Tham Khảo Thiết Kế Topology',
        short: 'Thiết Kế',
        icon: 'fa-diagram-project',
        accent: 'from-teal-500 to-cyan-700',
        description: 'Bản đồ topology tĩnh, bảng định tuyến và tra cứu đường đi.',
    },
    'diagnostic-playbook': {
        label: 'Sổ Tay Chẩn Đoán',
        short: 'Sổ Tay',
        icon: 'fa-book-medical',
        accent: 'from-lime-500 to-green-600',
        description: 'Danh mục các kịch bản lỗi trên cùng một topology — dưới dạng tab tĩnh.',
    },
};

const PROJECTS = [
    {
        title: 'Network Bắt Bệnh #06 — DNS Resolution',
        topic: 'DNS',
        description:
            'Ping by IP works fine, but hostnames fail — 8 KB cases of DNS resolution breaking on a flat LAN, same topology, one tab per failure mode.',
        type: 'diagnostic-playbook',
        tags: ['DNS', 'dnsmasq', 'resolv.conf', '/etc/hosts', 'nscd'],
        href: 'projects/diagnostic-playbook/dns-resolution.html',
        status: 'live',
        dateAdded: '2026-09-27',
    },
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
    {
        title: 'Check Point ClusterXL Zero Downtime Patching',
        topic: 'Security',
        description:
            'Quy trình nâng cấp firmware cho Check Point ClusterXL không gây gián đoạn dịch vụ.',
        type: 'change-mop',
        tags: ['Check Point', 'ClusterXL', 'Upgrade', 'MOP'],
        href: 'projects/change-mop/checkpoint-cluster-patching.html',
        status: 'live',
        dateAdded: '2026-09-27',
    },
    {
        title: 'Check Point: Optimize Cluster Sync',
        topic: 'Security',
        description:
            'MOP chuyển đổi ClusterXL sang chế độ Optimized Sync zero-downtime để giảm tải CPU.',
        type: 'change-mop',
        tags: ['Check Point', 'ClusterXL', 'Optimization', 'Zero Downtime'],
        href: 'projects/change-mop/checkpoint-optimized-sync.html',
        status: 'live',
        dateAdded: '2026-10-01',
    },
    {
        title: 'Check Point: Enable VMAC',
        topic: 'Security',
        description:
            'MOP kích hoạt Virtual MAC trên ClusterXL giúp loại bỏ hoàn toàn gián đoạn ARP trong quá trình Failover.',
        type: 'change-mop',
        tags: ['Check Point', 'ClusterXL', 'VMAC', 'Layer 2', 'Failover'],
        href: 'projects/change-mop/checkpoint-vmac-enable.html',
        status: 'live',
        dateAdded: '2026-10-02',
    },
    {
        title: 'Check Point: ISP Redundancy',
        topic: 'Routing',
        description:
            'MOP triển khai Dual ISP (Primary/Backup) qua SmartConsole cho ClusterXL, giữ vững SecureXL acceleration.',
        type: 'change-mop',
        tags: ['Check Point', 'ClusterXL', 'ISP', 'Redundancy', 'Routing'],
        href: 'projects/change-mop/checkpoint-isp-redundancy.html',
        status: 'live',
        dateAdded: '2026-10-03',
    },
    {
        title: 'Hybrid Cloud Transit Topology (VyOS / OSPF)',
        topic: 'Architecture',
        description:
            'Bản đồ Topology tĩnh mô phỏng kiến trúc Hybrid Cloud qua VPN Tunnel và OSPF định tuyến động.',
        type: 'topology-design',
        tags: ['Cloud', 'VyOS', 'OSPF', 'GRE Tunnel', 'Topology'],
        href: 'projects/topology-design/hybrid-cloud-transit.html',
        status: 'live',
        dateAdded: '2026-10-05',
    },
    {
        title: 'BGP Peering FSM & Technical Traps',
        topic: 'Routing',
        description:
            'Phân tích quá trình thiết lập trạng thái (FSM) và 3 cái bẫy kỹ thuật kinh điển của BGP.',
        type: 'protocol',
        tags: ['BGP', 'Routing', 'FSM', 'Troubleshooting', 'Split-Horizon'],
        href: 'projects/protocol/bgp-peering.html',
        status: 'live',
        dateAdded: '2026-10-06',
    },
];
