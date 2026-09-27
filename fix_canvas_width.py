import re

with open('projects/topology-design/evpn-vxlan-mpls-transit.html', 'r') as f:
    content = f.read()

# 1. Expand the <main> width
content = content.replace(
    '<main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col gap-8">',
    '<main class="flex-1 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col gap-8">'
)

# 2. Expand topology-container width and allow scrolling on small screens
content = content.replace(
    'class="relative bg-slate-50 dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner overflow-hidden w-full max-w-[1180px] mx-auto h-[500px] my-6"',
    'class="relative bg-slate-50 dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner overflow-x-auto w-full max-w-[1400px] mx-auto h-[500px] my-6"'
)
# Note: we also have an inline style bounding the internal min-width to force scroll if needed
content = content.replace(
    '<div id="topology-container"',
    '<div id="topology-container" style="min-width: 1400px;"'
)

# 3. Update Data Coordinates for 1400px layout
old_data = r"""      zones: \[
        \{ id: "on-prem", label: "ON-PREMISES SITE", color: "#3b82f6", bounds: \{ left: 40, top: 40, width: 280, height: 420 \} \},
        \{ id: "mpls", label: "MPLS TRANSIT \(WAN\)", color: "#f59e0b", bounds: \{ left: 340, top: 40, width: 500, height: 420 \} \},
        \{ id: "cloud", label: "CLOUD REGION", color: "#8b5cf6", bounds: \{ left: 860, top: 40, width: 280, height: 420 \} \}
      \],
      nodes: \[
        \{ id: "vtep-onprem", name: "VTEP-OnPrem", role: "VTEP / L2 GW", zone: "on-prem", icon: "fa-network-wired", x: 180, y: 150, health: "green", status: "BGP UP", specs: \{ loopback: "10.255.0.1", vtep_ip: "10.255.0.1", vni: "10100" \}, tableType: "bgp", tableData: \[ \{ neighbor: "10.255.0.2", asn: "65000", state: "Establ", prefixes: "2" \} \] \},
        \{ id: "pe-onprem", name: "PE-OnPrem", role: "PE Router", zone: "mpls", icon: "fa-route", x: 440, y: 250, health: "green", status: "ONLINE", specs: \{ vrf: "VRF: CORP", loopback: "10.0.0.11", routing: "OSPF/LDP" \}, tableType: "routes", tableData: \[ \{ prefix: "10.255.0.2/32", nextHop: "MPLS", label: "1014" \} \] \},
        \{ id: "pe-cloud", name: "PE-Cloud", role: "PE Router", zone: "mpls", icon: "fa-route", x: 740, y: 250, health: "green", status: "ONLINE", specs: \{ vrf: "VRF: CORP", loopback: "10.0.0.22", routing: "OSPF/LDP" \}, tableType: "routes", tableData: \[ \{ prefix: "10.255.0.1/32", nextHop: "MPLS", label: "2048" \} \] \},
        \{ id: "vtep-cloud", name: "VTEP-Cloud", role: "VTEP / L2 GW", zone: "cloud", icon: "fa-network-wired", x: 1000, y: 150, health: "green", status: "BGP UP", specs: \{ loopback: "10.255.0.2", vtep_ip: "10.255.0.2", vni: "10100" \}, tableType: "bgp", tableData: \[ \{ neighbor: "10.255.0.1", asn: "65000", state: "Establ", prefixes: "2" \} \] \},
        \{ id: "host-a", name: "Host-A", role: "Compute", zone: "on-prem", icon: "fa-server", x: 180, y: 350, health: "green", status: "ONLINE", specs: \{ ip: "10.1.100.10/24", gw: "10.1.100.1", mac: "00:1A:2B:3C:4D:5E" \}, tableType: "interfaces", tableData: \[ \{ iface: "eth0", status: "up", speed: "10G" \} \] \},
        \{ id: "host-b", name: "Host-B", role: "Compute", zone: "cloud", icon: "fa-server", x: 1000, y: 350, health: "green", status: "ONLINE", specs: \{ ip: "10.1.100.20/24", gw: "10.1.100.1", mac: "00:5E:4D:3C:2B:1A" \}, tableType: "interfaces", tableData: \[ \{ iface: "eth0", status: "up", speed: "10G" \} \] \}
      \],"""

new_data = """      zones: [
        { id: "on-prem", label: "ON-PREMISES SITE", color: "#3b82f6", bounds: { left: 40, top: 40, width: 320, height: 420 } },
        { id: "mpls", label: "MPLS TRANSIT (WAN)", color: "#f59e0b", bounds: { left: 380, top: 40, width: 640, height: 420 } },
        { id: "cloud", label: "CLOUD REGION", color: "#8b5cf6", bounds: { left: 1040, top: 40, width: 320, height: 420 } }
      ],
      nodes: [
        { id: "vtep-onprem", name: "VTEP-OnPrem", role: "VTEP / L2 GW", zone: "on-prem", icon: "fa-network-wired", x: 200, y: 150, health: "green", status: "BGP UP", specs: { loopback: "10.255.0.1", vtep_ip: "10.255.0.1", vni: "10100" }, tableType: "bgp", tableData: [ { neighbor: "10.255.0.2", asn: "65000", state: "Establ", prefixes: "2" } ] },
        { id: "pe-onprem", name: "PE-OnPrem", role: "PE Router", zone: "mpls", icon: "fa-route", x: 500, y: 250, health: "green", status: "ONLINE", specs: { vrf: "VRF: CORP", loopback: "10.0.0.11", routing: "OSPF/LDP" }, tableType: "routes", tableData: [ { prefix: "10.255.0.2/32", nextHop: "MPLS", label: "1014" } ] },
        { id: "pe-cloud", name: "PE-Cloud", role: "PE Router", zone: "mpls", icon: "fa-route", x: 900, y: 250, health: "green", status: "ONLINE", specs: { vrf: "VRF: CORP", loopback: "10.0.0.22", routing: "OSPF/LDP" }, tableType: "routes", tableData: [ { prefix: "10.255.0.1/32", nextHop: "MPLS", label: "2048" } ] },
        { id: "vtep-cloud", name: "VTEP-Cloud", role: "VTEP / L2 GW", zone: "cloud", icon: "fa-network-wired", x: 1200, y: 150, health: "green", status: "BGP UP", specs: { loopback: "10.255.0.2", vtep_ip: "10.255.0.2", vni: "10100" }, tableType: "bgp", tableData: [ { neighbor: "10.255.0.1", asn: "65000", state: "Establ", prefixes: "2" } ] },
        { id: "host-a", name: "Host-A", role: "Compute", zone: "on-prem", icon: "fa-server", x: 200, y: 350, health: "green", status: "ONLINE", specs: { ip: "10.1.100.10/24", gw: "10.1.100.1", mac: "00:1A:2B:3C:4D:5E" }, tableType: "interfaces", tableData: [ { iface: "eth0", status: "up", speed: "10G" } ] },
        { id: "host-b", name: "Host-B", role: "Compute", zone: "cloud", icon: "fa-server", x: 1200, y: 350, health: "green", status: "ONLINE", specs: { ip: "10.1.100.20/24", gw: "10.1.100.1", mac: "00:5E:4D:3C:2B:1A" }, tableType: "interfaces", tableData: [ { iface: "eth0", status: "up", speed: "10G" } ] }
      ],"""

content = re.sub(old_data, new_data, content)

with open('projects/topology-design/evpn-vxlan-mpls-transit.html', 'w') as f:
    f.write(content)
