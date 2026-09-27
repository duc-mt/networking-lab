# Networking Lab Portfolio - Design & Styling Rules

When creating or modifying topology designs and pages in this portfolio, YOU MUST strictly adhere to the following design system rules to ensure visual consistency across all labs (e.g. matching `rogue-dhcp-investigation.html` and `evpn-vxlan-mpls-transit.html`):

## 1. Canvas and Layout Widths (Ultra-wide Support)
- **Main Container**: The `<main>` wrapper must use `class="flex-1 w-full max-w-[1600px] mx-auto ..."` (Do NOT use `max-w-7xl`).
- **Topology Canvas**: The topology container `<div id="topology-container">` must use `class="relative w-full max-w-[1400px] mx-auto overflow-x-auto ..."` and `style="min-width: 1400px;"`. This ensures the topology spans ultra-wide screens perfectly while allowing horizontal scrolling on smaller devices.

## 2. Node Positioning & Symmetry
- Use absolute pixel coordinates (e.g., `x: 180, y: 350`) carefully calculated across the `1400px` base canvas to ensure perfect mathematical left-right symmetry.
- Do NOT bunch nodes on the left. Spread them edge-to-edge.

## 3. Zone Bounding Boxes
- ALWAYS draw visible dashed frames to demarcate regions (e.g., On-Prem, Cloud, MPLS).
- **Style**: `absolute border-2 border-dashed rounded-xl pointer-events-none opacity-80 z-0`.
- **Backgrounds**: Apply a faint background tint corresponding to the zone's primary color (e.g. using `hex + '0D'` for ~5% opacity). DO NOT rely solely on whitespace or text labels to separate zones.

## 4. Node Card UI & Semantic Colors
- **Role Badge (Top)**: Keep it visually neutral (e.g., Slate/Gray). Do NOT color code this by region.
- **Node Border & Glow**: Driven strictly by the node's `health` state (Green/Emerald for healthy, Yellow/Amber for warning, Red for down). Apply a drop-shadow glow (e.g., `shadow-[0_0_15px_rgba(16,185,129,0.3)]`).
- **Status Badge (Bottom)**: Every node must have a tiny pill badge at the bottom indicating operational state (e.g., `ONLINE`, `BGP UP`, `DOWN`).
- **Primary Spec**: The text directly under the Node Name must be a highly relevant identifier. For Compute: IP Address. For PE Routers: `VRF Name` or `Loopback IP`. **NEVER** put a generic physical interface like `Gi0/0/0` here.

## 5. Topology Links & Interface Labels
- **Line Animation**: Data flows must feel alive. Use `stroke-dasharray` and a CSS keyframe (`@keyframes dash`) to animate the `stroke-dashoffset` of active links.
- **Port Labels**: Physical/Logical interfaces (`Gi1/0/24`, `eth0`, `Tunnel0`) must NOT be placed in the node's center or floating mid-link. They must be rendered as tiny HTML badges pinned near the `src` (e.g. 15-20% along the path) and `dst` (80-85% along the path) endpoints of the SVG paths.
