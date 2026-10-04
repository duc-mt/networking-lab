// ---------------------------------------------------------------------------
// Project registry for the portfolio.
//
// The site is organized around the 9 lab formats documented in
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
        description: 'Diễn biến FSM và quá trình trao đổi gói tin theo thời gian thực.',
    },
    troubleshooting: {
        label: 'Troubleshooting Lab',
        short: 'Troubleshoot',
        icon: 'fa-stethoscope',
        accent: 'from-amber-500 to-orange-600',
        description: 'Triệu chứng → loại trừ giả thuyết → nguyên nhân gốc → khắc phục.',
    },
    'packet-walk': {
        label: 'Security Packet Walk',
        short: 'Packet Walk',
        icon: 'fa-shield-halved',
        accent: 'from-rose-500 to-red-600',
        description: 'Truy vết gói tin qua firewall pipeline, NAT và policy inspection.',
    },
    'change-mop': {
        label: 'Change / MOP Workflow',
        short: 'Change MOP',
        icon: 'fa-clipboard-check',
        accent: 'from-emerald-500 to-teal-600',
        description: 'Kịch bản bảo trì: Pre-check → Execute → Post-check → Rollback.',
    },
    automation: {
        label: 'Automation Workflow',
        short: 'Automation',
        icon: 'fa-robot',
        accent: 'from-purple-500 to-fuchsia-600',
        description: 'Mô phỏng Script/API request-response kèm xử lý ngoại lệ thực tế.',
    },
    failover: {
        label: 'HA / Failover Drill',
        short: 'Failover',
        icon: 'fa-heart-pulse',
        accent: 'from-cyan-500 to-blue-600',
        description: 'Kích hoạt sự cố, đếm ngược timer và quá trình hội tụ lưu lượng.',
    },
    'topology-design': {
        label: 'Topology Reference',
        short: 'Design',
        icon: 'fa-diagram-project',
        accent: 'from-teal-500 to-cyan-700',
        description: 'Bản đồ kiến trúc mạng tĩnh, bảng định tuyến và tra cứu đường đi.',
    },
    'diagnostic-playbook': {
        label: 'Diagnostic Playbook',
        short: 'Playbook',
        icon: 'fa-book-medical',
        accent: 'from-lime-500 to-green-600',
        description: 'Danh mục kịch bản lỗi trên cùng một topology dạng tab tra cứu.',
    },
    'algorithm-viz': {
        label: 'Algorithm Visualizer',
        short: 'Algorithm',
        icon: 'fa-share-nodes',
        accent: 'from-violet-500 to-indigo-700',
        description: 'Đồ thị tương tác — tự động tính toán lại thuật toán khi đổi topology.',
    },
};

const PROJECTS = [
    {
        id: 'vrrp-ospf-failover',
        title: 'VRRP + OSPF Failover Visualization',
        category: 'failover',
        type: 'failover',
        status: 'live',
        dateAdded: '2026-10-03',
        image: 'assets/images/protocol-placeholder.jpg',
        description:
            'Mô phỏng chuỗi failover khi router VyOS chính mất kết nối WAN và sự kết hợp giữa VRRP với OSPF để khôi phục lưu lượng.',
        tags: ['VRRP', 'OSPF', 'HA', 'Failover', 'VyOS', 'GARP'],
        href: 'projects/failover/vrrp-ospf-failover.html',
    },
    {
        id: 'vxlan-mtu-blackhole',
        title: 'EVPN-VXLAN MTU Blackhole',
        category: 'troubleshooting',
        type: 'troubleshooting',
        status: 'live',
        dateAdded: '2026-09-27',
        image: 'assets/images/protocol-placeholder.jpg',
        description:
            'Chẩn đoán sự cố mạng: Ping thông suốt qua đường hầm VXLAN Stretched L2 trên nền MPLS, nhưng TCP (truyền tải file) bị rớt hoàn toàn do lỗi Overhead MTU.',
        tags: ['EVPN', 'VXLAN', 'MPLS', 'MTU', 'Troubleshooting', 'Jumbo Frames'],
        href: 'projects/troubleshooting/vxlan-mtu-blackhole.html',
    },

    {
        id: 'evpn-vxlan-mpls-transit',
        title: 'EVPN-VXLAN Multi-Cloud Transit',
        category: 'topology-design',
        type: 'topology-design',
        status: 'live',
        dateAdded: '2026-09-27',
        image: 'assets/images/protocol-placeholder.jpg',
        description:
            'Tài liệu thiết kế kiến trúc và mô phỏng luồng traffic: Căng Overlay L2 (EVPN-VXLAN) qua mạng WAN Underlay (MPLS L3VPN).',
        tags: ['EVPN', 'VXLAN', 'MPLS', 'WAN Transit', 'Topology Design', 'BGP'],
        href: 'projects/topology-design/evpn-vxlan-mpls-transit.html',
    },

    {
        id: 'wireguard-pfsense-walk',
        title: 'WireGuard VPN Client-to-Site',
        category: 'packet-walk',
        type: 'packet-walk',
        status: 'live',
        dateAdded: '2026-09-27',
        image: 'assets/images/protocol-placeholder.jpg',
        description:
            'Truy vết chi tiết gói tin WireGuard qua pfSense: từ đóng gói outer UDP 51820, giải mã kernel if_wg, xác thực AllowedIPs đến kiểm soát luật firewall.',
        tags: ['WireGuard', 'pfSense', 'Packet Walk', 'Firewall', 'Noise Protocol', 'VPN'],
        href: 'projects/packet-walk/wireguard-pfsense-walk.html',
    },

    {
        id: 'rogue-dhcp-investigation',
        title: 'Rogue DHCP & Layer 2 Security',
        category: 'troubleshooting',
        type: 'troubleshooting',
        status: 'live',
        dateAdded: '2026-09-27',
        image: 'assets/images/protocol-placeholder.jpg',
        description:
            'Chẩn đoán sự cố mạng do Router Wi-Fi cá nhân gây Rogue DHCP, cấp phát sai Gateway và giải pháp phòng thủ triệt để với DHCP Snooping, DAI, IP Source Guard.',
        tags: ['DHCP Snooping', 'Rogue DHCP', 'DAI', 'IPSG', 'Layer 2 Security', 'Troubleshooting'],
        href: 'projects/troubleshooting/rogue-dhcp-investigation.html',
    },

    {
        id: 'clusterxl-patching',
        title: 'ClusterXL Zero-Downtime Patching',
        category: 'failover',
        type: 'failover',
        status: 'live',
        dateAdded: '2026-09-27',
        image: 'assets/images/protocol-placeholder.jpg',
        description:
            'Mô phỏng quy trình patch Check Point ClusterXL R81.20 Jumbo Hotfix không gián đoạn dịch vụ: patch Standby trước, trigger Manual Failover, patch Active sau.',
        tags: ['Check Point', 'ClusterXL', 'HA', 'Zero Downtime', 'Patching', 'Failover'],
        href: 'projects/failover/clusterxl-patching.html',
    },

    {
        id: 'port-security-errdisable',
        title: 'Port Security — Err-Disabled Incident',
        category: 'troubleshooting',
        type: 'troubleshooting',
        status: 'live',
        dateAdded: '2026-09-27',
        image: 'assets/images/protocol-placeholder.jpg',
        description:
            'Chẩn đoán sự cố mạng do Port Security Sticky MAC cấu hình lỗi gây err-disabled port, khiến nhân viên mất kết nối sau khi IT di chuyển máy tính.',
        tags: ['Port Security', 'Err-Disabled', 'Sticky MAC', 'Troubleshooting', 'Switching'],
        href: 'projects/troubleshooting/port-security-errdisable.html',
    },

    {
        id: 'stp-convergence',
        title: 'STP Link Failure & Convergence',
        category: 'protocol',
        type: 'protocol',
        status: 'live',
        dateAdded: '2026-09-27',
        image: 'assets/images/protocol-placeholder.jpg',
        description:
            'So sánh cơ chế xử lý đứt cáp và thời gian hội tụ của 4 giao thức: STP (802.1D) chậm chạp vs RSTP/MSTP (< 1s với Proposal/Agreement).',
        tags: ['STP', 'RSTP', 'PVST+', 'MSTP', 'Convergence', 'Failover'],
        href: 'projects/protocol/stp-convergence.html',
    },

    {
        id: 'stp-visual-compare',
        title: 'STP Variants in Action',
        category: 'protocol',
        type: 'protocol',
        status: 'live',
        dateAdded: '2026-09-27',
        image: 'assets/images/protocol-placeholder.jpg',
        description:
            'So sánh trực quan cơ chế hoạt động của STP, Load-balancing của PVST+, Tốc độ hội tụ của RSTP và Gom nhóm VLAN của MSTP.',
        tags: ['STP', 'PVST+', 'RSTP', 'MSTP', 'Simulation'],
        href: 'projects/protocol/stp-visual-compare.html',
    },

    {
        id: 'stp-election',
        title: 'STP Root Election',
        category: 'protocol',
        type: 'protocol',
        status: 'live',
        dateAdded: '2026-09-27',
        image: 'assets/images/protocol-placeholder.jpg',
        description:
            'Mô phỏng cơ chế chống Loop mạng L2 của Spanning Tree Protocol: quá trình bầu chọn Root Bridge, Root Port và ngắt kết nối (Blocking/Alternate).',
        tags: ['STP', 'Loop Prevention', 'Root Bridge', 'BPDU', 'Layer 2'],
        href: 'projects/protocol/stp-election.html',
    },

    {
        id: 'dhcp-master-fsm',
        title: 'DHCP Protocol Suite',
        category: 'protocol',
        type: 'protocol',
        status: 'live',
        dateAdded: '2026-09-27',
        image: 'assets/images/protocol-placeholder.jpg',
        description:
            'Tổ hợp mô phỏng DHCP: Luân chuyển linh hoạt giữa quá trình cấp phát IP mạng nội bộ (Local DORA 2 Nodes) và cấp phát xuyên mạng (Relay Agent 3 Nodes).',
        tags: ['DHCP', 'D.O.R.A', 'Relay', 'Option 82', 'Broadcast', 'Unicast'],
        href: 'projects/protocol/dhcp-master.html',
    },

    {
        title: 'OSPF Neighbor Adjacency',
        description:
            'Step through OSPF forming a Full adjacency between two routers — Hello packets, DBD exchange, and LSDB sync.',
        type: 'protocol',
        tags: ['OSPF', 'Cisco IOS', 'Routing', 'Link State'],
        href: 'projects/protocol/ospf-adjacency.html',
        status: 'live',
        dateAdded: '2026-09-20',
    },
    {
        title: 'VLAN Trunking',
        description: 'Walk through 802.1Q tagging across a trunk link between two switches.',
        type: 'protocol',
        tags: ['VLAN', '802.1Q', 'Trunking', 'Switching'],
        href: '#',
        status: 'soon',
        dateAdded: '2026-09-26',
    },
    {
        title: 'Branch Site Outage — Root Cause Hunt',
        description:
            "A branch can't reach the file server. Walk the hypothesis list down to the real cause and the fix.",
        type: 'troubleshooting',
        tags: ['Outage', 'Root Cause', 'Post-Mortem'],
        href: '#',
        status: 'soon',
        dateAdded: '2026-09-26',
    },

    {
        title: 'Core Switch Cutover',
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
        description:
            'Trigger an outage on the active router and watch HSRP timers count down to convergence.',
        type: 'failover',
        tags: ['HSRP', 'Convergence', 'Timers'],
        href: '#',
        status: 'soon',
        dateAdded: '2026-09-26',
    },
    {
        title: 'Check Point: Optimize Cluster Sync',
        description:
            'MOP chuyển đổi ClusterXL sang chế độ Optimized Sync zero-downtime để giảm tải CPU.',
        type: 'change-mop',
        tags: ['Check Point', 'ClusterXL', 'Optimization', 'Zero Downtime'],
        href: 'projects/change-mop/checkpoint-optimized-sync.html',
        status: 'live',
        dateAdded: '2026-09-20',
    },
    {
        title: 'Check Point: Enable VMAC',
        description:
            'MOP kích hoạt Virtual MAC trên ClusterXL giúp loại bỏ hoàn toàn gián đoạn ARP trong quá trình Failover.',
        type: 'change-mop',
        tags: ['Check Point', 'ClusterXL', 'VMAC', 'Layer 2', 'Failover'],
        href: 'projects/change-mop/checkpoint-vmac-enable.html',
        status: 'live',
        dateAdded: '2026-09-20',
    },
    {
        title: 'Check Point: ISP Redundancy',
        description:
            'MOP triển khai Dual ISP (Primary/Backup) qua SmartConsole cho ClusterXL, giữ vững SecureXL acceleration.',
        type: 'change-mop',
        tags: ['Check Point', 'ClusterXL', 'ISP', 'Redundancy', 'Routing'],
        href: 'projects/change-mop/checkpoint-isp-redundancy.html',
        status: 'live',
        dateAdded: '2026-09-20',
    },

    {
        title: 'BGP Peering FSM & Technical Traps',
        description:
            'Phân tích quá trình thiết lập trạng thái (FSM) và 3 cái bẫy kỹ thuật kinh điển của BGP.',
        type: 'protocol',
        tags: ['BGP', 'Routing', 'FSM', 'Troubleshooting', 'Split-Horizon'],
        href: 'projects/protocol/bgp-peering.html',
        status: 'live',
        dateAdded: '2026-09-20',
    },
    {
        id: 'ospf-lsa-propagation',
        title: 'OSPF LSA Propagation Simulator',
        category: 'diagnostic-playbook',
        type: 'diagnostic-playbook',
        status: 'live',
        dateAdded: '2026-10-03',
        description:
            'Trực quan hóa cơ chế tạo và lan truyền của các loại OSPF LSA (Type 1, 2, 3, 5, 7) qua mô hình OSPF Đa Vùng (Multi-Area).',
        tags: ['OSPF', 'LSA', 'Multi-Area', 'ABR', 'ASBR', 'Flooding Scope'],
        href: 'projects/diagnostic-playbook/ospf-lsa-propagation.html',
    },
    {
        id: 'ospf-spf-dijkstra',
        title: 'OSPF SPF (Dijkstra) Visualization',
        category: 'algorithm-viz',
        type: 'algorithm-viz',
        status: 'live',
        dateAdded: '2026-10-03',
        description:
            'Mô phỏng trực quan thuật toán OSPF SPF (Dijkstra): tính toán đường đi ngắn nhất, xây dựng SPF tree và routing table trên mô hình OSPF Đa Vùng.',
        tags: ['OSPF', 'Dijkstra', 'SPF', 'Algorithm', 'LSDB', 'Routing Table'],
        href: 'projects/algorithm-viz/ospf-spf.html',
    },
    {
        id: 'ospf-lsdb-formation',
        title: 'OSPF LSDB Formation Dashboard',
        category: 'protocol',
        type: 'protocol',
        status: 'live',
        dateAdded: '2026-10-03',
        description:
            'Theo dõi toàn bộ vòng đời học định tuyến của OSPF đa vùng (Multi-Area) - từ Hello packets, bầu chọn DR, đến trao đổi DBD và đồng bộ LSDB.',
        tags: ['OSPF', 'LSDB', 'Multi-Area', 'LSA', 'Convergence', 'Simulation'],
        href: 'projects/protocol/ospf-lsdb-formation.html',
    },
    {
        id: 'ospf-redistribute-static',
        title: 'OSPF Static Route Redistribution & Filtering',
        category: 'diagnostic-playbook',
        type: 'diagnostic-playbook',
        status: 'live',
        dateAdded: '2026-10-04',
        description:
            'Khảo sát cơ chế ASBR redistribute static routes vào OSPF domain thành Type-5 LSA, so sánh rủi ro khi không có Route-Map và động học Metric E1 vs E2.',
        tags: ['OSPF', 'Redistribution', 'Route-Map', 'ASBR', 'Type-5 LSA', 'VyOS', 'Firewall'],
        href: 'projects/diagnostic-playbook/ospf-redistribute-static.html',
    },

    {
        id: 'ospf-vti-ipsec',
        title: 'OSPF over VTI IPsec Tunnel',
        category: 'packet-walk',
        type: 'packet-walk',
        status: 'live',
        dateAdded: '2026-10-04',
        description:
            'Trực quan hóa quá trình thành lập OSPF (State Machine) và đóng gói gói tin OSPF vào trong đường hầm VTI IPsec giữa pfSense và VyOS.',
        tags: ['OSPF', 'IPsec', 'VTI', 'ESP', 'pfSense', 'VyOS'],
        href: 'projects/packet-walk/ospf-vti-ipsec.html',
    },

    // --- ADVANCED UPCOMING PROJECTS (COMING SOON) ---
    {
        title: 'SRv6 User Plane & 5G Network Slicing',
        description:
            'Mô phỏng cơ chế đóng gói SRv6 Segment Routing over IPv6 cho 5G Network Slicing và chuyển mạch UPF trong mạng viễn thông Telco.',
        type: 'protocol',
        tags: ['SRv6', '5G Core', 'Segment Routing', 'UPF', 'IPv6', 'Slicing'],
        href: '#',
        status: 'soon',
        dateAdded: '2026-10-04',
    },
    {
        title: 'BGP EVPN Type-2/Type-5 & VXLAN Binding',
        description:
            'Mô phỏng chi tiết FSM và quy trình trao đổi MAC/IP Advertisement (Type-2) và Prefix Advertisement (Type-5) giữa BGP Leaf-Spine trong Data Center.',
        type: 'protocol',
        tags: ['EVPN', 'VXLAN', 'Type-2 LSA', 'Type-5 LSA', 'Data Center', 'BGP'],
        href: '#',
        status: 'soon',
        dateAdded: '2026-10-04',
    },
    {
        title: 'PIM-SM & Anycast RP with MSDP Sync',
        description:
            'Diễn biến FSM PIM Register, hình thành Shared Tree (*,G) và Shortest Path Tree (S,G) giữa các router Multicast Core.',
        type: 'protocol',
        tags: ['Multicast', 'PIM-SM', 'MSDP', 'Anycast RP', 'SPT', 'Rendezvous Point'],
        href: '#',
        status: 'soon',
        dateAdded: '2026-10-04',
    },
    {
        title: 'BGP Route Flapping & Route Dampening',
        description:
            'Chẩn đoán sự cố cáp biển chập chờn gây BGP Flapping liên tục, ngắt kết nối Peering quốc tế và thuật toán Suppress/Penalty.',
        type: 'troubleshooting',
        tags: ['BGP', 'Flapping', 'Route Dampening', 'Troubleshooting', 'WAN'],
        href: '#',
        status: 'soon',
        dateAdded: '2026-10-04',
    },
    {
        title: 'ECMP Hashing Imbalance & Polarization',
        description:
            'Sự cố phân tải không đều trên 8 đường Spine-Leaf do lỗi Hashing Polarization gây nghẽn 1 đường link trong khi 7 đường rảnh.',
        type: 'troubleshooting',
        tags: ['ECMP', 'Spine-Leaf', 'Hashing', 'Polarization', 'Data Center'],
        href: '#',
        status: 'soon',
        dateAdded: '2026-10-04',
    },
    {
        title: 'Palo Alto / FortiGate SSL Forward Proxy Walk',
        description:
            'Truy vết chi tiết gói tin HTTPS qua SSL Inspection Engine: Handshake interception, CA Certificate Re-signing và Egress NAT.',
        type: 'packet-walk',
        tags: ['SSL Inspection', 'Palo Alto', 'FortiGate', 'HTTPS', 'Packet Walk', 'Firewall'],
        href: '#',
        status: 'soon',
        dateAdded: '2026-10-04',
    },
    {
        title: 'IPsec IKEv2 DPD & Dynamic VTI Walk',
        description:
            'Hành trình gói tin qua hầm IPsec VTI trong kịch bản failover kênh thuê riêng sang VPN backup với mã hóa AES-GCM-256.',
        type: 'packet-walk',
        tags: ['IPsec', 'IKEv2', 'VTI', 'DPD', 'VPN', 'AES-GCM'],
        href: '#',
        status: 'soon',
        dateAdded: '2026-10-04',
    },
    {
        title: 'Core Spine ISSU Zero-Downtime Upgrade MOP',
        description:
            'Kịch bản nâng cấp OS hàng loạt cho Data Center Spine Switches không mất gói tin sử dụng Graceful Restart & BGP Maintenance Mode.',
        type: 'change-mop',
        tags: ['ISSU', 'Data Center', 'Spine', 'BGP Maintenance', 'Zero Downtime', 'MOP'],
        href: '#',
        status: 'soon',
        dateAdded: '2026-10-04',
    },
    {
        title: 'DC Migration: L2 Overlay Stretch Cutover MOP',
        description:
            'Quy trình MOP di chuyển Data Center: Pre-check L2 Extension, Migrate Anycast Gateway, Post-check và Decommissioning.',
        type: 'change-mop',
        tags: ['DC Migration', 'VXLAN Stretch', 'Anycast GW', 'MOP', 'Cutover'],
        href: '#',
        status: 'soon',
        dateAdded: '2026-10-04',
    },
    {
        title: 'CI/CD Batfish Intent & GitOps Deploy',
        description:
            'Tự động hóa kiểm thử Network Intent (ACL, Routing, Reachability) bằng Batfish trong GitLab CI trước khi push config qua Ansible.',
        type: 'automation',
        tags: ['Batfish', 'GitLab CI', 'Ansible', 'GitOps', 'Network Automation', 'CI/CD'],
        href: '#',
        status: 'soon',
        dateAdded: '2026-10-04',
    },
    {
        title: 'PyGNMI / gRPC Telemetry Auto-Remediation',
        description:
            'Script Python lắng nghe gRPC Streaming Telemetry từ Cisco Nexus, tự động cô lập Interface khi phát hiện CRC Error tăng đột biến.',
        type: 'automation',
        tags: ['gRPC', 'gNMI', 'Telemetry', 'Python', 'Cisco Nexus', 'Auto-Remediation'],
        href: '#',
        status: 'soon',
        dateAdded: '2026-10-04',
    },
    {
        title: 'Arista EVPN Multihoming (EVPN-MH) Failover',
        description:
            'Diễn biến Failover khi đứt 1 uplink của Server nối dual-home vào 2 Leaf switches không dùng MLAG (ESI-LAG failover < 50ms).',
        type: 'failover',
        tags: ['EVPN-MH', 'ESI-LAG', 'Arista', 'Active-Active', 'Failover', 'HA'],
        href: '#',
        status: 'soon',
        dateAdded: '2026-10-04',
    },
    {
        title: 'BGP PIC (Prefix Independent Convergence) FRR',
        description:
            'Kịch bản đứt Core Transport Link: BGP PIC Edge kích hoạt nhãn Backup Path ngay cấp phần phẳng phần cứng (FIB) trong dưới 10ms.',
        type: 'failover',
        tags: ['BGP PIC', 'Fast Reroute', 'MPLS', 'Convergence', 'FIB', 'HA'],
        href: '#',
        status: 'soon',
        dateAdded: '2026-10-04',
    },
    {
        title: 'High-Frequency Trading (HFT) Low-Latency Blueprint',
        description:
            'Bản đồ kiến trúc mạng chứng khoán siêu thấp độ trễ: Cut-through switching, PTP IEEE 1588v2, Kernel Bypass & Multicast Feed.',
        type: 'topology-design',
        tags: ['HFT', 'Low Latency', 'PTP 1588v2', 'Kernel Bypass', 'Topology Design', 'Multicast'],
        href: '#',
        status: 'soon',
        dateAdded: '2026-10-04',
    },
    {
        title: 'Multi-Region SD-WAN Mesh & SASE Blueprint',
        description:
            'Kiến trúc HLD mạng SD-WAN đa vùng kết nối Trụ sở - Branch - Cloud (AWS/Azure) tích hợp Cloud Security Service Edge (SSE).',
        type: 'topology-design',
        tags: ['SD-WAN', 'SASE', 'Multi-Cloud', 'AWS', 'Azure', 'Topology Design'],
        href: '#',
        status: 'soon',
        dateAdded: '2026-10-04',
    },
    {
        title: 'MPLS L3VPN & TE Diagnostic Playbook',
        description:
            'Danh mục 6 kịch bản sự cố trên mạng đường trục MPLS Core: LDP-IGP Out-of-Sync, Blackhole khi đứt LSP, MTU Mismatch trên P Routers.',
        type: 'diagnostic-playbook',
        tags: ['MPLS', 'L3VPN', 'Traffic Engineering', 'LDP-IGP Sync', 'Playbook'],
        href: '#',
        status: 'soon',
        dateAdded: '2026-10-04',
    },
    {
        title: 'Kubernetes CNI (Cilium eBPF) Diagnostic Playbook',
        description:
            'Sổ tay chẩn đoán sự cố mạng Container: Pod-to-Pod drop, NodePort Service routing loop, eBPF BPF map full và MTU Overhead.',
        type: 'diagnostic-playbook',
        tags: ['Kubernetes', 'Cilium', 'eBPF', 'CNI', 'Container Networking', 'Playbook'],
        href: '#',
        status: 'soon',
        dateAdded: '2026-10-04',
    },
    {
        title: 'MPLS-TE CSPF (Constrained Shortest Path First)',
        description:
            'Đồ thị thuật toán CSPF tự động tính toán đường đi MPLS TE Tunnel thỏa mãn đồng thời ràng buộc Bandwidth, Affinity Color và Max Hop Count.',
        type: 'algorithm-viz',
        tags: ['MPLS-TE', 'CSPF', 'Algorithm', 'Path Computation', 'Constrained SPF'],
        href: '#',
        status: 'soon',
        dateAdded: '2026-10-04',
    },
    {
        title: 'BGP 13-Step Best Path Selection Engine',
        description:
            'Trực quan hóa tương tác 13 bước chọn đường BGP (Weight -> Local Pref -> Self Originated -> AS-Path -> Origin -> MED -> eBGP/iBGP -> IGP Metric -> Router ID).',
        type: 'algorithm-viz',
        tags: ['BGP', 'Best Path', 'Routing Algorithm', 'Local Pref', 'AS-Path', 'MED'],
        href: '#',
        status: 'soon',
        dateAdded: '2026-10-04',
    },
];
