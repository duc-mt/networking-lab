# Prompt templates

> **⚠️ GLOBAL SECURITY RULE (MUST ENFORCE):**
> **Even if the user provides real IPs, real hostnames, real MAC addresses, or sensitive customer data in their scenario prompt, YOU (the AI) MUST automatically scrub and anonymize all of it before generating the HTML output.**
>
> - Automatically replace real IPs with dummy IPs (e.g., `10.x.x.x`, `192.168.x.x`, `1.1.1.1`).
> - Automatically replace real hostnames with generic names (e.g., `FW-CORE`, `SW-ACCESS-01`, `R1`).
> - Automatically replace real MACs with dummy MACs (e.g., `00:00:5e:00:01:xx`).
> - Automatically replace real VLAN IDs with dummy VLANs (e.g., `VLAN 10`, `VLAN 20`).
> - Automatically mask any domain names, passwords, or credentials.
>   NEVER output the user's real raw data in the final code. This applies to ALL 8 prompt templates below.

Eight reusable prompts for generating new labs that drop straight into this portfolio. Each targets a different shape of networking/security work and produces a different UI pattern — a state machine, a logic tree, a pipeline, a workflow with tabs, a split-screen, a trigger-driven drill, a static reference graph, or a tabbed failure-mode catalog. All of them still produce a single self-contained HTML file matching the site's existing design system (Tailwind CDN, dark-mode class, Inter + Fira Code, Font Awesome, slate/blue/indigo palette, rounded-2xl SaaS cards).

For a quick-copy version of just the scenario/input block of each prompt — blank placeholder and a filled realistic example, both in English and Vietnamese — see `docs/prompt-scenarios.md`.

The site is organized around these 8 formats directly: each one has its own folder under `projects/`, and each project's `type` field in `assets/js/projects.js` (which must be one of the keys below) controls its icon, color, and which filter chip it falls under on the homepage — you don't set icon/color per project, they're inherited from the type.

After generating a page with any of these prompts:

1. Save it under the matching folder: `projects/<type>/<slug>.html` (see the table below for the folder name).
2. Add the two shared includes to its `<head>`, and remove any duplicate CSS the generated page may have invented for these (keep only styles specific to this lab — the topology/animation CSS, not the base scrollbar/transition rules):
    ```html
    <!-- Apply the saved theme before first paint, to avoid a flash of the wrong theme -->
    <script src="../../assets/js/theme-init.js"></script>
    ...
    <!-- Shared theme CSS (identical across every page) -->
    <link rel="stylesheet" href="../../assets/css/theme.css" />
    ```
    The AI generating the lab won't know these files exist, so it will likely write its own equivalent no-FOUC script and scrollbar/transition CSS inline — after generating, delete that duplicated block and replace it with the two includes above (same swap as was done for `ospf-adjacency.html`).
3. Add the small back-link block to its header — since project pages live two levels deep, it points to `../../index.html`, not `../index.html`. Copy the whole header block from `projects/protocol/ospf-adjacency.html` and adjust the title.
4. Add one entry to `assets/js/projects.js` with `type` set to the matching key, plus a `topic` (the subject domain — "Routing", "Switching", "Security", "Automation", or a new one if it doesn't fit an existing value) — see that file's own comments for the full schema (`dateAdded` drives the "Newest" sort).

## Which one to reach for

| Prompt                    | `type` key            | Folder                          | Core engine logic                                                   | Best used for                                                                                     |
| ------------------------- | --------------------- | ------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Protocol Simulator        | `protocol`            | `projects/protocol/`            | Timeline of states, packet/RFC breakdown                            | Training material, explaining how a protocol works internally                                     |
| Troubleshooting Lab       | `troubleshooting`     | `projects/troubleshooting/`     | Logic tree — symptom → ruled-out hypotheses → root cause            | Post-mortems, incident write-ups, knowledge base, portfolio case studies                          |
| Security Packet Walk      | `packet-walk`         | `projects/packet-walk/`         | Sequential pipeline — Ingress → NAT → Policy → Egress               | Debugging firewall/NAT behavior, explaining zone design, policy audits                            |
| Change / MOP Flow         | `change-mop`          | `projects/change-mop/`          | Process — Pre-checks → Execution → Post-checks → Rollback           | Cutover planning, risk review (SPOF, lockout), documenting a maintenance window                   |
| Automation Workflow       | `automation`          | `projects/automation/`          | API/script request-response, error handling                         | Reviewing automation code, demonstrating retry/error-handling logic                               |
| Failover / HA Drill       | `failover`            | `projects/failover/`            | Trigger → timers → convergence → impact                             | Chaos-engineering style resilience testing, tuning Hello/Hold/Dead timers                         |
| Topology Design Reference | `topology-design`     | `projects/topology-design/`     | Static graph — topology + routing tables + path lookup, no timeline | Documenting a network design, showcasing addressing/area layout, reference material               |
| Diagnostic Playbook       | `diagnostic-playbook` | `projects/diagnostic-playbook/` | Tabbed catalog — N static failure snapshots on one shared topology  | A "field guide" of failure signatures for one subsystem (e.g. every way DNS resolution can break) |

---

## 1. Protocol / concept simulator

Use this for "how does X actually work" labs — a protocol forming state over time (OSPF, STP, DHCP, TCP handshake, BGP peering, etc).

```
Act as a Principal Network Architect and Senior UI/UX Frontend Engineer.

I want you to build a premium, single-file "Interactive Network Protocol Simulator"
to visualize a network lab scenario, matching the existing design system of my
portfolio (Tailwind CDN with darkMode:'class', Inter + Fira Code fonts, Font
Awesome icons via the CSS <link> build, slate/blue/indigo palette, rounded-2xl
cards, sticky header with playback controls).

The output MUST be a SINGLE self-contained HTML file: inline CSS (Tailwind via
CDN + custom keyframes) and inline vanilla JavaScript. No external files besides
the standard CDN includes already used across the site.

==================================================
Topic / Lab Scenario:
(Describe the protocol/concept, the devices involved, and the number of steps —
e.g. "OSPF Neighbor Adjacency between 2 Cisco routers, DOWN to FULL, 7 steps")
==================================================

Requirements:
1. Core engine: a Javascript array `labTimeline`, one object per step:
   { step, time, phase, title, description, cli_logs,
     nodes: { <DeviceID>: { label, state, role, color } , ... },
     links: [ { source: "R1", target: "R2", state: "UP" } ], // List active links
     link_state: "Global topology status text",
     animated_packet: { from: "R1", to: "R2", label, color, icon, packet_decode: { field: value } | null } | null }
   CRITICAL: You MUST use ES6 Template Literals (backticks `) instead of standard quotes (" or ') for ANY multi-line string properties (specifically `description` and `cli_logs`) to prevent JS syntax errors from unescaped newlines.

2. Header: sticky at the top, containing the logo badge + "← Portfolio" link back to
   ../../index.html on the left, AND the full suite of playback controls (⏮ ▶/⏸ ⏭ ↺)
   + theme toggle (🌓) grouped together on the right side of the header. Do NOT put
   playback controls in the main body/stepper area.

3. Multi-Node Visual topology Engine (CRITICAL):
   - The topology area must be a `relative` canvas container (e.g. `min-h-[450px] w-full`).
   - Nodes (cards) must be `absolute` positioned. Set their `left` and `top` coordinates (e.g. using percentages) so they form a proper layout (e.g. triangle for 3 nodes, diamond for 4).
   - Links: Draw SVG lines `<svg>` in the background connecting the nodes based on the `links` array. Update link colors dynamically if their state changes.
   - Dynamic Packet Animation: Do NOT use hardcoded CSS `@keyframes` (like `animate-lr`). Use the JavaScript Web Animations API (`element.animate()`) inside `handlePacketAnimation(packetData)`. Dynamically calculate the center (X, Y) of the `from` node and the `to` node, and animate the packet moving from start X,Y to end X,Y.

4. Interactive timeline stepper: must be located inside the main body container
   (NOT in the header). It should be a horizontal bar with a progress line behind it,
   and the step buttons must contain the step title (e.g. `1. INIT`, `2. 2-WAY`)
   visible on desktop (hidden on mobile), active step highlighted, clickable.

5. Terminal/CLI window: dark, monospace, Mac-style traffic-light dots,
   rendering `cli_logs` for the current step.

6. Device state cards: role, interface, and state per device, color-coded
   (green = stable/up, red = down/error, amber/orange = transitioning).

7. Theme: persist the choice via `localStorage.getItem/setItem('portfolio-theme')`,
   and apply it in a tiny synchronous script at the very top of <head> (before
   Tailwind loads) so there's no flash of the wrong theme on load.

8. All visible UI text in Vietnamese.

Generate the complete HTML code, with `labTimeline` fully populated with
accurate, detailed technical data for the specified topic.
```

---

## 2. Troubleshooting simulator

Use this one for a real incident you just solved — turn the diagnostic process itself into a lab: symptom → hypotheses → elimination → root cause → fix → verification. This is the one to reach for right after closing a ticket, while the details are fresh.

```
Act as a Principal Network Architect and Senior UI/UX Frontend Engineer.

Build a single-file "Interactive Troubleshooting Simulator" that walks through
a real network troubleshooting case, in the same visual style as my other
project pages (Tailwind CDN darkMode:'class', Inter + Fira Code, Font Awesome
CSS build, slate/blue/indigo palette, rounded-2xl cards, sticky header with
playback controls and a "← Portfolio" back-link to ../../index.html).

Output: ONE self-contained HTML file, inline CSS + vanilla JS only.

==================================================
Case:
- Symptom reported: (what the user/monitoring saw — e.g. "Branch office can't
  reach the file server; intermittent, started ~30 min ago")
- Topology / devices involved: (list devices, IPs, interfaces relevant to the case)
- Root cause: (what it turned out to be)
- Fix applied: (the actual command(s) or change that resolved it)
- Number of diagnostic steps: (e.g. 6)
==================================================

Requirements:
1. Core engine: a JSON array `troubleshootingTimeline`, one object per step:
   { step, time, phase,              // phase e.g. "Triage", "Isolate", "Root Cause", "Fix", "Verify"
     action,                          // what the engineer does this step, in plain language
     cli_logs,                        // the actual commands run + realistic output
     hypotheses: [                    // running list of possible causes
        { cause: "...", status: "investigating" | "ruled_out" | "confirmed" }
     ],
     nodes: { <DeviceName>: { state, note, color } }, // Update colors dynamically (Red -> Green) as hypotheses are eliminated to create a visual "isolate" heatmap
     links: { <LinkId>: { state, color } },
     root_cause: null | "...",        // filled in once found
     fix_applied: null | "..." }

2. Header: same as other project pages (logo, "← Portfolio" link, playback
   controls, theme toggle with localStorage persistence + no-FOUC head script).

3. Diagnosis panel: a running checklist of hypotheses for the current step —
   ruled-out ones struck through/greyed, the confirmed one highlighted green.
   This is the section that makes a troubleshooting lab different from a
   protocol-state lab — the story is elimination, not a fixed state machine.

4. Topology view: the affected devices/segments, with a visual fault
   indicator (red highlight/pulse) on whatever is actually broken, updating
   as the investigation narrows in.

5. Timeline stepper + CLI terminal: same pattern as existing labs.

6. Final step: show root cause + fix + a "verification" command/output
   proving it's resolved.

7. All visible UI text in Vietnamese.

Populate `troubleshootingTimeline` with realistic, detailed CLI output and a
believable sequence of ruled-out hypotheses before landing on the real cause.
```

---

## 3. Security packet walk simulator

Use this for firewall/NAT/policy behavior — anything where a packet is transformed as it crosses a device (Check Point, Fortinet, Palo Alto, ASA). A protocol-state lab can't show this because nothing about the packet itself changes over time in that model; here the packet changes as it moves through checkpoints on a single pass.

```
Act as a Principal Security Architect and Senior UI/UX Frontend Engineer.

Build a single-file "Interactive Packet Walk Simulator" that traces one packet
through a firewall's processing pipeline, in the same visual style as my other
project pages (Tailwind CDN darkMode:'class', Inter + Fira Code, Font Awesome
CSS build, slate/blue/indigo palette, rounded-2xl cards, sticky header with
playback controls and a "← Portfolio" back-link to ../../index.html).

Output: ONE self-contained HTML file, inline CSS + vanilla JS only.

==================================================
Scenario:
- Firewall platform: (e.g. "Check Point", "FortiGate", "Palo Alto")
- Original packet: (src IP:port, dst IP:port, protocol)
- What happens to it: (NAT type if any, which policy rule matches, final verdict —
  e.g. "Client 10.1.1.5:51000 → Web server via DNAT to 192.168.1.10:443, allowed by Rule 12")
- Checkpoints to model: (e.g. Ingress Interface, Route Lookup, NAT, Security
  Policy, IPS/Anti-Virus, Egress Interface — adjust the list to the platform)
==================================================

Requirements:
1. Core engine: a JSON array `packetWalkTimeline`, one object per checkpoint:
   { checkpoint, stage,               // e.g. "Ingress Interface", "NAT", "Security Policy"
     direction: "forward" | "return", // to model asymmetric routing or stateful return drops
     device,
     packet_before: { src_ip, src_port, dst_ip, dst_port, protocol, tcp_flags },
     packet_after:  { src_ip, src_port, dst_ip, dst_port, protocol, tcp_flags },
     nat_applied: { type: "SNAT" | "DNAT" | null, original, translated } | null,
     policy_match: { rule_id, rule_name, action: "Accept" | "Deny" | "Drop" } | null,
     session_table: { conn_id, state: "New" | "Established" | "Closing" },
     log_line,
     verdict: "pass" | "drop" | "deny" }

2. Header: same pattern as other project pages (logo, back-link, playback
   controls, theme toggle with localStorage persistence + no-FOUC head script).

3. Pipeline view (the centerpiece — different from the topology view used in
   other labs): checkpoints laid out left-to-right as a horizontal pipeline
   (Ingress → Route Lookup → NAT → Policy → IPS/AV → Egress). The current
   checkpoint is highlighted; the packet is a token that visibly moves along
   the pipeline as steps advance.

4. Packet inspector panel: shows `packet_before` vs `packet_after` side by
   side for the current checkpoint. When NAT applies, show the original value
   struck through next to the translated value.

5. Policy/log panel: when a checkpoint has a `policy_match`, show the rule ID
   and name; render a running log list of Accept/Deny/Drop lines color-coded
   green/red/amber, matching `log_line` + `verdict` for each checkpoint reached.

6. If `verdict` is "drop" or "deny" at some checkpoint, the pipeline visually
   stops there (later checkpoints greyed out, not reachable) — the packet
   doesn't proceed past the point it was actually dropped.

7. Timeline stepper + theme toggle: same pattern as existing labs.

8. All visible UI text in Vietnamese.

Populate `packetWalkTimeline` with a realistic, platform-appropriate sequence
for the given scenario, including believable rule IDs and session states.
```

---

## 4. Change management / MOP simulator

Use this for a planned cutover or change request — replacing a core switch, migrating BGP/OSPF, any maintenance window where the point is the _process_, not a protocol animating on its own.

```
Act as a Principal Network Architect and Senior UI/UX Frontend Engineer.

Build a single-file "Interactive Change Management (MOP) Simulator" that
documents a planned network change, in the same visual style as my other
project pages (Tailwind CDN darkMode:'class', Inter + Fira Code, Font Awesome
CSS build, slate/blue/indigo palette, rounded-2xl cards, sticky header and a
"← Portfolio" back-link to ../../index.html).

Output: ONE self-contained HTML file, inline CSS + vanilla JS only.

==================================================
Change:
- What's being changed: (e.g. "Replace Core Switch A with a new Nexus 9300,
  migrate OSPF area 0 peering")
- Devices involved:
- Known risks: (e.g. single point of failure during cutover, risk of
  self-lockout if the management VLAN is misconfigured)
- Old config snippet: (paste relevant lines)
- New config snippet: (paste relevant lines)
- Rollback plan: (what to do if post-checks fail)
==================================================

Requirements:
1. Core engine: a JSON object with four arrays instead of one timeline —
   this is a process with named phases, not a single sequence:
   {
     preChecks:  [ { id, description, command, expected_result, status } ],
     execution:  [ { id, description, command, output, risk_flag: null | "SPOF" | "Lockout risk" } ],
     postChecks: [ { id, description, command, expected_result, actual_result, status: "pass" | "fail" | "pending" } ],
     rollback:   [ { id, description, command } ]
   }

2. Header: same pattern as other project pages (logo, back-link, theme toggle
   with localStorage persistence + no-FOUC head script). No playback timeline
   stepper here — this lab is navigated by tab, not by step/time.

3. Three-tab (or three-column) layout: Pre-Checks → Execution → Post-Checks.
   Each item in a tab shows its command, expected result, and a status badge
   (pending/pass/fail) the person can toggle to simulate walking the MOP live.

4. Stop-condition banner: if any `execution` item has a non-null `risk_flag`,
   render a persistent red warning banner ("⚠ SPOF risk" / "⚠ Lockout risk")
   above the Execution tab that cannot be dismissed silently — it should
   visually demand acknowledgment before the person can mark that step done.

5. Config diff viewer: a side-by-side diff view of the old vs new
   config snippets. Ensure the column headers (e.g. "Baseline" and "Target")
   are properly centered above their respective columns. Added lines are
   highlighted green and removed lines highlighted red/strikethrough (a simple
   line-by-line diff is fine).

6. Rollback tab: hidden/collapsed by default, auto-expands and is highlighted
   if any `postChecks` item has `status: "fail"`.

7. All visible UI text in Vietnamese.

Populate all four arrays with realistic, detailed commands and outputs for
the given change.
```

---

## 5. Automation workflow simulator

Use this for scripting/API work (Netmiko, NAPALM, Ansible, Terraform) where the point of failure is usually the script logic or payload, not the network protocol itself.

```
Act as a Principal Network Automation Engineer and Senior UI/UX Frontend Engineer.

Build a single-file "Interactive Automation Workflow Simulator" that walks
through a script/API interaction with network devices, in the same visual
style as my other project pages (Tailwind CDN darkMode:'class', Inter + Fira
Code, Font Awesome CSS build, slate/blue/indigo palette, rounded-2xl cards,
sticky header with playback controls and a "← Portfolio" back-link to
../../index.html).

Output: ONE self-contained HTML file, inline CSS + vanilla JS only.

==================================================
Scenario:
- Tooling: (e.g. "Python + Netmiko", "Ansible playbook", "Terraform + REST API")
- Task: (e.g. "Push VLAN config to 3 switches via SSH, roll back any switch
  that returns an error")
- Failure mode to demonstrate: (e.g. "Timeout", "HTTP 404", "Invalid input
  detected", "auth failure") and how the script should recover (retry/skip/abort)
- Number of steps: (e.g. 6)
==================================================

Requirements:
1. Core engine: a JSON array `automationTimeline`, one object per step:
   { step, phase,                     // e.g. "Build Payload", "Send Request", "Receive Response", "Error", "Retry", "Success"
     script_snippet,                  // pseudocode/real snippet for this step, current line markable
     payload,                         // JSON payload or CLI command being sent, as a string
     device_response,                 // raw response/output for this step
     transport_metadata,              // e.g. HTTP status 404, SSH negotiation state
     status: "success" | "error" | "retrying",
     error_type: null | "Timeout" | "HTTP 404" | "Invalid input detected" | "Auth failure",
     retry_count }

2. Header: same pattern as other project pages (logo, back-link, playback
   controls, theme toggle with localStorage persistence + no-FOUC head script).

3. Split-screen layout (the centerpiece): left pane is the "Script/Controller"
   — a code block showing `script_snippet` with the currently-executing line
   highlighted, plus the `payload` rendered as formatted JSON/CLI below it.
   Right pane is the "Device/API Terminal" showing `device_response` as raw
   output, styled like the CLI terminal used in other labs.

4. Error handling emphasis: when a step's `status` is "error" or "retrying",
   show a distinct red/amber banner over the script pane highlighting the
   `try/except` (or equivalent) block conceptually catching it, and show
   `retry_count` incrementing visually across retried steps.

5. Secrets handling: any IP address, token, password, or credential in
   `script_snippet` or `payload` MUST be shown as a placeholder variable
   (e.g. `{{DEVICE_IP}}`, `{{API_TOKEN}}`) or masked (`••••••••`) — never a
   real-looking value, even as a fictional example, to model good practice.

6. Timeline stepper: same horizontal step pattern as existing labs, but
   labeled by `phase` rather than a device state.

7. All visible UI text in Vietnamese.

Populate `automationTimeline` with a realistic script/payload/response
sequence for the given tooling and failure mode, including a believable
recovery path (retry, skip, or clean abort).
```

---

## 6. Failover / HA / disaster recovery simulator

Use this for resilience mechanisms — VRRP, HSRP, ClusterXL, BGP path manipulation — where the point is convergence time and behavior under an induced failure, not a steady-state walkthrough.

```
Act as a Principal Network Architect and Senior UI/UX Frontend Engineer.

Build a single-file "Interactive Failover / HA Simulator" that demonstrates a
resilience mechanism recovering from an induced outage, in the same visual
style as my other project pages (Tailwind CDN darkMode:'class', Inter + Fira
Code, Font Awesome CSS build, slate/blue/indigo palette, rounded-2xl cards,
sticky header and a "← Portfolio" back-link to ../../index.html).

Output: ONE self-contained HTML file, inline CSS + vanilla JS only.

==================================================
Scenario:
- Mechanism: (e.g. "HSRP", "VRRP", "ClusterXL", "BGP path manipulation")
- Nodes involved: (e.g. "R1 (Active), R2 (Standby)")
- Relevant timers: (e.g. Hello 3s, Hold 10s, Dead interval 40s)
- Trigger event: (e.g. "R1 loses power", "primary link severed")
- Risk to highlight: (e.g. split-brain, total outage vs degraded service)
==================================================

Requirements:
1. Core engine: a JSON array `failoverTimeline`, one object per step:
   { step, time, event,               // e.g. "Steady State", "Outage Triggered", "Detection", "Election", "Converged"
     nodes: { <NodeName>: { role: "Active" | "Standby" | "Down", state, color } },
     timer: { name, remaining_seconds } | null,   // the countdown relevant at this step
     impact: "None" | "Degraded" | "Total Outage",
     impact_scope,                    // plain-language description of who/what is affected
     split_brain_risk: boolean }

2. Header: same pattern as other project pages (logo, back-link, theme toggle
   with localStorage persistence + no-FOUC head script).

3. "Trigger Outage" control: a prominent, visually distinct red button
   (not part of the normal ⏮ ▶/⏸ ⏭ playback controls) that starts the
   failure sequence from the steady-state step. Before it's pressed, the lab
   sits on step 0 (steady state) indefinitely rather than auto-playing.

4. Live timer display: when a step has a `timer`, render it as a visibly
   counting-down bar or numeric countdown (doesn't need to be perfectly real
   time — animating down over ~1-2 seconds per step is fine) labeled with the
   timer's name (Hello/Hold/Dead/etc).

5. Role/state visualization: node cards that visually swap Active/Standby
   badges with a clear handoff animation at the moment failover completes;
   the failed node shown greyed out/red. Also include a Data Plane Reroute Animation (e.g., animated particles/stream from Client to Server) that visually stops, waits, and then bends to the backup path upon convergence.

6. Impact banner: color-coded by `impact` (green=None, amber=Degraded,
   red=Total Outage), with `impact_scope` text explaining who's affected.
   If `split_brain_risk` is true at any step, show an additional distinct
   warning badge for it.

7. Timeline stepper (usable after the outage is triggered) + theme toggle:
   same pattern as existing labs.

8. All visible UI text in Vietnamese.

Populate `failoverTimeline` with realistic timer values and a believable
convergence sequence for the given mechanism and trigger event.
```

---

## 7. Topology design reference

Use this one when there's no time dimension at all — you're documenting a network _design_, not a process or an event. The dashboard shows the whole topology, every device's routing table, and a path-lookup tool, all at once. No playback controls, because nothing changes over time here.

```
Act as a Principal Network Architect and Senior UI/UX Frontend Engineer.

Build a single-file "Interactive Topology Design Reference" — a static (non-
animated) dashboard for exploring a fully-designed OSPF network: the topology
map, per-device routing tables, area structure, and a path lookup tool, all
viewable at once rather than as a time-based animation. Match the visual
style of my other project pages (Tailwind CDN darkMode:'class', Inter + Fira
Code, Font Awesome CSS build, slate/blue/indigo palette, rounded-2xl cards)
and include the two shared includes used across the site:

    <link rel="stylesheet" href="../../assets/css/theme.css">
    <script src="../../assets/js/theme-init.js"></script>

plus the "← Portfolio" back-link to ../../index.html in the header. Do NOT
include playback controls (⏮ ▶/⏸ ⏭ ↺) — there's no time axis in this format.

Output: ONE self-contained HTML file, inline CSS + vanilla JS only (aside
from the two shared includes above).

==================================================
Network design:
- Routers: (hostname, Router ID/loopback, OSPF area membership — e.g.
  "R1 (1.1.1.1) - Area 0", "R2 (2.2.2.2) - Area 0", "R3 (3.3.3.3) - Area 1 (stub)")
- Links: (connected routers, interface, cost/bandwidth, network type — e.g.
  "R1 Gi0/0 <-> R2 Gi0/0, 10.1.1.0/30, cost 1, point-to-point")
- Areas: (area ID, type — backbone/standard/stub/NSSA/totally-stubby — and
  which routers belong to each)
- Redistribution/default routes, if any (e.g. "R3 is an ABR injecting a
  default route into Area 1")
==================================================

Requirements:
1. Core data — no timeline; structure this as topology data, not steps:
   `topology`: { nodes: [{ id, name, routerId, area, role }],
                 links: [{ from, to, cost, bandwidth, type, network }] }
   `areas`: [{ id, label, type, color }]
   `routingTables`: { <nodeId>: [{ network, mask, type: "O"|"O IA"|"C"|"D"|"S", nextHop, metric }] }

2. Header: logo + "← Portfolio" back-link + theme toggle only (no playback
   controls). Optional: a small legend showing each area's color.

3. Topology map (centerpiece): all routers as an interactive diagram, links
   labeled with cost, OSPF areas visually grouped (colored zone per area,
   the backbone Area 0 visually distinct). Clicking a router opens an
   inspector panel; clicking a link shows its cost/bandwidth/network type.

4. Device inspector panel: on selecting a router, show its Router ID, area,
   interfaces, and full routing table — styled like the dark, monospace
   CLI panels used elsewhere on the site.

5. Path lookup tool: two dropdowns (source, destination) + a "Trace Path"
   button. On click, compute the lowest-cost path across the topology
   (implement a simple Dijkstra over the `links` cost data in vanilla JS),
   highlight it on the map, and list the ordered hops with cumulative cost.
   This is what keeps a static dashboard interactive rather than a picture.

6. Area legend/filter: let the viewer dim or hide areas, so a larger
   multi-area design stays readable.

7. All visible UI text in Vietnamese.

Populate `topology`, `areas`, and `routingTables` with data that's actually
consistent with the design given above — routing tables should reflect real
OSPF behavior (e.g. a router in Area 1 shows "O IA" for prefixes learned
from outside its own area, not "O").
```

---

## 8. Diagnostic playbook

Use this one for a "field guide" of failure modes — not one incident, but every way a subsystem can break, catalogued side by side on the same topology so a viewer can flip through them. This is the format the "Network Bắt Bệnh" DNS lab (KB1 healthy → KB8 nscd) is built from: same LAN, same client/server layout in every tab, only the fault and the diagnostic evidence change.

```
Act as a Principal Network Architect and Senior UI/UX Frontend Engineer.

Build a single-file "Interactive Diagnostic Playbook" — a tabbed reference
dashboard cataloging multiple distinct failure modes of the same subsystem on
one shared topology (e.g. "every way DNS resolution can break" on one LAN),
so a viewer can flip between "KB" cases and see, for each one, the same
topology re-rendered with that specific fault highlighted, plus the
diagnostic command output and takeaways for that case. This is NOT a
timeline — each case is a static snapshot; switching tabs, not stepping
through time, is the interaction. Match the visual style of my other project
pages (Tailwind CDN darkMode:'class', Inter + Fira Code, Font Awesome CSS
build, slate/blue/indigo palette, rounded-2xl cards) and include the two
shared includes used across the site:

    <link rel="stylesheet" href="../../assets/css/theme.css">
    <script src="../../assets/js/theme-init.js"></script>

plus the "← Portfolio" back-link to ../../index.html in the header. No
playback controls (⏮ ▶/⏸ ⏭ ↺) — this format is tab-driven, not time-driven.

Output: ONE self-contained HTML file, inline CSS + vanilla JS only (aside
from the two shared includes above).

==================================================
Subsystem & topology:
- Subsystem under diagnosis: (e.g. "DNS resolution on a flat LAN")
- Shared topology: (devices, IPs, roles — this stays the same across every
  case; only which link/node is "sick" changes per case)
- Cases to cover: (list each KB case with: name, what's broken, the
  diagnostic command(s) and their exact output/exit code, and 2-4 key
  takeaways — e.g. "KB2 Unreachable: DNS server IP is wrong in resolv.conf
  (172.28.6.99, no device there); dig times out after ~2000ms with no
  response; curl exits 28, not 6 — easy to mistake for 'server is slow'")
==================================================

Requirements:
1. Core data — one entry per case, not a timeline:
   `playbookCases`: [{
     id, label,                        // e.g. "kb2", "KB2 Không tới"
     status: "healthy" | "broken",
     topology: {
       nodes: [{ id, name, ip, role }],
       links: [{ from, to, state: "ok" | "broken" | "no-response", note }]
     },
     diagnostics: {
       baseline_config: "...",         // the "known good" standard for side-by-side diff comparison
       current_config: "...",          // e.g. resolv.conf contents for this broken case
       commands: [{ cmd, output, verdict }]   // dig/curl/etc with realistic output
     },
     takeaways: ["...", "...", "..."]
   }]

2. Header: logo + back-link + theme toggle only (no playback controls).

3. Shared topology diagram: renders once, positions fixed across all cases,
   but redraws link/node color and adds an X/broken marker per the active
   case's `topology.links[].state` — this is what makes switching tabs feel
   like flipping through variants of one picture, not loading unrelated
   screens.

4. Legend row: explain the visual language once (e.g. solid arrow = healthy
   query path, dashed red = broken path, ⊗ = no response, dotted box = an
   address with no device behind it).

5. KB tab row: one pill per case, each showing its `label` and a status dot
   (green = healthy, red/orange = broken), active tab visually highlighted.
   Clicking a tab swaps the topology state, diagnostics, and takeaways below.

6. Detail panel below the tabs, two columns: left = config/script snippet
   and command output in a dark monospace terminal block; right = the
   `takeaways` as a bullet list.

7. All visible UI text in Vietnamese.

Populate `playbookCases` with technically accurate command output for each
case — exit codes, timing, and DNS response codes should be realistic and
internally consistent with what's "broken" in that case.
```

---

## 9. Mode Toggle (Bộ chuyển chế độ)

> **Quy tắc tự động quyết định:** Khi thiết kế một lab mới, AI phải tự đánh giá xem có nên bổ sung Mode Toggle hay không dựa trên tiêu chí sau — **không cần hỏi người dùng**.

### Khi nào NÊN dùng Mode Toggle

Dùng khi lab có **≥ 2 biến thể/chế độ** thể hiện **cùng một topology nhưng hành vi khác nhau**, và người dùng cần so sánh trực tiếp. Ví dụ:

| Ngữ cảnh                            | Nên Toggle? | Lý do                                                     |
| ----------------------------------- | ----------- | --------------------------------------------------------- |
| DHCP Local vs DHCP Relay            | ✅ Có       | Cùng thiết bị, nhưng số node và packet flow khác nhau     |
| STP vs PVST+ vs RSTP vs MSTP        | ✅ Có       | Cùng topology tam giác, nhưng cơ chế chặn cáp khác nhau   |
| OSPF P2P vs Broadcast               | ✅ Có       | Cùng 2 router, nhưng DR/BDR election và LSDB khác         |
| BGP iBGP vs eBGP                    | ✅ Có       | Cùng router pair, nhưng AS path và next-hop khác          |
| NAT Static vs PAT (Overload)        | ✅ Có       | Cùng topology, nhưng translation table và port usage khác |
| OSPF Adjacency (7 bước FSM)         | ❌ Không    | Chỉ có 1 kịch bản, dùng stepper thông thường              |
| BGP FSM (5 trạng thái)              | ❌ Không    | Tuyến tính, không có biến thể để so sánh                  |
| Troubleshooting / MOP / Packet Walk | ❌ Không    | Các bước tuyến tính theo thời gian, không có "chế độ"     |

### Khi nào KHÔNG nên dùng

- Lab chỉ có **1 kịch bản tuyến tính** → dùng Stepper thông thường.
- Các biến thể có **topology hoàn toàn khác nhau** (số lượng node chênh lệch nhiều) → tạo 2 lab riêng.
- Có **> 5 biến thể** → dùng KB Tabs (Diagnostic Playbook format) thay vì Toggle.

---

### Form HTML chuẩn (copy y chang, không sáng tạo thêm)

Đặt ngay **phía trên** section Timeline Stepper, bên trong `<main>`:

```html
<!-- Mode Toggle — chỉ dùng khi có >= 2 chế độ/biến thể -->
<div class="flex items-center justify-center">
    <div
        class="flex flex-wrap justify-center items-center bg-slate-200/50 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700"
    >
        <button
            id="mode-btn-A"
            onclick="app.switchMode('A')"
            class="mode-btn px-5 py-2 text-sm font-bold rounded-md transition-all"
        >
            Tên Chế Độ A
        </button>
        <button
            id="mode-btn-B"
            onclick="app.switchMode('B')"
            class="mode-btn px-5 py-2 text-sm font-bold rounded-md transition-all"
        >
            Tên Chế Độ B
        </button>
    </div>
</div>
```

**Quy tắc HTML bất biến:**

- Container class: `bg-slate-200/50 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700` — không thay `rounded-xl`, không thêm `gap-1` hay `p-1.5`.
- Button class base: `px-5 py-2 text-sm font-bold rounded-md` — không dùng `rounded-lg`, không dùng `px-4`.
- **Không đặt icon `<i class="fas...">` bên trong nút.** Tên nút là text thuần. Có thể thêm chú thích chuẩn nhỏ: `STP <span class="font-normal text-[11px] opacity-70">802.1D</span>`.

---

### Logic JS chuẩn (copy y chang, không sáng tạo thêm)

```javascript
// Class không thay đổi theo chế độ — tất cả dùng chung 1 màu Active
const TOGGLE_ACTIVE   = 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400';
const TOGGLE_INACTIVE = 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200';

updateModeToggleUI() {
  const allModes = ['A', 'B']; // Liệt kê đúng tất cả key
  allModes.forEach(key => {
    const btn = document.getElementById(`mode-btn-${key}`);
    if (!btn) return;
    btn.className = `mode-btn px-5 py-2 text-sm font-bold rounded-md transition-all ${
      key === this.mode ? TOGGLE_ACTIVE : TOGGLE_INACTIVE
    }`;
  });
}

switchMode(mode) {
  if (this.mode === mode) return;
  this.pause();
  this.mode = mode;
  this.currentIndex = 0;
  this.updateModeToggleUI();
  this.buildStepper();
  this.renderStep(0);
  // Nếu số node thay đổi: setTimeout(() => { this.init(); }, 300)
}
```

**Quy tắc JS bất biến:**

- Active class **luôn là `text-blue-600`** — tuyệt đối không đổi màu theo từng chế độ (ví dụ: không làm RSTP xanh lá, MSTP tím). Sự khác biệt thể hiện qua Topology/Animation, không qua màu nút.
- `switchMode()` phải gọi `this.pause()` trước tiên để tránh bug auto-play chạy tiếp sau khi đổi chế độ.
- Nếu số node thay đổi giữa các chế độ: ẩn node thừa bằng `opacity-0 pointer-events-none scale-75`, hiện lại bằng `opacity-100 scale-100`, dùng `setTimeout(..., 300)` trước `drawLinks()`.

---

## 10. Mandatory Engine Method: `clampNodes()`

> **CRITICAL:** Bất kỳ lab nào có Topology Canvas (`id="topology-canvas"` với `overflow-hidden`) đều **PHẢI** implement method này trong class simulator. Không cần tính tay `top%` nữa — engine tự hiệu chỉnh.

### Vấn đề cần giải quyết

Các node dùng `position: absolute` + `transform: translate(-50%, -50%)`. Role badge có `absolute -top-3` (~12px phía trên card). Khi `top%` quá nhỏ, badge bị `overflow-hidden` của canvas cắt mất. Tương tự với bottom/left/right edge.

### Implementation (copy nguyên vào mọi simulator class)

```javascript
// Gọi ở cuối render(): setTimeout(() => { this.clampNodes(); this.drawLinks(...); }, 50);
// Gọi trong resize handler trước drawLinks.
// KHÔNG cần biết trước ID của node — tự discover qua querySelectorAll.

clampNodes() {
    if (!this.dom.canvas) return;
    const cr  = this.dom.canvas.getBoundingClientRect();
    const BADGE_PX = 20;  // clearance cho role badge -top-3 (~12px) + padding
    const EDGE_PX  = 6;   // padding các cạnh còn lại

    this.dom.canvas.querySelectorAll('[id^="node-"]').forEach(node => {
        const nr  = node.getBoundingClientRect();
        const hPx = cr.height / 100;
        const wPx = cr.width  / 100;
        let top  = parseFloat(node.style.top)  || 50;
        let left = parseFloat(node.style.left) || 50;

        const topClip   = (cr.top  + BADGE_PX) - nr.top;    if (topClip   > 0) top  += topClip   / hPx;
        const botClip   = nr.bottom - (cr.bottom - EDGE_PX); if (botClip   > 0) top  -= botClip   / hPx;
        const leftClip  = (cr.left + EDGE_PX)  - nr.left;   if (leftClip  > 0) left += leftClip  / wPx;
        const rightClip = nr.right - (cr.right  - EDGE_PX);  if (rightClip > 0) left -= rightClip / wPx;

        node.style.top  = top  + '%';
        node.style.left = left + '%';
    });
}
```

### Cách tích hợp

```javascript
// 1. Cuối mỗi render():
setTimeout(() => {
    this.clampNodes();
    this.drawLinks(currentStep.links);
}, 50);
// setTimeout 50ms để chờ CSS transition (border, width) settle trước khi đọc getBoundingClientRect()

// 2. Trong resize handler:
window.addEventListener('resize', () => {
    this.clampNodes();
    this.drawLinks(TIMELINE[this.idx].links);
});
// KHÔNG gọi drawLinks trước clampNodes — link sẽ kết nối sai tọa độ nếu node chưa được clamp
```

### Tại sao `setTimeout 50ms`?

Khi `render()` đổi class của node (ví dụ `border-red-500`), browser chưa kịp reflow/repaint. Nếu gọi `getBoundingClientRect()` ngay lập tức, kết quả trả về tọa độ cũ. 50ms đủ để browser commit layout mới trước khi `clampNodes()` đọc vị trí thực.
