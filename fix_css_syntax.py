import re

with open('projects/topology-design/evpn-vxlan-mpls-transit.html', 'r') as f:
    content = f.read()

# Remove dangling .dark and empty lines in style block
content = re.sub(r'\.dark\s*\n', '\n', content)
content = re.sub(r'\s*\.dark\s*$', '', content, flags=re.MULTILINE)

with open('projects/topology-design/evpn-vxlan-mpls-transit.html', 'w') as f:
    f.write(content)
