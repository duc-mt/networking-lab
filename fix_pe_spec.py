import re

with open('projects/topology-design/evpn-vxlan-mpls-transit.html', 'r') as f:
    content = f.read()

# Change PE router primary specs to VRF instead of Gi0/0/0
content = content.replace(
    'specs: { interface: "Gi0/0/0", vrf: "CORP", routing: "OSPF/LDP" }',
    'specs: { vrf: "VRF: CORP", loopback: "10.0.0.11", routing: "OSPF/LDP" }'
)
# Make PE-Cloud have a different loopback
content = content.replace(
    'loopback: "10.0.0.11"',
    'loopback: "10.0.0.22"',
    1 # Only replace the second occurrence which is pe-cloud (actually wait, the first replace replaced both, so I need a smarter replace)
)

with open('projects/topology-design/evpn-vxlan-mpls-transit.html', 'w') as f:
    f.write(content)

# Fix loopback for PE-Cloud
with open('projects/topology-design/evpn-vxlan-mpls-transit.html', 'r') as f:
    content2 = f.read()
content2 = content2.replace(
    'id: "pe-cloud", name: "PE-Cloud", role: "PE Router", zone: "mpls", icon: "fa-route", x: 740, y: 250, health: "green", status: "ONLINE", specs: { vrf: "VRF: CORP", loopback: "10.0.0.11"',
    'id: "pe-cloud", name: "PE-Cloud", role: "PE Router", zone: "mpls", icon: "fa-route", x: 740, y: 250, health: "green", status: "ONLINE", specs: { vrf: "VRF: CORP", loopback: "10.0.0.22"'
)
with open('projects/topology-design/evpn-vxlan-mpls-transit.html', 'w') as f:
    f.write(content2)
