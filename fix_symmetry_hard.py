import re

with open('projects/topology-design/evpn-vxlan-mpls-transit.html', 'r') as f:
    content = f.read()

# Fix pe-onprem
content = content.replace(
    'id: "pe-onprem", name: "PE-OnPrem", role: "PE Router", zone: "mpls", icon: "fa-route", x: 420, y: 250, health: "green", status: "ONLINE", specs: { vrf: "VRF: CORP", loopback: "10.0.0.22", routing: "OSPF/LDP" }',
    'id: "pe-onprem", name: "PE-OnPrem", role: "PE Router", zone: "mpls", icon: "fa-route", x: 440, y: 250, health: "green", status: "ONLINE", specs: { vrf: "VRF: CORP", loopback: "10.0.0.11", routing: "OSPF/LDP" }'
)
content = content.replace(
    'id: "pe-onprem", name: "PE-OnPrem", role: "PE Router", zone: "mpls", icon: "fa-route", x: 420, y: 250, health: "green", status: "ONLINE", specs: { vrf: "VRF: CORP", loopback: "10.0.0.11", routing: "OSPF/LDP" }',
    'id: "pe-onprem", name: "PE-OnPrem", role: "PE Router", zone: "mpls", icon: "fa-route", x: 440, y: 250, health: "green", status: "ONLINE", specs: { vrf: "VRF: CORP", loopback: "10.0.0.11", routing: "OSPF/LDP" }'
)

# Fix zones
content = content.replace(
    'bounds: { left: 20, top: 40, width: 280, height: 420 }',
    'bounds: { left: 40, top: 40, width: 280, height: 420 }'
)
content = content.replace(
    'bounds: { left: 320, top: 40, width: 520, height: 420 }',
    'bounds: { left: 340, top: 40, width: 500, height: 420 }'
)

# Fix other nodes
content = content.replace('x: 160', 'x: 180')

with open('projects/topology-design/evpn-vxlan-mpls-transit.html', 'w') as f:
    f.write(content)
