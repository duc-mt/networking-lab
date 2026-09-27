import re

with open('projects/topology-design/evpn-vxlan-mpls-transit.html', 'r') as f:
    content = f.read()

# 1. Update Zones
content = content.replace(
    'bounds: { left: 40, top: 40, width: 260, height: 420 }',
    'bounds: { left: 20, top: 40, width: 240, height: 420 }'
)
content = content.replace(
    'bounds: { left: 340, top: 40, width: 320, height: 420 }',
    'bounds: { left: 280, top: 40, width: 440, height: 420 }'
)
content = content.replace(
    'bounds: { left: 700, top: 40, width: 260, height: 420 }',
    'bounds: { left: 740, top: 40, width: 240, height: 420 }'
)

# 2. Update Nodes X coordinates
content = content.replace('x: 170', 'x: 140')
content = content.replace('x: 420', 'x: 370')
content = content.replace('x: 580', 'x: 630')
content = content.replace('x: 830', 'x: 860')

# 3. Update Links
content = content.replace(
    '{ id: "l3", src: "pe-onprem", dst: "pe-cloud", type: "routed", label: "MPLS L3VPN, VRF CORP" }',
    '{ id: "l3", src: "pe-onprem", dst: "pe-cloud", type: "mpls", label: "MPLS L3VPN, VRF CORP", curve: 100 }'
)

# 4. Update Badge Styles in drawLinks()
old_badge_js = """        let badgeStyle = "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700";
        if (l.type === 'overlay') badgeStyle = "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300 border-purple-200 dark:border-purple-700";
        if (l.type === 'trunk') badgeStyle = "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700";"""

new_badge_js = """        let badgeStyle = "bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 border-blue-200 dark:border-blue-800"; // default routed
        if (l.type === 'overlay') badgeStyle = "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300 border-purple-200 dark:border-purple-700";
        if (l.type === 'trunk') badgeStyle = "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700";
        if (l.type === 'mpls') badgeStyle = "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300 border-amber-200 dark:border-amber-700";"""

content = re.sub(old_badge_js, new_badge_js, content)

# 5. Add CSS for .link-line.type-mpls and update type-routed
old_css = """    .link-line.type-routed { stroke: #94a3b8; }
    .dark .link-line.type-routed { stroke: #64748b; }
    .link-line.type-overlay { stroke: #a855f7; stroke-width: 3; stroke-dasharray: 8; }"""

new_css = """    .link-line.type-routed { stroke: #3b82f6; stroke-dasharray: 2; }
    .dark .link-line.type-routed { stroke: #2563eb; }
    .link-line.type-mpls { stroke: #f59e0b; stroke-width: 3; }
    .dark .link-line.type-mpls { stroke: #d97706; }
    .link-line.type-overlay { stroke: #a855f7; stroke-width: 3; stroke-dasharray: 8; }"""

content = re.sub(old_css, new_css, content)

with open('projects/topology-design/evpn-vxlan-mpls-transit.html', 'w') as f:
    f.write(content)
