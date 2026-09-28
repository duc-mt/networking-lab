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

## Lab authoring

- When asked to create a new lab, read `docs/prompt-templates.md` first and choose exactly one of the 8 existing templates (e.g. Protocol Simulator, Troubleshooting).
- Follow the invariants in the template: how `clampNodes()` is used, how the `Mode Toggle` button is built, and the bilingual standards noted there.
- Classification rules for semantic status colors: `docs/prompt-templates.md`, section 13.6.

## Bilingual standard (English + Vietnamese)

UI text mixes English and Vietnamese following network-engineer convention:

- **Keep in English:** the main lab title (H1), system states (e.g. `ONLINE`, `ERR-DISABLE`), Stepper labels (e.g. `INIT`, `VERIFY`), role and device names (e.g. `Core Switch`), and all CLI/console output. Never translate technical terms (Routing, OSPF, Payload, Failover, ...).
- **Write in Vietnamese:** detailed descriptions, step explanations, subheadings and analysis sections. Keep the tone professional and concise.

## Data sanitization

Even if a prompt contains real IPs, MACs, hostnames, domains, passwords, tokens or VLAN IDs, replace them with dummy data before generating any HTML (`10.x.x.x`, `192.168.x.x`, `1.1.1.1`, `FW-CORE`, `SW-ACCESS-01`, `R1`). Never write raw sensitive data into code files.
