# Prompt scenario reference

> **⚠️ GLOBAL SECURITY RULE:**
> The AI processing these prompts is instructed to **automatically scrub and anonymize** any real IPs, hostnames, VLAN IDs, or credentials you paste into the scenario block. You can safely paste real-world troubleshooting notes; the AI will replace them with dummy equivalents (like `10.x.x.x` or `FW-CORE`) in the generated output to ensure zero sensitive data is published.

Quick-copy reference for the part of each prompt that actually changes per use: the scenario/input block. The rest of each prompt (Tailwind/design-system requirements, JSON schema, header rules) is stable and lives in `docs/prompt-templates.md` — copy the full prompt from there, then swap in one of the blocks below.

For each of the 7 types: a blank **placeholder** (fill in your own details) and a **filled example** (a realistic case, ready to copy as-is or adapt).

**How to use:** paste the full prompt from `docs/prompt-templates.md` section N, then replace its `====...====` block with one of these.

---

## 1. Protocol Simulator

### Placeholder

```
Topic / Lab Scenario:
(Describe the protocol/concept, the devices involved, and the number of steps —
e.g. "OSPF Neighbor Adjacency between 2 Cisco routers, DOWN to FULL, 7 steps")
```

### Example

```
Topic / Lab Scenario:
RSTP electing a root bridge across 3 switches (SW1, SW2, SW3) in a triangle.
SW1 has the lowest priority and becomes Root. The SW2–SW3 link ends up
blocked. Show the elected root port moving Blocking → Listening → Learning
→ Forwarding. 6 steps.
```

---

## 2. Troubleshooting Lab

### Placeholder

```
Case:
- Symptom reported: (what the user/monitoring saw — e.g. "Branch office can't
  reach the file server; intermittent, started ~30 min ago")
- Topology / devices involved: (list devices, IPs, interfaces relevant to the case)
- Root cause: (what it turned out to be)
- Fix applied: (the actual command(s) or change that resolved it)
- Number of diagnostic steps: (e.g. 6)
```

### Example

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

---

## 3. Security Packet Walk

### Placeholder

```
Scenario:
- Firewall platform: (e.g. "Check Point", "FortiGate", "Palo Alto")
- Original packet: (src IP:port, dst IP:port, protocol)
- What happens to it: (NAT type if any, which policy rule matches, final verdict —
  e.g. "Client 10.1.1.5:51000 → Web server via DNAT to 192.168.1.10:443, allowed by Rule 12")
- Checkpoints to model: (e.g. Ingress Interface, Route Lookup, NAT, Security
  Policy, IPS/Anti-Virus, Egress Interface — adjust the list to the platform)
```

### Example

```
Scenario:
- Firewall platform: FortiGate
- Original packet: Client 203.0.113.45:51122 → Public VIP 198.51.100.10:443
- What happens: DNAT to internal server 10.10.5.20:443, matched by Policy
  ID 15 "Allow-WebDMZ", passes IPS profile, Accept
- Checkpoints: Ingress (wan1) → Route Lookup → DNAT → Security Policy → IPS → Egress (dmz1)
```

---

## 4. Change / MOP Flow

### Placeholder

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

### Example

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

---

## 5. Automation Workflow

### Placeholder

```
Scenario:
- Tooling: (e.g. "Python + Netmiko", "Ansible playbook", "Terraform + REST API")
- Task: (e.g. "Push VLAN config to 3 switches via SSH, roll back any switch
  that returns an error")
- Failure mode to demonstrate: (e.g. "Timeout", "HTTP 404", "Invalid input
  detected", "auth failure") and how the script should recover (retry/skip/abort)
- Number of steps: (e.g. 6)
```

### Example

```
Scenario:
- Tooling: Python + Netmiko
- Task: push VLAN 50 to 3 access switches (SW1, SW2, SW3) over SSH
- Failure mode: SW2 times out (unreachable) — script should log it, skip,
  continue to SW3, then report SW2 for manual retry
- Steps: 5
```

---

## 6. Failover / HA Drill

### Placeholder

```
Scenario:
- Mechanism: (e.g. "HSRP", "VRRP", "ClusterXL", "BGP path manipulation")
- Nodes involved: (e.g. "R1 (Active), R2 (Standby)")
- Relevant timers: (e.g. Hello 3s, Hold 10s, Dead interval 40s)
- Trigger event: (e.g. "R1 loses power", "primary link severed")
- Risk to highlight: (e.g. split-brain, total outage vs degraded service)
```

### Example

```
Scenario:
- Mechanism: HSRP
- Nodes: R1 (Active, priority 110), R2 (Standby, priority 100)
- Timers: Hello 3s, Hold 10s
- Trigger event: R1 loses power
- Risk to highlight: ~10s of Degraded service (no default gateway) until R2
  takes over Active
```

---

## 7. Topology Design Reference

### Placeholder

```
Network design:
- Routers: (hostname, Router ID/loopback, OSPF area membership)
- Links: (connected routers, interface, cost/bandwidth, network type)
- Areas: (area ID, type — backbone/standard/stub/NSSA/totally-stubby — and
  which routers belong to each)
- Redistribution/default routes, if any
```

### Example

```
Network design:
- Routers: R1 (1.1.1.1, Area 0, ABR), R2 (2.2.2.2, Area 0), R3 (3.3.3.3, Area 1 - stub)
- Links: R1↔R2 Gi0/0 10.0.12.0/30 cost 1; R1↔R3 Gi0/1 10.0.13.0/30 cost 5
- Areas: Area 0 backbone (R1, R2); Area 1 stub (R1, R3)
- Redistribution: R1 injects a default route into Area 1 (standard stub behavior)
```

---

## 8. Diagnostic Playbook

### Placeholder

```
Subsystem & topology:
- Subsystem under diagnosis: (e.g. "DNS resolution on a flat LAN")
- Shared topology: (devices, IPs, roles — stays the same across every case)
- Cases to cover: (each KB case — name, what's broken, the diagnostic
  command(s) and exact output/exit code, 2-4 key takeaways)
```

### Example

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
