---
name: lab-cloning-protocol
description: Validate cloned HTML templates and JS schemas for network labs. Use when cloning an existing lab HTML to create a new one, or duplicating a template file. Do NOT use when creating a lab completely from scratch.
---

# Lab Cloning Protocol

When duplicating (cloning) an existing lab template to create a new one, the AI MUST execute the following strict validation protocol to prevent data structure errors and leftover text.

## 1. Anti-Leftover Scan (Regex Verification)

Before considering the cloning task complete, you MUST perform a full-text search (`grep -inE`) on the newly created HTML file for specific domain terms associated with the _source_ lab.

- **Goal:** Ensure all static HTML headers, metadata, descriptions, and `<title>` tags are updated to the new context.
- **Example:** If cloning from `wireguard-pfsense-walk.html`, grep for `wireguard|wg0|51820|pfsense|allowedips`.
- Replace any remaining old text with the new domain terminology.

## 2. Schema Validation (JS Data Structure)

When modifying JSON/JS data structures (like `TIMELINE`, `nodes`, `links`) within the cloned file:

- You MUST explicitly verify the structure required by the existing JS render functions (e.g., `PacketWalkApp.render()`, `TopologyApp.render()`). Do not assume a flat object is acceptable if the rendering engine expects an Array of objects (`map()`).
- Always check the expected keys and types before replacing data.
- **Validation:** Run a syntax check (`node -c`) or DOM test before finalizing to ensure the rendering script does not throw `TypeError` or `ReferenceError` on load.

## 3. Output Requirements

After cloning and modifying a lab, your output to the user MUST include:

- Confirmation that the Anti-Leftover Scan was performed (list the terms searched).
- Confirmation that Schema Validation passed and no JS errors were detected.

## Expected Output Format

Provide the validated code or text adhering to the skill's specific guidelines, along with a confirmation of the checks performed.
