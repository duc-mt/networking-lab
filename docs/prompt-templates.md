# Prompt templates

Nine reusable prompts for generating new labs that drop straight into this portfolio. Each targets a different shape of networking/security work and produces a different UI pattern — a state machine, a logic tree, a pipeline, a workflow with tabs, a split-screen, a trigger-driven drill, a static reference graph, a tabbed failure-mode catalog, or a reactive graph-algorithm visualizer. All of them still produce a single self-contained HTML file matching the site's existing design system (Tailwind CDN, dark-mode class, Inter + Fira Code, Font Awesome, slate/blue/indigo palette, rounded-2xl SaaS cards).

For a quick-copy version of just the scenario/input block of each prompt — blank placeholder and a filled realistic example, both in English and Vietnamese — see `docs/prompt-scenarios.md`.

The site is organized around these 9 formats directly: each one has its own folder under `projects/`, and each project's `type` field in `assets/js/projects.js` (which must be one of the keys below) controls its icon, color, and which filter chip it falls under on the homepage — you don't set icon/color per project, they're inherited from the type.

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

| Prompt                    | `type` key            | Folder                          | Core engine logic                                                                             | Best used for                                                                                     |
| ------------------------- | --------------------- | ------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Protocol Simulator        | `protocol`            | `projects/protocol/`            | Timeline of states, packet/RFC breakdown                                                      | Training material, explaining how a protocol works internally                                     |
| Troubleshooting Lab       | `troubleshooting`     | `projects/troubleshooting/`     | Logic tree — symptom → ruled-out hypotheses → root cause                                      | Post-mortems, incident write-ups, knowledge base, portfolio case studies                          |
| Security Packet Walk      | `packet-walk`         | `projects/packet-walk/`         | Sequential pipeline — Ingress → NAT → Policy → Egress                                         | Debugging firewall/NAT behavior, explaining zone design, policy audits                            |
| Change / MOP Flow         | `change-mop`          | `projects/change-mop/`          | Process — Pre-checks → Execution → Post-checks → Rollback                                     | Cutover planning, risk review (SPOF, lockout), documenting a maintenance window                   |
| Automation Workflow       | `automation`          | `projects/automation/`          | API/script request-response, error handling                                                   | Reviewing automation code, demonstrating retry/error-handling logic                               |
| Failover / HA Drill       | `failover`            | `projects/failover/`            | Trigger → timers → convergence → impact                                                       | Chaos-engineering style resilience testing, tuning Hello/Hold/Dead timers                         |
| Topology Design Reference | `topology-design`     | `projects/topology-design/`     | Static graph — topology + routing tables + path lookup, no timeline                           | Documenting a network design, showcasing addressing/area layout, reference material               |
| Diagnostic Playbook       | `diagnostic-playbook` | `projects/diagnostic-playbook/` | Tabbed catalog — N static failure snapshots on one shared topology                            | A "field guide" of failure signatures for one subsystem (e.g. every way DNS resolution can break) |
| **Algorithm Visualizer**  | **`algorithm-viz`**   | **`projects/algorithm-viz/`**   | **Reactive graph + live algorithm engine — user edits topology, result recomputes instantly** | **Teaching graph algorithms (Dijkstra SPF, CSPF, Bellman-Ford) with interactive topology**        |

---

## 1. Protocol / concept simulator

Use this for "how does X actually work" labs — a protocol forming state over time (OSPF, STP, DHCP, TCP handshake, BGP peering, etc).

````
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

8. All visible UI text must be in English.

9. OPTIONAL — Cumulative/Delta pattern: use this sub-pattern instead of plain
   per-step snapshots when the lab's subject matter is a database/table that
   *builds up* over time (e.g. "watch the LSDB form", "watch the MAC table
   populate", "watch the BGP table converge") rather than a state that simply
   transitions (e.g. FSM adjacency). In this variant, each `labTimeline` step
   carries a `*_delta` array (only the NEW rows that appear at this step, e.g.
   `lsdb_delta: [{ type, origin, scope, desc }]`) instead of a full table. The
   engine accumulates deltas into a persistent array across steps:
   ```javascript
   const cumulativeTable = [];
   function renderStep(idx) {
     const s = TIMELINE[idx];
     s.some_delta.forEach(entry => {
       if (!cumulativeTable.find(e => /* same identity fields */)) {
         cumulativeTable.push({ ...entry, addedStep: idx, isNew: true });
       }
     });
     cumulativeTable.forEach(e => { e.isNew = (e.addedStep === idx); });
     // render cumulativeTable, giving `.isNew` rows a highlight + "NEW" tag
     // that fades after the step moves on (see .lsa-row.new / fadeIn keyframe)
   }
````

Going backward (Prev) must still show the correct cumulative state up to
that step — either recompute from scratch each time, or only ever append
(never delete) and simply filter by `addedStep <= idx` when going back.

Generate the complete HTML code, with `labTimeline` fully populated with
accurate, detailed technical data for the specified topic.

````

### Reference implementation — Dynamic Packet Animation (Requirement 3)

Copy this pattern rather than re-inventing it — it is the validated implementation
of the Web Animations API requirement above, used consistently across every
Protocol Simulator lab built so far:

```javascript
let pktTimers = [];
function animatePackets(packets) {
  pktTimers.forEach(t => clearTimeout(t));
  pktTimers = [];
  document.getElementById('pkt-layer').innerHTML = '';

  packets.forEach((pkt, i) => {
    const t = setTimeout(() => {
      const wrap = document.getElementById('topo-wrap'); // or #canvas
      const W = wrap.clientWidth, H = Math.max(wrap.clientHeight, 340);
      const fromNode = wrap.querySelector('#node-' + pkt.from);
      const toNode   = wrap.querySelector('#node-' + pkt.to);
      if (!fromNode || !toNode) return;
      const ax = parseFloat(fromNode.style.left)/100*W, ay = parseFloat(fromNode.style.top)/100*H;
      const bx = parseFloat(toNode.style.left)/100*W,   by = parseFloat(toNode.style.top)/100*H;

      const dot = document.createElement('div');
      dot.className = 'pkt-dot'; // position:absolute; z-index:20; pointer-events:none
      dot.style.left = ax+'px'; dot.style.top = ay+'px';
      dot.innerHTML = `<div class="pkt-pill" style="background:${pkt.color}25;color:${pkt.color};border:1px solid ${pkt.color}50">${pkt.label||pkt.type}</div>`;
      document.getElementById('pkt-layer').appendChild(dot);

      dot.animate([
        { left:ax+'px', top:ay+'px', opacity:1 },
        { left:bx+'px', top:by+'px', opacity:.8 },
        { left:bx+'px', top:by+'px', opacity:0 },
      ], { duration:1200, easing:'ease-in-out', fill:'forwards' });

      setTimeout(() => dot.remove(), 1300);
    }, i * 450); // stagger multiple packets in the same step
    pktTimers.push(t);
  });
}
````

Call `animatePackets(step.packets)` at the end of `renderStep()`, after nodes
have been positioned (so `#node-<id>` elements exist with their final `left/top`).
Always clear `pktTimers` first to avoid orphaned dots when the user navigates
away mid-animation (Prev/Next/seek while packets are still in flight).

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

7. All visible UI text must be in English.

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

8. All visible UI text must be in English.

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

7. All visible UI text must be in English.

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

7. All visible UI text must be in English.

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

8. All visible UI text must be in English.

Populate `failoverTimeline` with realistic timer values and a believable
convergence sequence for the given mechanism and trigger event.
```

### Reference implementation — Trigger Outage button (Requirement 3)

```html
<button
    id="btn-trigger"
    onclick="Lab.triggerOutage()"
    class="h-8 px-4 rounded-lg text-xs font-bold flex items-center gap-1.5"
>
    <i class="fas fa-bolt text-[11px]"></i>
    <span>Trigger Outage</span>
</button>
```

```css
#btn-trigger {
    background: linear-gradient(135deg, #dc2626, #991b1b);
    color: #fff;
    box-shadow: 0 0 20px rgba(220, 38, 38, 0.4);
    animation: pulse-trigger 1.5s infinite;
}
#btn-trigger.fired {
    animation: none;
    background: #1e293b;
    color: #64748b;
    box-shadow: none;
    cursor: not-allowed;
}
@keyframes pulse-trigger {
    0%,
    100% {
        box-shadow: 0 0 16px rgba(220, 38, 38, 0.35);
    }
    50% {
        box-shadow: 0 0 28px rgba(220, 38, 38, 0.65);
    }
}
```

```javascript
function triggerOutage() {
    if (triggered) return;
    triggered = true;
    const btn = document.getElementById('btn-trigger');
    btn.classList.add('fired');
    btn.innerHTML = '<i class="fas fa-bolt text-[11px]"></i><span>Outage Active</span>';
    ['btn-prev', 'btn-play', 'btn-next'].forEach(
        (id) => (document.getElementById(id).disabled = false)
    );
    renderStep(1); // jump straight into the failure sequence
}
```

Playback buttons (`btn-prev`/`btn-play`/`btn-next`) must start `disabled` in
the HTML and only become usable after `triggerOutage()` fires — this is what
makes the lab "sit on step 0 indefinitely" per Requirement 3.

### Reference implementation — Live Timer Bar (Requirement 4)

```html
<div class="flex items-center justify-between mb-1">
    <span class="text-[10px] mono text-slate-500 uppercase tracking-wider" id="timer-name"></span>
    <span class="text-sm font-bold mono" id="timer-val"></span>
</div>
<div class="timer-wrap"><div class="timer-bar" id="timer-bar"></div></div>
```

```css
.timer-wrap {
    height: 8px;
    border-radius: 999px;
    background: #1e293b;
    overflow: hidden;
}
.timer-bar {
    height: 100%;
    border-radius: 999px;
    transition: width 0.1s linear;
}
```

```javascript
let timerInterval = null;
function renderTimer(timerDef) {
    clearInterval(timerInterval);
    if (!timerDef) {
        document.getElementById('timer-section').style.display = 'none';
        return;
    }
    document.getElementById('timer-section').style.display = 'block';
    document.getElementById('timer-name').textContent = timerDef.name;
    const bar = document.getElementById('timer-bar');
    bar.style.background = timerDef.color;
    let rem = timerDef.remaining,
        tot = timerDef.total;
    document.getElementById('timer-val').textContent = rem.toFixed(1) + 's';
    bar.style.width = (rem / tot) * 100 + '%';
    timerInterval = setInterval(() => {
        rem = Math.max(0, rem - 0.1);
        bar.style.width = (rem / tot) * 100 + '%';
        document.getElementById('timer-val').textContent = rem.toFixed(1) + 's';
        if (rem <= 0) clearInterval(timerInterval);
    }, 100);
}
```

Call `clearInterval(timerInterval)` at the top of every `renderStep()` (not
just inside `renderTimer`) so navigating away mid-countdown never leaves a
stray interval running in the background.

---

## 7. Topology design reference

Use this format when documenting a complete network **Architecture Blueprint / High-Level Design (HLD)** rather than a timeline of events. There is no time axis or playback controls (⏮ ▶ ⏭). Instead, it's an interactive reference dashboard showcasing the full topology, logical zones, per-device configurations/tables, and end-to-end traffic flow analysis.

### Broad use cases (Tổng quát hóa cho mọi kiến trúc mạng):

- **Enterprise Campus & L2/L3 Switching:** Core/Agg/Access layers, vPC/MLAG, Port-Channels, STP root bridges, FHRP (HSRP/VRRP VIPs), VLANs & Trunks.
- **Data Center Fabric (Spine-Leaf):** Underlay (eBGP/IS-IS) & Overlay (EVPN-VXLAN, VNIs, Distributed Anycast Gateways, Multi-Homing).
- **WAN & Multi-Cloud Transit:** SD-WAN Hub-and-Spoke, Full-Mesh Overlays (IPsec/WireGuard), BGP ASNs, Route Reflectors, AWS Transit Gateway / Azure vWAN.
- **Security & Micro-Segmentation:** Perimeter Firewalls, DMZ, Internal Trust, PCI-DSS Isolated Zones, Inspection Choke Points.
- **Dynamic Routing Architectures:** Multi-Area OSPF, BGP EVPN, IS-IS, Hybrid Redistribution.

```
Act as a Principal Network Architect and Senior UI/UX Frontend Engineer.

Build a single-file "Interactive Topology Design Reference" — an interactive
architectural dashboard for exploring a fully-designed network: the topology
map, logical zones/layers, per-device configuration tables, and an end-to-end
path tracer tool, all viewable in an integrated view. Match the visual style
of my other project pages (Tailwind CDN darkMode:'class', Inter + Fira Code,
Font Awesome CSS build, slate/blue/indigo palette, rounded-2xl cards) and
include the two shared includes used across the site:

    <link rel="stylesheet" href="../../assets/css/theme.css">
    <script src="../../assets/js/theme-init.js"></script>

plus the "← Portfolio" back-link to ../../index.html in the header. Do NOT
include playback controls (⏮ ▶/⏸ ⏭ ↺) — there's no time axis in this format.

Output: ONE self-contained HTML file, inline CSS + vanilla JS only (aside
from the two shared includes above).

==================================================
Network Design Scope:
- Architecture Type: (e.g. "Enterprise Campus 3-Tier", "Data Center Spine-Leaf EVPN-VXLAN", "SD-WAN Multi-Cloud Transit", "Security Micro-Segmentation Zone")
- Zones / Areas / VPCs: (list logical grouping zones with boundary definitions)
- Devices / Nodes: (hostname, role, layer, loopback/management IP, specific features like vPC, HSRP, BGP ASN, VNI)
- Interconnects & Links: (connected interfaces, link type — Trunk, Routed, Overlay, Port-Channel, Bandwidth, Metric)
- Device Configuration Tables: (Routing tables, VLAN/Trunk database, BGP Neighbor peering, or Security policy list)
==================================================

Requirements:
1. Core Data Model — structured as topological and architectural data:
   `zones`: Array of architectural zones/layers/areas/VPCs:
     [{ id, label, type, color, bounds: { top, left, width, height } }]
   `nodes`: Array of devices:
     [{ id, name, role, zone, icon, x, y, specs: { ip, loopback, asn, vlans, fhrp, ... },
        tableType: "routing" | "vlans" | "bgp" | "interfaces" | "policies",
        tableData: [...],
        health: "green" | "amber" | "red", state: "active" | "inactive",
        risks: [ "SPOF" | "No HA" | ... ] }]   // màu theo Section 13.6
   `links`: Array of connections:
     [{ from, to, label, type: "trunk" | "routed" | "overlay" | "peer", metric, vlan, bandwidth }]

2. Header: logo + "← Portfolio" back-link + theme toggle only (no playback controls).
   Include architectural badges / indicators (e.g. "Campus LAN", "Spine-Leaf", "Hybrid Cloud").

3. Topology Map Canvas (centerpiece):
   - All devices positioned with clear layer hierarchy (e.g. Spine on top, Leaf in middle, Compute below; or Core ➔ Distribution ➔ Access).
   - SVG links layer displaying link labels, speeds, and status.
   - Background zones visually grouping components with distinct colors and borders.
   - Interactive Node Clicks: Clicking any device opens its Inspector Panel.

4. Multi-Layer Perspective / View Toggle (Recommended):
   - Allow toggling views between Physical/L2 (VLANs, Trunks, LACP) and Logical/L3 (IPs, Subnets, Routing Protocols) or Security Zones.

5. Device Inspector Panel:
   - On selecting a device, show its role, hostname, IP/specs, and its contextual operational table (Routing Table, VLAN Table, BGP Peers, or Security Rules) styled as a dark monospace terminal card.

6. Path / Traffic Flow Tracer:
   - Two dropdowns (Source, Destination) + "Trace Flow" button.
   - Trace end-to-end traffic path across hops, highlight active links on the canvas, and list the hop-by-hop forwarding decisions (e.g. LACP ➔ SVI ➔ Route Lookup ➔ Tunnel Encap ➔ Destination).

7. All visible UI text must be in English, adhering to the Bilingual Standards (Section 11).
8. Node health / inactive / risk / highlight colors MUST follow the Semantic Color
   Contract (Section 13.6) — one color, one meaning.
```

---

## 8. Diagnostic playbook

Use this one for a "field guide" of failure modes — not one incident, but every way a subsystem can break, catalogued side by side on the same topology so a viewer can flip through them. This is the format the "Network Bắt Bệnh" DNS lab (KB1 healthy → KB8 nscd) is built from: same LAN, same client/server layout in every tab, only the fault and the diagnostic evidence change.

````
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
   address with no device behind it). Place it directly under the H1/subtitle,
   above the KB tab row, as a single `flex flex-wrap justify-center gap-4`
   row of small colored dots + short labels — it does not change per tab:
   ```html
   <div class="flex flex-wrap items-center justify-center gap-4 text-xs">
     <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm" style="background:#10b981;opacity:.85"></span><span class="text-slate-500">Nằm trong flooding/query scope</span></span>
     <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm bg-slate-600 opacity-40"></span><span class="text-slate-500">Ngoài scope</span></span>
     <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm" style="background:#6366f1"></span><span class="text-slate-500">Nguồn phát sinh</span></span>
   </div>
````

5. KB tab row: one pill per case, each showing its `label` and a status dot
   (green = healthy, red/orange = broken), active tab visually highlighted.
   Clicking a tab swaps the topology state, diagnostics, and takeaways below.

5b. OPTIONAL — Node relationship status badge: when the catalog's cases are
about scope/reachability rather than binary health (e.g. "which routers
receive this LSA type", "which segment does this VLAN reach"), give each
node card a 3-state status badge describing its _relationship to the
active case_ instead of (or alongside) its operational health:
`javascript
    const nodeStatus = !inScope ? 'BLOCKED' : isOrigin ? 'GENERATES' : 'RECEIVES';
    `
Render it as the `.n-status`/`.nbadge` pill under the node card. This is
distinct from the health Status Badge in Section 14.4 — it describes the
node's role in _this specific case_, not whether the device itself is up
or down, so it's allowed to change every time the tab changes even for a
perfectly healthy node.

6. Detail panel below the tabs, two columns: left = config/script snippet
   and command output in a dark monospace terminal block; right = the
   `takeaways` as a bullet list.

7. All visible UI text must be in English.

Populate `playbookCases` with technically accurate command output for each
case — exit codes, timing, and DNS response codes should be realistic and
internally consistent with what's "broken" in that case.

```

---

## 9. Algorithm Visualizer

Use this for labs where the educational goal is **watching an algorithm compute on a graph** in real time, and where the student needs to **interact with the topology** (shutdown a link, change a cable type, add cost) to see the result change instantly. This is the most interactive of all 9 templates — it has no fixed timeline; instead the graph is mutable and the algorithm re-runs on every change.

**Phân biệt với Protocol Simulator (Template 1):** Protocol Simulator dùng timeline tuyến tính, passive — người dùng bấm Next để xem bước tiếp theo đã được định sẵn. Algorithm Visualizer là reactive — người dùng thay đổi graph, engine tự tính lại kết quả ngay lập tức, không có kịch bản cố định.

**Ví dụ lab phù hợp:**
- OSPF SPF / Dijkstra — click link để shutdown hoặc đổi cable type, xem best path thay đổi
- IS-IS SPF trên dual topology (L1 / L2 separation)
- MPLS Traffic Engineering — CSPF với bandwidth constraint
- BGP best-path selection với multiple attribute comparison
- STP port role election (Bellman-Ford) khi link cost thay đổi

```

Act as a Principal Network Architect and Senior UI/UX Frontend Engineer.

Build a single-file "Interactive Algorithm Visualizer" — a reactive lab where
the user can modify a network topology (shutdown links, change cable types /
costs) and watch a graph algorithm (Dijkstra SPF, Bellman-Ford, CSPF, etc.)
recompute and update the path, routing table, and state database in real time.
Match the visual style of my other project pages (Tailwind CDN darkMode:'class',
Inter + Fira Code, Font Awesome CSS build, slate/blue/indigo palette,
rounded-2xl cards, glassmorphism sticky header).

Output: ONE self-contained HTML file, inline CSS + vanilla JS only.

==================================================
Algorithm & Scenario:

- Algorithm: (e.g. "Dijkstra — OSPF SPF", "Bellman-Ford — STP", "CSPF with BW constraint")
- Topology: (nodes with Router-ID / role / area, links with default bandwidth/cost)
- Source node: (default selected source for path computation)
- Destination node: (default selected destination)
- Preset scenarios: (list 4–6 named scenarios — each is a set of link patches
  applied on top of the baseline graph, e.g.:
  "Link Failure: shutdown R2-R4"
  "Cost Tuning: change R1-R2 to T1 Serial (cost 64)"
  "ECMP: all links GigabitEthernet, R1→R4 via two equal-cost paths"
  "Dual Failure: shutdown R2-R4 and R3-R4, observe unreachable nodes")
  \==================================================

Requirements:

### 1. Core data model — mutable graph + read-only scenario patches

```javascript
// Immutable baseline — never modified directly
const BASE_GRAPH = {
  nodes: [{ id, label, routerId, area, role, x, y, icon }],
  links: [{ id, from, to, bwType, state: 'up' | 'down' }],
  areas: [{ id, label, color, x1, y1, x2, y2 }]
};

// Bandwidth / cost lookup table
const BW_TYPES = [
  { label, bw, cost, icon, color },  // index 0 = GigabitEthernet (cost 1)
  // index 1 = FastEthernet, 2 = Ethernet (cost 10), 3 = T1 Serial (cost 64), etc.
];

// Scenario patches — applied on top of BASE_GRAPH, never stored in it
const SCENARIOS = [{
  id, label, icon, desc,
  patches: [{ id: linkId, state?, bwType? }],  // only changed fields
  src, dst,        // which nodes to compute path between
  note             // teaching explanation shown in the UI
}];

// Runtime mutable copy — recreated from BASE_GRAPH + patches on each scenario load
let graph = deepClone(BASE_GRAPH);
```

**Invariant Rule:** `BASE_GRAPH` is never mutated. Any change (clicking a popup, loading a scenario) creates a new clone from `BASE_GRAPH` + applies patches. This ensures "Reset Topology" always works correctly.

### 2. Algorithm engine — real implementation, no hardcoding

Implement the actual algorithm in JavaScript. DO NOT hardcode path results. Any topology change must trigger `runAlgorithm()` → recalculating results from scratch.

**Dijkstra Standard for OSPF SPF:**

```javascript
function dijkstra(nodes, links, srcId) {
    // Build adjacency from active links (state === 'up') only
    // Record EVERY STEP: { action, processing, settled[], candidates[], dist{}, prev{}, desc }
    // Return { dist, prev, prevLink, steps }
}
```

**Engine Mandatory Requirements:**

- Exclude `state: 'down'` links from adjacency before running — do not just hide them on UI.
- Record each algorithm iteration into `steps[]` array for the SPF step-by-step panel to display.
- Handle ECMP: when two paths have the same cost, save both into `prevMulti{}` and highlight both on the topology.
- Handle unreachable: unreachable nodes have `dist = Infinity` — routing table must display "UNREACHABLE".

### 3. Layout — 3 zone bắt buộc

```
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER (sticky): logo · title · scenario pills · src/dst · theme  │
├──────────────────────────────┬──────────────────────────────────────┤
│  LEFT: Interactive Topology  │  RIGHT: 3-tab panel (400px fixed)   │
│                              │  ┌─ [Algorithm Steps][LSDB][RT]──┐  │
│  [zone bounding boxes]       │  │                                │  │
│  [SVG links — hit + vis]     │  │  Tab content scrollable        │  │
│  [node cards absolute %]     │  │                                │  │
│  [cost labels on links]      │  └────────────────────────────────┘  │
│  [path arrows animated]      │  [teaching note — pinned bottom]     │
│  [legend row]                │                                      │
├──────────────────────────────┴──────────────────────────────────────┤
│  CONTROL BAR (sticky bottom): ◀ Prev · ▶ Play/Pause · ▶▶ Next · ↺ │
│  Step N/Total · Speed slider · Reset Topology button               │
└─────────────────────────────────────────────────────────────────────┘
```

### 4. Topology canvas — invariant rules

- Node coordinates use a virtual reference system `REF_W × REF_H` (e.g. 960×360), rendered as `%` on paint: `el.style.left = (n.x / REF_W * 100) + '%'`.
- Must call `clampNodes()` after every render (see Section 10).
- SVG links are split into 2 layers: `<g id="svg-links-hit">` (transparent stroke, large stroke-width for easy clicking) and `<g id="svg-links-vis">` (visual). Users click the hit layer to open popups.
- Cost labels use `<foreignObject>` in SVG — clickable HTML pills, not `<text>`.
- `window.addEventListener('resize', ...)` is required to redraw links after viewport changes.
- Zone bounding boxes: `position: absolute`, `border: 2px dashed`, `pointer-events: none`, `z-index: 0`.

### 5. Link interaction popup — mandatory UI pattern

When clicking a link (hit area or cost label), display a floating popup with:

```
┌─────────────────────────────────┐
│  Change cable type / bandwidth  │
│  ○ GigabitEthernet (cost 1)     │
│  ○ FastEthernet (cost 1)        │
│  ○ Ethernet 10M (cost 10)       │
│  ○ T1 Serial (cost 64)          │
│  ○ 56k Serial (cost 1785)       │
│  ─────────────────────────────  │
│  ✕ Shutdown Link / No Shutdown  │
└─────────────────────────────────┘
```

- Popup closes when clicking outside (`document.addEventListener('click', closePopup)`).
- After each change: `runAlgorithm()` → `renderTopology()` → panel auto-updates.
- Popup must not block the topology underneath — use `position: fixed`, high z-index.

### 6. Node states — colors during algorithm execution

| State        | Meaning                             | Border + Glow                             |
| ------------ | ----------------------------------- | ----------------------------------------- |
| `source`     | Selected source node                | Blue `#3b82f6`                            |
| `dest`       | Selected destination node           | Amber `#f59e0b`                           |
| `processing` | Being expanded in current iteration | Pink `#ec4899` + pulse animation          |
| `candidate`  | In candidate list, not yet settled  | Violet `#a78bfa`                          |
| `settled`    | Settled into SPF tree               | Emerald `#10b981`                         |
| `path`       | On best path src→dst                | Emerald `#34d399` (brighter than settled) |
| `normal`     | Unvisited                           | Slate `#334155`                           |

Display node's current cost (from `step.dist`) as a small badge under the card, updated per step.

### 7. Right panel — 3 tab cố định

**Tab "Algorithm Steps" (default):**

- Highlight card for current step: action type + processing node + English description.
- Candidate list: node list + cost, violet color.
- Settled set: node list + cost, emerald color.
- Distance vector table: all nodes, current cost, via (prev node).

**"State DB" tab (LSDB / Link State DB):**

- One card per node: Type 1 LSA (OSPF) or equivalent — lists active neighbors + cost.
- Highlight DOWN links with a separate red card.
- Update immediately when topology changes.

**"Routing Table" tab:**

- One row per destination node: next-hop + total cost.
- Compare with baseline (BASE_GRAPH + default src): "CHANGED" rows highlight emerald, "UNREACHABLE" rows highlight red.
- Rows missing paths from the previous scenario → show strikethrough text + old cost.

**Teaching note (pinned bottom of right panel):**

- Display `scenario.note` when loading scenario — briefly describing what is happening and why.
- Does not auto-hide — user must load another scenario to change it.

### 8. Control bar — bottom sticky

```javascript
// Buttons:
spfPrev(); // spfStepIdx-- → renderTopology() + renderPanel()
spfPlayPause(); // toggle interval, speed from speed-slider
spfNext(); // spfStepIdx++ → renderTopology() + renderPanel()
spfReset(); // spfStepIdx = 0 → renderTopology() + renderPanel()
resetTopology(); // reload active scenario from BASE_GRAPH + patches
```

- Speed slider: `min=200 max=1800 step=200`, interval = `2000 - value + 200` ms.
- Step indicator: `Step N / Total` updates whenever step changes.
- Auto-play stops automatically at the final step.

### 9. Scenario bar — in header

- Horizontal pills, scroll if needed. Active pill: `border-indigo-500 text-indigo-400 bg-indigo-500/10`.
- Click pill → `loadScenario(id)`: deepClone BASE_GRAPH + apply patches + set src/dst + runAlgorithm() + renderTopology() + showTeachingNote().
- `loadScenario()` must reset `spfStepIdx = 0` and stop auto-play if running.

### 10. Inherited mandatory rules from Design System

- `clampNodes()` is mandatory — see Section 10 (original doc).
- Do not hardcode node pixel coordinates — use `%` from REF system.
- `window.addEventListener('resize', ...)` is mandatory.
- Theme toggle with `localStorage('portfolio-theme')` + no-FOUC head script.
- Header glassmorphism: `backdrop-blur-md bg-white/80 dark:bg-slate-900/80`.
- Bilingual: H1 title in English, description/explanation in English (Section 11).
- Semantic Color Contract: do not use amber for path highlights — only use emerald/violet/blue/pink (Section 13.6).

### 11. All visible UI text must be in English.

Populate `BASE_GRAPH` and `SCENARIOS` with accurate technical data for the requested topology.

````

---

## 10. Mode Toggle

> **Auto-decision rule:** When designing a new lab, AI must self-evaluate whether to add a Mode Toggle based on the following criteria — **no need to ask the user**.

### When to USE Mode Toggle

Use when the lab has **≥ 2 variants/modes** showing **the same topology but different behavior**, and the user needs to compare them directly. Example:

| Context                             | Should Toggle? | Reason                                                    |
| ----------------------------------- | -------------- | --------------------------------------------------------- |
| DHCP Local vs DHCP Relay            | ✅ Yes          | Same devices, but different node count and packet flow    |
| STP vs PVST+ vs RSTP vs MSTP        | ✅ Yes          | Same triangle topology, but different blocking mechanism  |
| OSPF P2P vs Broadcast               | ✅ Yes          | Same 2 routers, but different DR/BDR election and LSDB    |
| BGP iBGP vs eBGP                    | ✅ Yes          | Same router pair, but different AS path and next-hop      |
| NAT Static vs PAT (Overload)        | ✅ Yes          | Same topology, but different translation table and ports  |
| OSPF Adjacency (7 steps FSM)        | ❌ No           | Only 1 scenario, use standard stepper                     |
| BGP FSM (5 states)                  | ❌ No           | Linear, no variants to compare                            |
| Troubleshooting / MOP / Packet Walk | ❌ No           | Linear steps over time, no "modes"                        |
| **Algorithm Visualizer**            | ❌ No           | **Use Scenario Pills instead — same function, better UX for > 3 variants** |

### When NOT to use

- Lab has only **1 linear scenario** → use standard Stepper.
- Variants have **completely different topologies** (significant node count difference) → create 2 separate labs.
- Have **> 5 variants** → use KB Tabs (Diagnostic Playbook format) or Scenario Pills (Algorithm Visualizer) instead of Toggle.

---

### Standard HTML Form (copy exactly, do not invent)

Place it immediately **above** the Timeline Stepper section, inside `<main>`:

```html
<!-- Mode Toggle — only use when there are >= 2 modes/variants -->
<div class="flex items-center justify-center">
    <div
        class="flex flex-wrap justify-center items-center bg-slate-200/50 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700"
    >
        <button
            id="mode-btn-A"
            onclick="app.switchMode('A')"
            class="mode-btn px-5 py-2 text-sm font-bold rounded-md transition-all"
        >
            Mode A Name
        </button>
        <button
            id="mode-btn-B"
            onclick="app.switchMode('B')"
            class="mode-btn px-5 py-2 text-sm font-bold rounded-md transition-all"
        >
            Mode B Name
        </button>
    </div>
</div>
````

**Invariant HTML Rules:**

- Container class: `bg-slate-200/50 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700` — do not change to `rounded-xl`, do not add `gap-1` or `p-1.5`.
- Button class base: `px-5 py-2 text-sm font-bold rounded-md` — do not use `rounded-lg`, do not use `px-4`.
- **Do not place `<i class="fas...">` icons inside buttons.** Button name is pure text. Can add a small standard annotation: `STP <span class="font-normal text-[11px] opacity-70">802.1D</span>`.

---

### Standard JS Logic (copy exactly, do not invent)

```javascript
// Classes do not change based on mode — all use the same Active color
const TOGGLE_ACTIVE   = 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400';
const TOGGLE_INACTIVE = 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200';

updateModeToggleUI() {
  const allModes = ['A', 'B']; // List all keys correctly
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
  // If node count changes: setTimeout(() => { this.init(); }, 300)
}
```

**Invariant JS Rules:**

- Active class **must always be `text-blue-600`** — absolutely do not change colors per mode (e.g., do not make RSTP green, MSTP purple). Differences are shown through Topology/Animation, not button colors.
- `switchMode()` must call `this.pause()` first to prevent auto-play bugs running after mode change.
- If node count changes between modes: hide excess nodes with `opacity-0 pointer-events-none scale-75`, reveal with `opacity-100 scale-100`, use `setTimeout(..., 300)` before `drawLinks()`.

---

## 11. Mandatory Engine Method: `clampNodes()`

> **CRITICAL:** Any lab with a Topology Canvas (`id="topology-canvas"` with `overflow-hidden`) **MUST** implement this method in the simulator class. No need to manually calculate `top%` anymore — the engine will self-adjust.

### Problem to solve

Nodes use `position: absolute` + `transform: translate(-50%, -50%)`. Role badge has `absolute -top-3` (~12px above card). When `top%` is too small, the badge gets cut off by the canvas's `overflow-hidden`. Similar issues happen with bottom/left/right edges.

### Implementation (copy exactly into every simulator class)

```javascript
// Call at the end of render(): setTimeout(() => { this.clampNodes(); this.drawLinks(...); }, 50);
// Call in resize handler before drawLinks.
// DO NOT need to know node IDs beforehand — self-discover via querySelectorAll.

clampNodes() {
    if (!this.dom.canvas) return;
    const cr  = this.dom.canvas.getBoundingClientRect();
    const BADGE_PX = 20;  // clearance for role badge -top-3 (~12px) + padding
    const EDGE_PX  = 6;   // padding for remaining edges

    this.dom.canvas.querySelectorAll('[id^="node-"]').forEach(node => {
        const nr  = node.getBoundingClientRect();
        const hPx = cr.height / 100;
        const wPx = cr.width  / 100;
        if (!node.dataset.rawTop) {
                    node.dataset.rawTop = parseFloat(node.style.top) || 50;
                    node.dataset.rawLeft = parseFloat(node.style.left) || 50;
                }
                let top = parseFloat(node.dataset.rawTop);
                let left = parseFloat(node.dataset.rawLeft);

        const topClip   = (cr.top  + BADGE_PX) - nr.top;    if (topClip   > 0) top  += topClip   / hPx;
        const botClip   = nr.bottom - (cr.bottom - EDGE_PX); if (botClip   > 0) top  -= botClip   / hPx;
        const leftClip  = (cr.left + EDGE_PX)  - nr.left;   if (leftClip  > 0) left += leftClip  / wPx;
        const rightClip = nr.right - (cr.right  - EDGE_PX);  if (rightClip > 0) left -= rightClip / wPx;

        node.style.top  = top  + '%';
        node.style.left = left + '%';
    });
}
```

### How to integrate

```javascript
// 1. End of every render():
setTimeout(() => {
    this.clampNodes();
    this.drawLinks(currentStep.links);
}, 50);

// 2. In resize handler:
window.addEventListener('resize', () => {
    this.clampNodes();
    this.drawLinks(currentStep.links);
});
```

### Why `setTimeout 50ms`?

When `render()` changes a node's class (e.g., `border-red-500`), the browser hasn't had time to reflow/repaint yet. If `getBoundingClientRect()` is called immediately, the result returns old coordinates. 50ms is enough for the browser to commit the new layout before `clampNodes()` reads the actual position.

---

## 12. Language & Terminology Standards (English Only)

> **OBJECTIVE:** Ensure all labs (Protocol, Troubleshooting, Failover, MOP, Algorithm Visualizer...) have a consistent, professional English-only writing style, adhering to Network Engineer / NetDevOps standards.

### Convention Mapping Table:

| UI Component                              | Language                  | Specific Rules & Examples                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| :---------------------------------------- | :------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Lab Title (`<title>`, `<h1>`)**         | **English**               | Short, professional, keep international terminology.<br>• `Port Security Misconfiguration`<br>• `Rogue DHCP Server & Layer 2 Security`<br>• `ClusterXL Zero-Downtime Patching`<br>• `STP Link Failure & Convergence`<br>• `OSPF SPF Algorithm Visualizer`                                                                                                                                                                                                            |
| **Stepper Bar (`phase`)**                 | **UPPERCASE English**     | Always use short uppercase words. **DO NOT** use long phrases that cause button overflow on mobile.<br>• _Troubleshooting:_ `TRIAGE`, `ISOLATE`, `ROOT CAUSE`, `FIX`, `VERIFY`<br>• _Protocol:_ `DOWN`, `INIT`, `2-WAY`, `EXCHANGE`, `FULL` / `BLOCKING`, `FORWARDING`<br>• _Failover:_ `NORMAL`, `FAILOVER`, `REBOOTING`, `RESTORED`<br>• _MOP:_ `PRE-CHECK`, `EXECUTION`, `POST-CHECK`, `ROLLBACK`<br>• _Algorithm Visualizer:_ `INIT`, `SETTLE`, `EXPAND`, `DONE` |
| **Scenario Pills (Algorithm Visualizer)** | **English**               | Short names, use Font Awesome icons first. Example: `Baseline`, `Link Failure`, `Cost Tuning`, `ECMP`, `Dual Failure`.                                                                                                                                                                                                                                                                                                                                               |
| **Step Title (`title`)**                  | **English**               | Short, highlighting the action or result. **DO NOT** add prefixes like `"Step 1:"`, `"Step 2:"` (as the stepper already has step numbers).                                                                                                                                                                                                                                                                                                                           |
| **Detailed Description (`description`)**  | **English**               | Explain clearly in English, combine with `<code class="font-mono ...">` tags for commands and technical parameters (IP, MAC, VLAN, Default Gateway, DHCP Discover/Offer/ACK, etc.). All visible UI text must be in English.                                                                                                                                                                                                                                          |
| **Device Role (Role Badge)**              | **English**               | Small badge `-top-3` on each node card:<br>`Core Switch`, `Access Switch`, `DHCP Server`, `Victim PC 1`, `Rogue Router`, `File Server`, `Backbone`, `ABR`, `ASBR`.                                                                                                                                                                                                                                                                                                   |
| **Device Name (Hostnames `<h3>`)**        | **Standard Hostname**     | Uppercase letters in standard network planning format:<br>`SW-CORE-01`, `SW-ACC-01`, `SRV-DHCP-01`, `PC-VICTIM-01`, `ROUTER-WIFI`.                                                                                                                                                                                                                                                                                                                                   |
| **Device State (State Badge)**            | **UPPERCASE English**     | Technical state in uppercase:<br>`ONLINE`, `FORWARDING`, `NORMAL`, `MISCONFIGURED`, `ROGUE ACTIVE`, `POISONED`, `BLOCKED`, `PROTECTED`, `RESTORED ✓`, `DOWN`, `ERR-DISABLE`.<br>_Algorithm Visualizer:_ `SETTLED`, `CANDIDATE`, `PROCESSING`, `UNREACHABLE`.                                                                                                                                                                                                         |
| **Investigation Panels**                  | **English**               | Standardize titles of right-side cards:<br>• `Hypothesis List`<br>• `Root Cause`<br>• `Remediation`<br>• Hypothesis state labels: `Investigating`, `Excluded` (strikethrough), `Confirmed` (red/orange).                                                                                                                                                                                                                                                             |
| **Checklist & Rollback Table**            | **English + CLI**         | Standard operational safety and testing table:<br>• Columns: `Action`, `Verification Command / Operation`, `Expected Output`, `Rollback Plan`.                                                                                                                                                                                                                                                                                                                       |
| **CLI / Terminal Window**                 | **English Console + CLI** | Header: `SW-ACC-01# — Console` or `PC-VICTIM-02> ipconfig /all`.<br>Logs: Original output of Cisco IOS/Linux/Windows, with comments `! ` or `→ ` if explanation is needed.                                                                                                                                                                                                                                                                                           |
| **Register `assets/js/projects.js`**      | **Title EN, Desc EN**     | `title: 'Rogue DHCP & Layer 2 Security'`<br>`description: 'Network incident diagnosis due to personal Wi-Fi Router causing Rogue DHCP, incorrect Gateway allocation and thorough defense solution with DHCP Snooping, DAI, IP Source Guard.'`                                                                                                                                                                                                                        |

---

## 13. Anti-Collision & Layout Robustness Rules

> **OBJECTIVE:** Absolutely prevent badges, labels, or data rows from sticking together, overlapping, or breaking layout when content is long or viewed on different screen sizes.

### 1. Information Card Headers (Anti-Collision Header):

- **Forbidden:** Do not simply use `flex items-center justify-between` when one side is a dynamic or long string (like interface name, location, rule name).
- **Mandatory:** Use a responsive flex structure with wrap and border separation:
    ```html
    <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800"
    >
        <span
            id="stage-badge"
            class="inline-flex self-start items-center px-3 py-1 rounded text-xs font-bold uppercase tracking-widest border border-rose-300 dark:border-rose-700 bg-rose-50 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 shrink-0"
        >
            ...
        </span>
        <span
            id="device-badge"
            class="text-xs font-mono text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md self-start sm:self-auto break-all sm:break-normal"
        >
            ...
        </span>
    </div>
    ```
- The main badge (`stage-badge`) must have `shrink-0`.
- Secondary labels (`device-badge`, `location`, `ip`) must always be wrapped in a separate pill block (`bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md`) to create a clear visual buffer.

### 2. Key-Value Rows (Inspector Panels):

- **Spacing:** Always have `gap-2.5` or `gap-3` between the label (Key) and value (Value).
- **Anti-squish label:** The left label must have `shrink-0` so it doesn't get distorted when the Value is too long:
    ```html
    <div
        class="flex items-start justify-between gap-3 p-2.5 rounded bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50"
    >
        <span class="text-slate-400 font-sans shrink-0">Firewall Rule:</span>
        <span id="inspector-rule" class="font-bold text-blue-600 dark:text-blue-400 text-right">
            ...
        </span>
    </div>
    ```

### 3. Responsive Stepper & Pipeline:

- Always wrap the timeline/pipeline part in a container with `overflow-x-auto` and put `min-w-[700px]` inside so it doesn't cluster on mobile.
- The stepper button uses a short uppercase English label (`phase`), hides the text on small screens and only shows the step number:
  `<span class="hidden md:block">${d.step}. ${d.phase}</span><span class="md:hidden">${d.step}</span>`.

### 4. Topology Safety Positioning Rules:

- All canvases must activate the `clampNodes()` function to prevent boundary overflow (Section 11).
- Do not use floating `absolute` without anchor coordinates (`top/left` or `inset-0`).

---

## 14. Topology Design & Styling Rules

> **OBJECTIVE:** Ensure all Topology simulation pages (especially `topology-design` and `algorithm-viz`) are absolutely consistent in spacing, colors, and layout on ultra-wide screens, and adhere to visual standards.

### 1. Canvas and Layout Widths (Responsive Auto-Scale Support)

- **Main Container**: The outermost `<main>` tag must use `class="flex-1 w-full max-w-[1600px] mx-auto ..."` (DO NOT use `max-w-7xl`).
- **Topology Canvas**: The diagram container `<div id="topology-container">` uses `class="relative w-full max-w-[1400px] mx-auto overflow-hidden ..."` with a minimum height (e.g., `min-h-[500px]` or `min-h-[600px]`). Remove static horizontal scrolling (`overflow-x-auto`), the diagram must automatically scale (responsive) to fill the width.
- **Algorithm Visualizer exception:** Layout uses `flex-row` to split the screen (topology left + fixed 400px panel right), height = `calc(100vh - header - controlbar)`. The topology canvas occupies the entire remaining space on the left.

### 2. Node Positioning & Symmetry (Relative Coordinates)

- **FORBIDDEN TO USE** static Pixel coordinates (hardcode pixel). All devices (nodes) and zones MUST use coordinates in **Percentage (%)** (Example: `left: 15%, top: 50%`) to scale smoothly according to the browser size.
- You can declare percentages directly in the array data, or declare virtual reference coordinates (e.g., `REF_W = 1400, REF_H = 600`) and dynamically calculate percentages when rendering with JS: `el.style.left = (n.x / REF_W * 100) + '%'`.
- **ABSOLUTELY DO NOT** cluster Nodes to the left. Spacing must be distributed evenly across Regions to spread out harmoniously on the canvas.

### 3. Zone Bounding Boxes

- **Bounding Box Sizing:** Ensure the height of the partition frame (e.g., `height: 92%`) is large enough to completely encompass all internal nodes, and does not intersect any device (especially bottom nodes).
- **Z-index:** Bounding boxes must be at the very bottom (`z-0`), while device Nodes float on top (`z-10` or `z-20`).
- **Mandatory** to draw dashed borders to delineate physical areas (Example: On-Prem Site, Cloud Region, MPLS Core).
- **CSS Style:** `absolute border-2 border-dashed rounded-xl pointer-events-none opacity-80 z-0`.
- **Background:** Must fill with a translucent background (opacity ~5%) matching the zone's primary color (e.g., append hex `0D` to the color code like `#3b82f60D`). DO NOT use just text or whitespace for separation.

### 4. Node Card UI & Semantic Colors

- **Role Badge (Top):** Use neutral gray/slate (`bg-slate-100 text-slate-600`). DO NOT use vibrant colors divided by Region.
- **Node Border & Glow:** Card borders and outer glow ONLY represent the **actual operational state** (Health state). Do not use borders to indicate architectural risks or administrative down states — see **Section 14.6 (Semantic Color Contract)**.
    - Healthy (`health: green`): `border-emerald-500` and `shadow-[0_0_15px_rgba(16,185,129,0.3)]`
    - Degraded / Misconfigured (`health: amber`): `border-amber-500` and `shadow-[0_0_15px_rgba(245,158,11,0.3)]` — only used for devices **running but with errors** (duplicate IP, orphaned gateway, mismatch…)
    - Error / DOWN (`health: red`): use Red/Rose color scale
    - Administratively Down (`state: inactive`): `border-slate-400 border-dashed` border, `opacity-60`, **no glow** — used for `DISABLED`, admin-down, unprovisioned
- **Algorithm Visualizer node states** use separate colors (see Section 9, Requirement 6) — do not apply health/inactive contract for `settled`, `candidate`, `processing` states.
- **Status Badge (Bottom):** Each device must have a small pill badge at the bottom reporting current operational state (Example: `ONLINE`, `BGP UP`, `DOWN`).
- **Primary Spec (Core Parameter):** The subtext right below the device name must be the most important parameter:
    - Server (Compute/Host): Display IP Address.
    - Edge Router (PE Router/L3): Display **VRF Name** or **Loopback IP**.
    - **ABSOLUTELY DO NOT** place a generic interface name like `Gi0/0/0` here to cause architectural confusion.

### 5. Topology Links & Event Listeners

- **Resize Listener (IMPORTANT):** Since devices use `%`, it is Mandatory to have `window.addEventListener('resize', drawLinks);` to recalculate actual Pixel coordinates (based on `container.clientWidth` and `clientHeight`) and update the paths of `<svg><path>` elements whenever the browser resizes.
- **Line Animation:** Active network links must have flowing traffic animation (Traffic Flowing). Use `stroke-dasharray` combined with `.animate-dash` class calling CSS `@keyframes dash { to { stroke-dashoffset: -N; } }`.
- **Algorithm Visualizer link states:** `link-path` (emerald, animated dash + marker-end arrow), `link-candidate` (violet, animated dash), `link-active` (slate static), `link-down` (red dashed, opacity 0.5). Use two separate `<g>` layers: hit layer and visual layer.
- **Port Labels (Physical/Logical Port Labels):** Any port parameter (like `Gi1/0/24`, `eth0`) MUST be attached to both ends of the cable. Use JS interpolation math to push the Badge a safe relative distance from the Node center when the screen shrinks (e.g., `px = sx + (dx - sx) * 0.2`). Also, DO NOT pin the label dead center on the link, calculate the Normal Vector and Shift the label to both sides of the link about `18px` to avoid Anchor Collision with other labels at the Top/Bottom of the device.

### 6. Semantic Color Contract (One color — one meaning)

> **OBJECTIVE:** Each semantic color (emerald / amber / rose / violet / blue) must only convey **exactly one meaning** throughout the page. Do not combine fundamentally different states into the same color just because they are both "warnings".

| Axis                     | Answers the question                                          | Representation                                                           | Color                          |
| :----------------------- | :------------------------------------------------------------ | :----------------------------------------------------------------------- | :----------------------------- |
| **Health** (border+glow) | How is the device running?                                    | `green` = UP · `amber` = running but error/degraded · `red` = DOWN       | emerald / amber / rose         |
| **Inactive**             | Is it administratively shut down?                             | Dashed `slate` border, `opacity-60`, no glow                             | slate                          |
| **Risk**                 | Does the design have weaknesses? (SPOF, No HA, single uplink) | **Separate chip** at card corner or under Status Badge, NO border change | violet                         |
| **Highlight**            | Currently selected / tracing?                                 | Trace path, selected node, hover                                         | blue / cyan                    |
| **Algorithm states**     | Which algorithm step is the node at?                          | Only used in `algorithm-viz` — see Section 9 Req 6                       | pink/violet/emerald/blue/amber |

**Classification Rules (applied in order):**

1. Administratively down (`DISABLED`, admin-down, unprovisioned) → `inactive`, not `amber`.
2. Running but misconfigured (`DUP IP`, gateway orphaned, DHCP enabled on disabled interface) → `health: amber`.
3. Running correctly but design has risks (`NO HA · SPOF`) → `health: green` + **violet risk chip**. Border remains green because device operates normally.
4. Out of service / disconnected → `health: red`.

**Colors prohibited in wrong contexts:**

- **Zone Bounding Box / layer labels:** only use `blue`, `indigo`, `sky`, `cyan`, `slate`. DO NOT use `emerald`, `amber`, `rose`, `violet` for zones (to avoid confusing with health/risk).
- **Path Tracer / highlight:** use `blue` or `cyan`. DO NOT use `amber`.
- **Priority Labels (`HIGH` / `MEDIUM` / `LOW`):** use `rose` for HIGH, `slate` for MEDIUM/LOW. DO NOT use `amber` (reserved for health).
- **Selected Node Indicator:** use `outline` cyan separated from card by `outline-offset` (≥ 6px), DO NOT use `ring` / `border` / `shadow` overlapping health borders — cyan over amber/rose borders will falsify state color. When outlined, `clampNodes()` must leave `EDGE_PX ≥ outline-offset + thickness` to prevent clipping by `overflow-hidden`.
- **Status Badge (bottom pill):** pill color must match the axis described by text. `DISABLED` → slate; `DUP MGMT IP` → amber; `NO HA` → violet.

**Self-check before finalizing file:** list all locations using `amber`, `rose`, `violet`. If a color appears with more than one meaning (e.g., amber is both "disabled" and "SPOF"), it must be corrected according to the table above.

---

## 15. Shared UI Components Library

> **OBJECTIVE:** Some UI patterns appear repeatedly across templates (Protocol Simulator, Algorithm Visualizer, Failover Drill), proving they are common components rather than template-specific. This section standardizes them for AI reuse instead of reinventing them — and documents the fixed Zone color convention.

### 1. Teaching Note Box (Pinned)

Use for any template with a timeline/scenario (Protocol Simulator, Algorithm Visualizer, Failover Drill, Change/MOP) to explain the **pedagogical meaning** of the current step/scenario — distinct from pure technical descriptions.

```html
<div
    id="teaching-note"
    class="mx-3 mb-3 px-3 py-2.5 rounded-xl text-[11.5px] text-slate-400 leading-relaxed border-l-2 border-indigo-500"
    style="background:#6366f108"
>
    <i class="fas fa-lightbulb text-indigo-400 mr-1.5"></i>
    <b>Mechanism Name:</b>
    briefly explain why this step is important...
</div>
```

Rules:

- Always place at the **bottom of the right panel**, pinned (does not scroll with content above).
- Content changes according to current step/scenario, but the UI frame stays fixed.
- If a step has no note, hide the box completely (`display:none`) rather than leaving it empty.
- Fixed `indigo-500` border — this is the "teaching voice" of the system, independent of context (do not use amber/emerald here even if the content discusses warnings or success).

### 2. Packet Animation Engine, Timer Bar, Trigger Outage button

Full sample code exists in Section 1 and Section 6. Any template requiring packet animation, countdown timers, or outage trigger buttons MUST reference those implementations instead of writing from scratch.

### 3. Standard Area/Zone Color Convention (for all OSPF/multi-area labs)

To prevent Semantic Color Contract violations (using Risk/Health colors for zones), this is the MANDATORY default color palette for any lab with 2 or more OSPF areas/zones unless instructed otherwise:

| Area / Zone                                         | Mandatory Color | Hex       |
| :-------------------------------------------------- | :-------------- | :-------- |
| Area 0 (Backbone)                                   | blue            | `#3b82f6` |
| Area 1                                              | indigo          | `#6366f1` |
| Area 2 / NSSA                                       | sky             | `#0ea5e9` |
| Area 3+ (if any)                                    | cyan            | `#06b6d4` |
| Neutral zone (ABR/transit, not specific to an area) | slate           | `#64748b` |

Apply to BOTH the topology zone box AND any panel/legend referencing that same area.

### 4. Technical Recommendation (Optional): Shared Link + Flood-Highlight Function

If a new lab belongs to the OSPF-multi-area-topology group, consider writing a shared function for SVG link drawing and highlight routing:

```javascript
function drawTopologyLinks(linksArray, { highlightSet, activeSet, downSet }) {
    // returns <line> with corresponding class: lnk-down / lnk-up / lnk-active / lnk-flood
}
```

This is an optimization recommendation, not a mandatory rule.

### 5. Layout Variants: Vertical Scroll (Default) vs Split-Screen (Data-Heavy Labs)

- **Default — Vertical Scroll:** all Protocol / Troubleshooting / Failover / Packet-walk / Change-MOP labs use `min-h-screen`, naturally scrolling `<main>`, `max-w-7xl` (except `topology-design` which uses `max-w-[1600px]`).
- **Split-Screen Variant (Allowed):** only used when the learner needs to **simultaneously view** the running topology AND a large table/log updating per step (e.g. LSDB by router, VRRP/OSPF state, SPF distance table). Structure: `<main class="flex-1 flex flex-col xl:flex-row overflow-hidden" style="height:calc(100vh - <header+stepper>)">`, left topology (`flex-1`), right fixed panel `xl:w-[400px]`/`[420px]` with own scroll (`overflow-y-auto`). Stack vertically below `xl`.
- `algorithm-viz` always uses split-screen. Other labs only switch to split-screen when meeting the above condition — file length is NOT a criteria.

### 6. JS Architecture by Template

- Timeline templates (Protocol, Troubleshooting, Failover, Packet-walk): `class XxxSimulator { constructor(){…} }` + `let app; document.addEventListener('DOMContentLoaded', () => { app = new XxxSimulator(); });`, all `onclick` call `app.method()`.
- `algorithm-viz`: module `const App = (() => {…})()` is acceptable (reactive engine, no fixed stepper).
- Diagnostic Playbook / Topology Design / Change-MOP: global functions or simple objects (static tabs/states), class not mandatory.
- `clampNodes()` is only needed for canvases with nodes absolutely positioned by `%` (data-driven). Flexbox card labs or topology-less labs do not need it.
- Labs that already have separate explanation panels ("Risks & Notes", Root Cause) do not need an additional Teaching Note box.
