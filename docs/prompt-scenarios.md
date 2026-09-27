# Prompt scenario reference (English + Vietnamese)

> **⚠️ GLOBAL SECURITY RULE:**
> The AI processing these prompts is instructed to **automatically scrub and anonymize** any real IPs, hostnames, VLAN IDs, or credentials you paste into the scenario block. You can safely paste real-world troubleshooting notes; the AI will replace them with dummy equivalents (like `10.x.x.x` or `FW-CORE`) in the generated output to ensure zero sensitive data is published.

Quick-copy reference for the part of each prompt that actually changes per use: the scenario/input block. The rest of each prompt (Tailwind/design-system requirements, JSON schema, header rules) is stable and lives in `docs/prompt-templates.md` — copy the full prompt from there, then swap in one of the blocks below.

For each of the 7 types: a blank **placeholder** (fill in your own details) and a **filled example** (a realistic case, ready to copy as-is or adapt), each in English and Vietnamese.

**How to use:** paste the full prompt from `docs/prompt-templates.md` section N, then replace its `====...====` block with one of these — in whichever language you're more comfortable writing in. The instructions to the AI (JSON field names, requirement numbering) stay in English either way; only the scenario description itself changes language.

---

## 1. Protocol Simulator

### Placeholder — English

```
Topic / Lab Scenario:
(Describe the protocol/concept, the devices involved, and the number of steps —
e.g. "OSPF Neighbor Adjacency between 2 Cisco routers, DOWN to FULL, 7 steps")
```

### Placeholder — Tiếng Việt

```
Chủ đề / Kịch bản Lab:
(Mô tả giao thức/khái niệm, các thiết bị liên quan, và số bước —
ví dụ: "OSPF Neighbor Adjacency giữa 2 router Cisco, từ DOWN đến FULL, 7 bước")
```

### Example — English

```
Topic / Lab Scenario:
RSTP electing a root bridge across 3 switches (SW1, SW2, SW3) in a triangle.
SW1 has the lowest priority and becomes Root. The SW2–SW3 link ends up
blocked. Show the elected root port moving Blocking → Listening → Learning
→ Forwarding. 6 steps.
```

### Ví dụ — Tiếng Việt

```
Chủ đề / Kịch bản Lab:
RSTP bầu chọn Root Bridge giữa 3 switch (SW1, SW2, SW3) nối theo hình tam giác.
SW1 có priority thấp nhất nên trở thành Root. Link giữa SW2–SW3 bị Block.
Thể hiện root port được bầu chuyển trạng thái Blocking → Listening → Learning
→ Forwarding. 6 bước.
```

---

## 2. Troubleshooting Lab

### Placeholder — English

```
Case:
- Symptom reported: (what the user/monitoring saw — e.g. "Branch office can't
  reach the file server; intermittent, started ~30 min ago")
- Topology / devices involved: (list devices, IPs, interfaces relevant to the case)
- Root cause: (what it turned out to be)
- Fix applied: (the actual command(s) or change that resolved it)
- Number of diagnostic steps: (e.g. 6)
```

### Placeholder — Tiếng Việt

```
Ca sự cố:
- Triệu chứng ghi nhận: (người dùng/hệ thống giám sát thấy gì — ví dụ: "Chi
  nhánh không truy cập được file server; chập chờn, bắt đầu ~30 phút trước")
- Topology / thiết bị liên quan: (liệt kê thiết bị, IP, interface liên quan)
- Nguyên nhân gốc: (thực chất là gì)
- Cách khắc phục: (lệnh/thay đổi cụ thể đã xử lý được sự cố)
- Số bước chẩn đoán: (ví dụ: 6)
```

### Example — English

```
Case:
- Symptom: Branch (10.20.0.0/24) intermittently can't reach the HQ file
  server (10.10.5.20) — fine some hours, broken others.
- Topology: R-Branch (10.20.0.1) — MPLS — R-HQ (10.10.0.1) — Core-SW — File Server
- Root cause: a laptop with a static-configured duplicate IP (10.10.0.1) on
  the HQ LAN, causing ARP flapping between it and R-HQ
- Fix: removed the rogue device, enabled DHCP snooping + port security on
  the HQ access switch
- Steps: 6
```

### Ví dụ — Tiếng Việt

```
Ca sự cố:
- Triệu chứng: Chi nhánh (10.20.0.0/24) chập chờn không truy cập được file
  server tại HQ (10.10.5.20) — lúc được lúc không.
- Topology: R-Branch (10.20.0.1) — MPLS — R-HQ (10.10.0.1) — Core-SW — File Server
- Nguyên nhân gốc: một laptop được cấu hình IP tĩnh trùng (10.10.0.1) trên
  LAN của HQ, gây ARP flapping với R-HQ
- Cách khắc phục: gỡ thiết bị gây lỗi, bật DHCP snooping + port security
  trên switch access tại HQ
- Số bước: 6
```

---

## 3. Security Packet Walk

### Placeholder — English

```
Scenario:
- Firewall platform: (e.g. "Check Point", "FortiGate", "Palo Alto")
- Original packet: (src IP:port, dst IP:port, protocol)
- What happens to it: (NAT type if any, which policy rule matches, final verdict —
  e.g. "Client 10.1.1.5:51000 → Web server via DNAT to 192.168.1.10:443, allowed by Rule 12")
- Checkpoints to model: (e.g. Ingress Interface, Route Lookup, NAT, Security
  Policy, IPS/Anti-Virus, Egress Interface — adjust the list to the platform)
```

### Placeholder — Tiếng Việt

```
Kịch bản:
- Nền tảng firewall: (ví dụ: "Check Point", "FortiGate", "Palo Alto")
- Packet gốc: (IP:port nguồn, IP:port đích, giao thức)
- Điều gì xảy ra với nó: (loại NAT nếu có, rule policy nào match, kết quả cuối —
  ví dụ: "Client 10.1.1.5:51000 → Web server qua DNAT tới 192.168.1.10:443, được Rule 12 cho phép")
- Các checkpoint cần mô phỏng: (ví dụ: Ingress Interface, Route Lookup, NAT,
  Security Policy, IPS/Anti-Virus, Egress Interface — điều chỉnh theo nền tảng)
```

### Example — English

```
Scenario:
- Firewall platform: FortiGate
- Original packet: Client 203.0.113.45:51122 → Public VIP 198.51.100.10:443
- What happens: DNAT to internal server 10.10.5.20:443, matched by Policy
  ID 15 "Allow-WebDMZ", passes IPS profile, Accept
- Checkpoints: Ingress (wan1) → Route Lookup → DNAT → Security Policy → IPS → Egress (dmz1)
```

### Ví dụ — Tiếng Việt

```
Kịch bản:
- Nền tảng firewall: FortiGate
- Packet gốc: Client 203.0.113.45:51122 → VIP công khai 198.51.100.10:443
- Điều gì xảy ra: DNAT sang server nội bộ 10.10.5.20:443, match Policy ID 15
  "Allow-WebDMZ", qua được IPS profile, kết quả Accept
- Các checkpoint: Ingress (wan1) → Route Lookup → DNAT → Security Policy → IPS → Egress (dmz1)
```

---

## 4. Change / MOP Flow

### Placeholder — English

```
Change:
- What's being changed: (e.g. "Replace Core Switch A with a new Nexus 9300,
  migrate OSPF area 0 peering")
- Devices involved:
- Known risks: (e.g. single point of failure during cutover, risk of
  self-lockout if the management VLAN is misconfigured)
- Old config snippet: (paste relevant lines)
- New config snippet: (paste relevant lines)
- Rollback plan: (what to do if post-checks fail)
```

### Placeholder — Tiếng Việt

```
Thay đổi:
- Nội dung thay đổi: (ví dụ: "Thay Core Switch A bằng Nexus 9300 mới,
  migrate OSPF area 0 peering")
- Thiết bị liên quan:
- Rủi ro đã biết: (ví dụ: single point of failure trong lúc cắt chuyển,
  nguy cơ tự khóa mình nếu cấu hình sai VLAN quản trị)
- Cấu hình cũ: (dán các dòng liên quan)
- Cấu hình mới: (dán các dòng liên quan)
- Kế hoạch rollback: (làm gì nếu post-check thất bại)
```

### Example — English

```
Change:
- What's being changed: replace HQ core switch (Catalyst 3850) with a new
  9300, migrate OSPF Area 0 peering and HSRP
- Devices: Core-SW-OLD, Core-SW-NEW, Dist-SW1, Dist-SW2
- Known risks: only one uplink to Dist-SW1 exists during cutover (SPOF);
  both core switches briefly active on the same VLANs risks HSRP split-brain
- Old config: interface Vlan10 / standby 10 ip 10.10.10.1 / standby 10 priority 110
- New config: same, with standby priority lowered until cutover confirmed good
- Rollback: re-enable old core switch interfaces, shut new device uplinks
```

### Ví dụ — Tiếng Việt

```
Thay đổi:
- Nội dung thay đổi: thay core switch tại HQ (Catalyst 3850) bằng switch
  9300 mới, migrate OSPF Area 0 peering và HSRP
- Thiết bị: Core-SW-OLD, Core-SW-NEW, Dist-SW1, Dist-SW2
- Rủi ro đã biết: chỉ có 1 uplink duy nhất tới Dist-SW1 trong lúc cắt chuyển
  (SPOF); cả 2 core switch cùng active trên 1 VLAN trong thời gian ngắn có
  nguy cơ HSRP split-brain
- Cấu hình cũ: interface Vlan10 / standby 10 ip 10.10.10.1 / standby 10 priority 110
- Cấu hình mới: tương tự, hạ priority standby cho đến khi xác nhận cắt
  chuyển ổn định
- Rollback: bật lại interface trên core switch cũ, shutdown uplink switch mới
```

---

## 5. Automation Workflow

### Placeholder — English

```
Scenario:
- Tooling: (e.g. "Python + Netmiko", "Ansible playbook", "Terraform + REST API")
- Task: (e.g. "Push VLAN config to 3 switches via SSH, roll back any switch
  that returns an error")
- Failure mode to demonstrate: (e.g. "Timeout", "HTTP 404", "Invalid input
  detected", "auth failure") and how the script should recover (retry/skip/abort)
- Number of steps: (e.g. 6)
```

### Placeholder — Tiếng Việt

```
Kịch bản:
- Công cụ: (ví dụ: "Python + Netmiko", "Ansible playbook", "Terraform + REST API")
- Tác vụ: (ví dụ: "Đẩy cấu hình VLAN xuống 3 switch qua SSH, rollback switch
  nào trả về lỗi")
- Kiểu lỗi cần mô phỏng: (ví dụ: "Timeout", "HTTP 404", "Invalid input
  detected", "auth failure") và cách script nên phục hồi (retry/skip/abort)
- Số bước: (ví dụ: 6)
```

### Example — English

```
Scenario:
- Tooling: Python + Netmiko
- Task: push VLAN 50 to 3 access switches (SW1, SW2, SW3) over SSH
- Failure mode: SW2 times out (unreachable) — script should log it, skip,
  continue to SW3, then report SW2 for manual retry
- Steps: 5
```

### Ví dụ — Tiếng Việt

```
Kịch bản:
- Công cụ: Python + Netmiko
- Tác vụ: đẩy VLAN 50 xuống 3 switch access (SW1, SW2, SW3) qua SSH
- Kiểu lỗi: SW2 bị timeout (không kết nối được) — script cần log lại, bỏ
  qua, tiếp tục với SW3, sau đó báo cáo SW2 để retry thủ công
- Số bước: 5
```

---

## 6. Failover / HA Drill

### Placeholder — English

```
Scenario:
- Mechanism: (e.g. "HSRP", "VRRP", "ClusterXL", "BGP path manipulation")
- Nodes involved: (e.g. "R1 (Active), R2 (Standby)")
- Relevant timers: (e.g. Hello 3s, Hold 10s, Dead interval 40s)
- Trigger event: (e.g. "R1 loses power", "primary link severed")
- Risk to highlight: (e.g. split-brain, total outage vs degraded service)
```

### Placeholder — Tiếng Việt

```
Kịch bản:
- Cơ chế: (ví dụ: "HSRP", "VRRP", "ClusterXL", "BGP path manipulation")
- Node liên quan: (ví dụ: "R1 (Active), R2 (Standby)")
- Timer liên quan: (ví dụ: Hello 3s, Hold 10s, Dead interval 40s)
- Sự kiện kích hoạt: (ví dụ: "R1 mất điện", "đứt link chính")
- Rủi ro cần nêu bật: (ví dụ: split-brain, total outage hay degraded service)
```

### Example — English

```
Scenario:
- Mechanism: HSRP
- Nodes: R1 (Active, priority 110), R2 (Standby, priority 100)
- Timers: Hello 3s, Hold 10s
- Trigger event: R1 loses power
- Risk to highlight: ~10s of Degraded service (no default gateway) until R2
  takes over Active
```

### Ví dụ — Tiếng Việt

```
Kịch bản:
- Cơ chế: HSRP
- Node: R1 (Active, priority 110), R2 (Standby, priority 100)
- Timer: Hello 3s, Hold 10s
- Sự kiện kích hoạt: R1 mất điện
- Rủi ro cần nêu bật: ~10 giây Degraded service (mất default gateway) cho
  đến khi R2 chuyển thành Active
```

---

## 7. Topology Design Reference

### Placeholder — English

```
Network design:
- Routers: (hostname, Router ID/loopback, OSPF area membership)
- Links: (connected routers, interface, cost/bandwidth, network type)
- Areas: (area ID, type — backbone/standard/stub/NSSA/totally-stubby — and
  which routers belong to each)
- Redistribution/default routes, if any
```

### Placeholder — Tiếng Việt

```
Thiết kế mạng:
- Router: (hostname, Router ID/loopback, area OSPF)
- Link: (router kết nối, interface, cost/bandwidth, loại network)
- Area: (ID area, loại — backbone/standard/stub/NSSA/totally-stubby — và
  router nào thuộc area nào)
- Redistribution/default route nếu có
```

### Example — English

```
Network design:
- Routers: R1 (1.1.1.1, Area 0, ABR), R2 (2.2.2.2, Area 0), R3 (3.3.3.3, Area 1 - stub)
- Links: R1↔R2 Gi0/0 10.0.12.0/30 cost 1; R1↔R3 Gi0/1 10.0.13.0/30 cost 5
- Areas: Area 0 backbone (R1, R2); Area 1 stub (R1, R3)
- Redistribution: R1 injects a default route into Area 1 (standard stub behavior)
```

### Ví dụ — Tiếng Việt

```
Thiết kế mạng:
- Router: R1 (1.1.1.1, Area 0, ABR), R2 (2.2.2.2, Area 0), R3 (3.3.3.3, Area 1 - stub)
- Link: R1↔R2 Gi0/0 10.0.12.0/30 cost 1; R1↔R3 Gi0/1 10.0.13.0/30 cost 5
- Area: Area 0 backbone (R1, R2); Area 1 stub (R1, R3)
- Redistribution: R1 bơm default route vào Area 1 (hành vi chuẩn của stub area)
```

---

## 8. Diagnostic Playbook

### Placeholder — English

```
Subsystem & topology:
- Subsystem under diagnosis: (e.g. "DNS resolution on a flat LAN")
- Shared topology: (devices, IPs, roles — stays the same across every case)
- Cases to cover: (each KB case — name, what's broken, the diagnostic
  command(s) and exact output/exit code, 2-4 key takeaways)
```

### Placeholder — Tiếng Việt

```
Subsystem & topology:
- Subsystem đang chẩn đoán: (ví dụ: "DNS resolution trên một LAN phẳng")
- Topology dùng chung: (thiết bị, IP, vai trò — giữ nguyên qua mọi case)
- Các case cần bao phủ: (mỗi KB case — tên, lỗi gì, lệnh chẩn đoán và
  output/exit code cụ thể, 2-4 điểm ghi nhớ)
```

### Example — English

```
Subsystem & topology:
- Subsystem: DNS resolution on a flat LAN, 172.28.6.0/24, no router
- Topology: client (172.28.6.20, Debian/glibc) — dns (172.28.6.53, dnsmasq,
  zone lab.local) — web (172.28.6.10) — web-cu (172.28.6.11)
- Cases:
  - KB1 Healthy: resolv.conf points to .53; dig and curl both succeed
  - KB2 Unreachable: resolv.conf nameserver is 172.28.6.99 (no device there);
    dig times out after ~2035ms with no response; curl exits 28 (not 6 —
    easy to mistake for "server is slow"); query count at the real DNS
    server stays 0 the whole time
  - KB3 Refused: DNS server is up but its ACL denies this client's subnet;
    dig returns REFUSED immediately
  - KB4 NXDOMAIN: querying a name that doesn't exist in the zone; dig
    returns NXDOMAIN, not a timeout
  - KB5 Forwarder: dnsmasq's upstream forwarder is unreachable, so external
    names fail but lab.local names still resolve fine
  - KB6 Wrong IP: DNS returns the old server's IP (web-cu, .11) for "web" —
    a stale/duplicate A record, so curl succeeds but hits the wrong host
  - KB7 /etc/hosts: an entry in /etc/hosts shadows the DNS answer entirely,
    so dig is correct but curl still goes to the wrong place
  - KB8 nscd: nscd's cache is stale, serving an old resolution even though
    both /etc/hosts and DNS are now correct
```

### Ví dụ — Tiếng Việt

```
Subsystem & topology:
- Subsystem: DNS resolution trên một LAN phẳng, 172.28.6.0/24, không router
- Topology: client (172.28.6.20, Debian/glibc) — dns (172.28.6.53, dnsmasq,
  zone lab.local) — web (172.28.6.10) — web-cu (172.28.6.11)
- Các case:
  - KB1 Khoẻ: resolv.conf trỏ tới .53; dig và curl đều thành công
  - KB2 Không tới: resolv.conf trỏ nameserver 172.28.6.99 (không có máy nào ở
    đó); dig timed out sau ~2035ms, không ai trả lời; curl exit 28 (không
    phải 6 — dễ nhầm với "server chậm"); query tới DNS server thật vẫn là 0
    suốt quá trình
  - KB3 Từ chối: DNS server vẫn sống nhưng ACL từ chối subnet của client;
    dig trả về REFUSED ngay lập tức
  - KB4 NXDOMAIN: truy vấn một tên không tồn tại trong zone; dig trả về
    NXDOMAIN, không phải timeout
  - KB5 Forwarder: upstream forwarder của dnsmasq không tới được, nên tên
    ngoài internet lỗi nhưng tên trong lab.local vẫn phân giải bình thường
  - KB6 IP sai: DNS trả về IP của server cũ (web-cu, .11) cho tên "web" —
    một bản ghi A cũ/trùng, nên curl thành công nhưng vào nhầm máy
  - KB7 /etc/hosts: một dòng trong /etc/hosts che mất kết quả DNS, nên dig
    đúng nhưng curl vẫn đi nhầm chỗ
  - KB8 nscd: cache của nscd đã cũ, vẫn trả kết quả cũ dù /etc/hosts và DNS
    đều đã đúng
```
