# Prompt templates

Six reusable prompts for generating new labs that drop straight into this portfolio. Each targets a different shape of networking/security work and produces a different UI pattern — a state machine, a logic tree, a pipeline, a workflow with tabs, a split-screen, or a trigger-driven drill. All of them still produce a single self-contained HTML file matching the site's existing design system (Tailwind CDN, dark-mode class, Inter + Fira Code, Font Awesome, slate/blue/indigo palette, rounded-2xl SaaS cards).

The site is organized around these 6 formats directly: each one has its own folder under `projects/`, and each project's `type` field in `assets/js/projects.js` (which must be one of the keys below) controls its icon, color, and which filter chip it falls under on the homepage — you don't set icon/color per project, they're inherited from the type.

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

| Prompt               | `type` key        | Folder                      | Core engine logic                                         | Best used for                                                                   |
| -------------------- | ----------------- | --------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Protocol Simulator   | `protocol`        | `projects/protocol/`        | Timeline of states, packet/RFC breakdown                  | Training material, explaining how a protocol works internally                   |
| Troubleshooting Lab  | `troubleshooting` | `projects/troubleshooting/` | Logic tree — symptom → ruled-out hypotheses → root cause  | Post-mortems, incident write-ups, knowledge base, portfolio case studies        |
| Security Packet Walk | `packet-walk`     | `projects/packet-walk/`     | Sequential pipeline — Ingress → NAT → Policy → Egress     | Debugging firewall/NAT behavior, explaining zone design, policy audits          |
| Change / MOP Flow    | `change-mop`      | `projects/change-mop/`      | Process — Pre-checks → Execution → Post-checks → Rollback | Cutover planning, risk review (SPOF, lockout), documenting a maintenance window |
| Automation Workflow  | `automation`      | `projects/automation/`      | API/script request-response, error handling               | Reviewing automation code, demonstrating retry/error-handling logic             |
| Failover / HA Drill  | `failover`        | `projects/failover/`        | Trigger → timers → convergence → impact                   | Chaos-engineering style resilience testing, tuning Hello/Hold/Dead timers       |

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
1. Core engine: a JSON array `labTimeline`, one object per step:
   { step, time, phase, title, description, cli_logs,
     nodes: { <DeviceName>: { state, role, color } , ... },
     link_state,
     animated_packet: { from, to, label, color, icon } | null }

2. Header: logo badge (network-wired icon) + "← Portfolio" link back to
   ../../index.html + playback controls (⏮ ▶/⏸ ⏭ ↺) + theme toggle (🌓), matching
   the existing project pages exactly.

3. Visual topology: device cards connected by a link line, with an animated
   packet element that moves along the link per `animated_packet`.

4. Interactive timeline stepper: horizontal step buttons, active step
   highlighted, clickable to jump to any state, progress line underneath.

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
     nodes: { <DeviceName>: { state, note, color } },
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

5. Config diff viewer: a side-by-side or unified diff view of the old vs new
   config snippets, with added lines highlighted green and removed lines
   highlighted red/strikethrough (a simple line-by-line diff is fine — it
   doesn't need a real diff algorithm, just clear visual differentiation).

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
   the failed node shown greyed out/red.

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
