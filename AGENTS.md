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

| Template                  | `type` key            | When to Use                                                                                         |
| ------------------------- | --------------------- | ------------------------------------------------------------------------------------------------ |
| Protocol Simulator        | `protocol`            | Explaining protocol operations over time (FSM, packet exchange)                              |
| Troubleshooting Lab       | `troubleshooting`     | Recreating the incident response process: symptom → root cause → fix                                       |
| Security Packet Walk      | `packet-walk`         | Tracing packets through firewall/NAT pipelines                                                           |
| Change / MOP Flow         | `change-mop`          | Documenting a maintenance window: pre-check → execute → rollback                                  |
| Automation Workflow       | `automation`          | Illustrating scripts/APIs: payload → response → error handling                                         |
| Failover / HA Drill       | `failover`            | Resilience testing: trigger → timer countdown → convergence                                         |
| Topology Design Reference | `topology-design`     | HLD/blueprint of a complete network architecture, without a timeline                                       |
| Diagnostic Playbook       | `diagnostic-playbook` | Catalog of N failure modes on the same topology — flip tabs to compare                                  |
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

*(Translator note: If the user explicitly asks for an all-English lab, Vietnamese can be omitted. However, the default bilingual rule remains for standard project labs).*

## 7. Principle of Restraint

- **Avoid Feature Bloat:** When creating a new page, DO NOT try to cram all existing patterns (macOS terminals, floating shadow-xl cards, pill tabs, live Dijkstra engines, etc.) into a single interface.
- **Selective Application:** Only use UI components or engine features that genuinely benefit the user experience or align with the specific learning objective of that lab. 
- Prioritize a clean, focused, and purposeful interface over showing off every available design feature, to prevent the UI from becoming cluttered or overwhelming.
