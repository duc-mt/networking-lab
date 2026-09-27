import re

with open('projects/topology-design/evpn-vxlan-mpls-transit.html', 'r') as f:
    content = f.read()

css_to_remove = [
    r'\.link-label-group\s*\{[^}]*\}',
    r'\.link-label-bg\s*\{[^}]*\}',
    r'\.dark \.link-label-bg\s*\{[^}]*\}',
    r'\.link-label-text\s*\{[^}]*\}',
    r'\.dark \.link-label-text\s*\{[^}]*\}',
]

for pattern in css_to_remove:
    content = re.sub(pattern, '', content)

with open('projects/topology-design/evpn-vxlan-mpls-transit.html', 'w') as f:
    f.write(content)
