---
name: design-system-rules
description: Mandatory UI/UX and lab-authoring rules for the networking-lab project.
trigger: always_on
---

# networking-lab rules

The global `AGENTS.md` and the global `modern-ui` skill already cover the git workflow, secrets, and the base design system (palette, typography, layout, semantic status colors). This file only adds what is specific to this project. Where they conflict, this file wins.

## UI work

- Every HTML/CSS or UI change in this project applies the global `modern-ui` skill.
- Transitions: use the project's `.transition-all-fast` class.
- Base surfaces: `<body>` must strictly use `bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-200`. Never use `bg-slate-100` or `dark:bg-slate-900` for `<body>` (cards within the body use `bg-slate-900` in dark mode).
- Strict color tokens: Strictly use Tailwind Slate tokens (`bg-slate-900`, `border-slate-800`, `text-slate-400`). Never hardcode ad-hoc neutral hex like `#1e1e1e`, `#2d2d2d`, `#0f172a`, or `border-black/50`.
- Hardware & Telemetry Aesthetics: Avoid flat, lifeless cards. Terminal/CLI windows must use `bg-slate-950 border border-slate-800 font-mono text-xs`. Nodes and cards should use subtle depth (e.g. status LED indicators with `animate-pulse`, subtle health glow).

## Lab authoring

- When asked to create a new lab, read `docs/prompt-templates.md` first and choose exactly one of the 8 existing templates (e.g. Protocol Simulator, Troubleshooting).
- Canvas wrapper: Always wrap topology canvases in `<div class="w-full overflow-x-auto">` with an inner `<section id="topology-canvas" style="min-width: 900px;" ...>` to guarantee responsive horizontal scrolling on small viewports without breaking node coordinates.
- Follow the invariants in the template: how `clampNodes()` is used, how the `Mode Toggle` button is built, and the bilingual standards noted there.
- Selected node indicator: Always use `outline outline-2 outline-cyan-500 outline-offset-4` (or `outline-offset-[6px]`). Never use `border` or `box-shadow` for selection, as those are reserved for health state.
- Classification rules for semantic status colors: `docs/prompt-templates.md`, section 13.6. Structural and transit links (e.g. MPLS, WAN, Trunk) must never use `amber`, `rose`, or `emerald` for normal state.

## Bilingual standard (English + Vietnamese)

UI text mixes English and Vietnamese following network-engineer convention:

- **Keep in English:** the main lab title (H1), system states (e.g. `ONLINE`, `ERR-DISABLE`), Stepper labels (e.g. `INIT`, `VERIFY`), role and device names (e.g. `Core Switch`), and all CLI/console output. Never translate technical terms (Routing, OSPF, Payload, Failover, ...).
- **Write in Vietnamese:** detailed descriptions, step explanations, subheadings and analysis sections. Keep the tone professional and concise.

## Data sanitization

Even if a prompt contains real IPs, MACs, hostnames, domains, passwords, tokens or VLAN IDs, replace them with dummy data before generating any HTML:

- **Public IPs:** Strictly use RFC 5737 documentation ranges (`198.51.100.x`, `203.0.113.x`, `192.0.2.x`). Never use real ISP public IPs.
- **Private IPs:** Strictly use RFC 1918 ranges (`10.x.x.x`, `172.16.x.x`, `192.168.x.x`).
- **Device & Hostnames:** Use standard dummy naming (`FW-CORE`, `SW-ACCESS-01`, `R1`). Never write raw sensitive data into code files.
