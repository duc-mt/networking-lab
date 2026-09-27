import re

with open('projects/topology-design/evpn-vxlan-mpls-transit.html', 'r') as f:
    content = f.read()

# Add CSS keyframes
css_injection = """    <style>
    @keyframes dash { to { stroke-dashoffset: -20; } }
    .animate-dash { animation: dash 1s linear infinite; }
"""
content = content.replace('    <style>', css_injection)

# Add .animate-dash to all links in drawLinks()
content = content.replace(
    "path.setAttribute('class', `link-line type-${l.type}`);",
    "path.setAttribute('class', `link-line type-${l.type} animate-dash`);"
)

# Update dash arrays so they animate nicely
old_css = """    .link-line.type-routed { stroke: #3b82f6; stroke-dasharray: 2; }
    .dark .link-line.type-routed { stroke: #2563eb; }
    .link-line.type-mpls { stroke: #f59e0b; stroke-width: 3; }
    .dark .link-line.type-mpls { stroke: #d97706; }
    .link-line.type-overlay { stroke: #a855f7; stroke-width: 3; stroke-dasharray: 8; }"""

new_css = """    .link-line.type-routed { stroke: #3b82f6; stroke-dasharray: 6 4; }
    .dark .link-line.type-routed { stroke: #2563eb; }
    .link-line.type-mpls { stroke: #f59e0b; stroke-width: 3; stroke-dasharray: 8 6; }
    .dark .link-line.type-mpls { stroke: #d97706; }
    .link-line.type-overlay { stroke: #a855f7; stroke-width: 3; stroke-dasharray: 10 5; }
    .link-line.type-trunk { stroke: #10b981; stroke-dasharray: 5 3; }"""
    
content = content.replace(old_css, new_css)

# Remove the old type-trunk CSS rule since I'm placing it inside new_css for organization
content = content.replace('    .link-line.type-trunk { stroke: #10b981; stroke-dasharray: 4; }\n', '')

with open('projects/topology-design/evpn-vxlan-mpls-transit.html', 'w') as f:
    f.write(content)
