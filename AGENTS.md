---
name: design-system-rules
description: Mandatory UI/UX rules and design patterns for the networking-lab project.
trigger: always_on
---

# Mandatory Design System (UI/UX)

Whenever generating or editing HTML/CSS or interface components in this project, the AI MUST strictly adhere to the following rules to maintain a modern, refined, and consistent aesthetic across the entire project:

## 1. Color Palette

- **No Pure White/Black:** Never use `#ffffff` or `#000000`. You must use the Tailwind `Slate` neutral color scale.
- **Backgrounds:** Light mode must always use `bg-slate-50`. Dark mode must always use `bg-slate-950`.
- **Cards/Surfaces:** In Dark mode, cards must use `bg-slate-900` combined with a thin `border-slate-800` to create depth.
- **Accents:** Instead of harsh flat colors, use subtle gradients (e.g., `bg-gradient-to-br from-blue-500 to-indigo-600`) for logos, icons, or primary buttons.

## 2. Typography

- **Main UI Text:** Must use the sans-serif font `Inter`. Adjust weights appropriately: `font-extrabold` for main headings, `font-medium` for secondary text.
- **Code/Technical/Tags:** Must use the Monospace font `Fira Code` for status badges, labels, and technical parameters.
- **Tracking (Letter Spacing):** Large headings must have tight spacing (`tracking-tight`). Small/secondary labels must be uppercase and widely spaced (`uppercase tracking-widest text-xs`).

## 3. Effects, Layout & Whitespace

- **Header:** Always use the Glassmorphism effect (`backdrop-blur-md bg-white/80 dark:bg-slate-900/80`).
- **Whitespace:** Intentionally maintain generous padding and margins (e.g., `gap-20`, `py-24`) between content blocks. Do not cram UI elements.
- **Micro-interactions:** Use the project's `.transition-all-fast` class. Hovering over cards should cause a slight lift (`hover:-translate-y-1 hover:shadow-lg`) without abrupt color changes.

## 4. Data Security (Global Security Rule)

- **ABSOLUTELY ANONYMIZE REAL DATA:** If the user's prompt contains real IPs, MACs, hostnames of a company/client, or sensitive data... the AI **MUST** automatically sanitize and replace them with dummy data before generating HTML.
- Replace real IPs with dummy IPs (e.g., `10.x.x.x`, `192.168.x.x`, `1.1.1.1`).
- Replace real hostnames with generic names (e.g., `FW-CORE`, `SW-ACCESS-01`, `R1`).
- Mask all real passwords, tokens, domain names, and VLAN IDs. **Never** output raw sensitive data into the code file.

## 5. Lab Source Code Structure (Engine & Templates)

- Whenever asked to create a new Lab, the AI **MUST** read the `docs/prompt-templates.md` file to select exactly 1 of the 9 available structures (e.g., Protocol Simulator, Troubleshooting, Algorithm Visualizer, etc.).
- Strict adherence to immutable template rules is required: the usage of the `clampNodes()` function, the `Mode Toggle` button implementation, and the Bilingual Standards noted there.
- Before writing new code for Packet Animations, Timer Bars, Trigger Outage buttons, or Teaching Note boxes, the AI **MUST** check Section 15 (`Shared UI Components Library`) of `prompt-templates.md` — these patterns have verified sample implementations and must not be rewritten from scratch.
- Layout: vertical scrolling by default; split-screen only for data-heavy labs (see Section 15.5). JS Architecture: timeline templates use `class XxxSimulator` + `app` variable (Section 15.6).
- Any lab with >= 2 OSPF areas/zones (or similar multi-area architecture) **MUST** use the exact Area/Zone color palette in Section 15.3: Area 0 = blue `#3b82f6`, Area 1 = indigo `#6366f1`, Area 2/NSSA = sky `#0ea5e9`, Area 3+ = cyan `#06b6d4`. This is a bug that has recurred 3 times in practice (accidentally using violet/emerald) — do not let it happen again.

### Table of 9 Templates — Quick Selection:

| Template                  | `type` key            | When to Use                                                                                     |
| ------------------------- | --------------------- | ----------------------------------------------------------------------------------------------- |
| Protocol Simulator        | `protocol`            | Explaining protocol operations over time (FSM, packet exchange)                                 |
| Troubleshooting Lab       | `troubleshooting`     | Recreating the incident response process: symptom → root cause → fix                            |
| Security Packet Walk      | `packet-walk`         | Tracing packets through firewall/NAT pipelines                                                  |
| Change / MOP Flow         | `change-mop`          | Documenting a maintenance window: pre-check → execute → rollback                                |
| Automation Workflow       | `automation`          | Illustrating scripts/APIs: payload → response → error handling                                  |
| Failover / HA Drill       | `failover`            | Resilience testing: trigger → timer countdown → convergence                                     |
| Topology Design Reference | `topology-design`     | HLD/blueprint of a complete network architecture, without a timeline                            |
| Diagnostic Playbook       | `diagnostic-playbook` | Catalog of N failure modes on the same topology — flip tabs to compare                          |
| **Algorithm Visualizer**  | **`algorithm-viz`**   | **Live graph algorithm running on an interactive topology (Dijkstra SPF, Bellman-Ford, CSPF…)** |

### When to choose Algorithm Visualizer (type: `algorithm-viz`):

Use this when the learning objective is to **observe algorithm computations on a graph** and the learner needs to **manually modify the topology** to see immediate changes. Unlike Protocol Simulator (linear timeline, passive), the Algorithm Visualizer is **reactive**: the user clicks a link to shut it down or change its cost → the algorithm reruns → paths/tables update in real-time.

Suitable lab examples:

- OSPF SPF / Dijkstra — click links to shutdown or change cable type, see paths change
- IS-IS SPF on dual-topology (L1/L2)
- MPLS-TE CSPF with bandwidth constraints
- BGP best-path selection with multiple attributes
- STP Bellman-Ford / port role election when links change

## 6. Bilingual Standards

When writing content displayed on the UI, you must mix English and Vietnamese according to Network Engineering standards:

- **English (Keep As-Is):** Main Lab Titles (H1), system states (e.g., `ONLINE`, `ERR-DISABLE`), Stepper labels (e.g., `INIT`, `VERIFY`), Role/Device names (e.g., `Core Switch`), and all CLI/Console output. Absolutely do not translate specialized terminology (like Routing, OSPF, Payload, Failover).
- **Vietnamese:** Detailed descriptions, step explanations, subheadings, and analysis sections. The tone must be professional and concise.

_(Translator note: If the user explicitly asks for an all-English lab, Vietnamese can be omitted. However, the default bilingual rule remains for standard project labs)._

## 8. Strict UI Component Pre-Flight & Layout Geometry Rules

Whenever building or editing a lab interface, the AI MUST strictly follow these verified UI patterns to guarantee visual consistency across the portfolio:

- **Header Bar Alignment & Unified Control Cluster (matching `vxlan-mtu-blackhole.html`):** Must use standard sticky header (`sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800`), containing a type icon gradient badge (`w-10 h-10 rounded-lg`), `Portfolio` link back to `../../index.html`, and page H1.
    - **Playback Controls Placement:** For timeline or interactive visualizer labs, all playback controls (`prev`, `play/pause`, `next`, `reset`) MUST be grouped with the theme toggle in the **top-right header** inside a unified rounded-full pill container (`flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-inner`).
    - **STRICT PROHIBITION:** Never invent custom isolated bottom footer bars for step navigation/playback controls. All controls belong in the top-right header cluster to preserve maximum vertical canvas height and consistency.
- **Dual-Layer Cable Connector Standard:**
  All SVG topology links MUST use the verified dual-layer cable architecture:
    1. **Base Track Layer (`.link-track`):** `stroke-width: 6; stroke-linecap: round; stroke: rgba(203, 213, 225, 0.45);` (light) / `rgba(51, 65, 85, 0.55);` (dark).
    2. **Active Flow Overlay Layer (`.link-flow-...`):** `stroke-width: 4` or `5`, `stroke-linecap: round`, using `@keyframes dash { to { stroke-dashoffset: -24; } }` and `.animate-dash` (`1.2s linear infinite`) with SVG arrow markers and glow filters.
        - Active/Path: Emerald `#10b981` (or Blue `#3b82f6`) with `filter: drop-shadow(0 0 6px rgba(16, 185, 129, 0.75))`.
        - Candidate/Evaluating: Violet `#818cf8` with `filter: drop-shadow(0 0 5px rgba(129, 140, 248, 0.7))`.
        - Down/Fault: Red `rgba(239, 68, 68, 0.85); stroke-dasharray: 4 12;`.
    3. **Interactive Hit Layer (`.topology-hit`):** `stroke: transparent; stroke-width: 24; cursor: pointer;` on the top SVG layer for effortless click interactions.
- **Dynamic 2D Packet Flow Engine:**
  For any lab with packet exchange or traffic delivery, use the Web Animations API engine on a floating `#animated-packet` badge (`cubic-bezier(0.4, 0, 0.2, 1)`, scale `0.75 → 1 → 0.75`, opacity fade) calculating dynamic node center coordinates via `getBoundingClientRect()`. Supports hop-by-hop recursive traversal (`animatePathSequence`) for multi-hop paths.
- **Mode Toggle Bar:** Use container `flex bg-slate-200/50 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner` with `.mode-btn` buttons (`bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400 font-bold`).
- **5-Layer Node Card Standard:**
    1. Top absolute role badge (`absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-bold border`).
    2. Circular gradient icon housing (`w-12 h-12 bg-gradient-to-b from-slate-50 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-full flex items-center justify-center border border-slate-300 dark:border-slate-600 shadow-inner`).
    3. Device title (`h3 text-sm font-extrabold text-slate-800 dark:text-white`).
    4. Monospace IP/Subnet badge (`text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded`).
    5. Bottom status pill (`text-[9px] font-black tracking-widest px-2.5 py-0.5 rounded-full uppercase border`).
- **Terminal Console Standard:** Must use macOS terminal header (`bg-[#1e1e1e]` container with `bg-[#2d2d2d]` header, red/yellow/green traffic dots, `#cli-title`, `vt100` tag, and `text-emerald-400` monospace output).
- **FontAwesome Icon Verification:** Never invent icon class names like `fa-router`. Use verified FontAwesome 6 Free classes (`fa-route`, `fa-network-wired`, `fa-server`, `fa-diagram-project`, `fa-microchip`, `fa-globe`).
- **Legend & Topology Geometry (Zero Overlap):** Topology canvas height must be at least `h-[540px]`. Area SVG bounding rects must be set to `height="78%"` or less at `y="5%"`, ensuring Area bottom borders end above `83%` so embedded bottom Legend overlays (`bottom-3.5`) never overlap Area borders or Node cards.
- **Node vs Zone Responsive Padding:** Because node cards use fixed physical widths (`w-32` = 128px) while Zone SVG backgrounds scale responsively by percentage, all Zones must be drawn wide enough (e.g. `w >= 260` on a 1400 REF_W) to prevent fixed-width nodes from clipping out on small screens. Nodes MUST be perfectly centered on their Zone's x-axis (`node.x = zone.x + zone.w/2`).
