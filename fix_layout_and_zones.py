import re

with open('projects/topology-design/evpn-vxlan-mpls-transit.html', 'r') as f:
    content = f.read()

# 1. Expand the topology-container width
content = content.replace(
    'class="relative bg-slate-50 dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner overflow-hidden w-full max-w-[1000px] mx-auto h-[500px] my-6"',
    'class="relative bg-slate-50 dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner overflow-hidden w-full h-[500px] my-6"'
)
content = content.replace(
    'class="relative bg-slate-50 dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner overflow-hidden w-full max-w-[1000px] mx-auto h-[500px] mt-6"',
    'class="relative bg-slate-50 dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner overflow-hidden w-full h-[500px] mt-6"'
)

# 2. Update Coordinates in Data
old_data = r"""      zones: \[
        \{ id: "on-prem", label: "ON-PREMISES SITE", bounds: \{ left: 20, top: 40, width: 240, height: 420 \} \},
        \{ id: "mpls", label: "MPLS TRANSIT \(WAN\)", bounds: \{ left: 280, top: 40, width: 440, height: 420 \} \},
        \{ id: "cloud", label: "CLOUD REGION", bounds: \{ left: 740, top: 40, width: 240, height: 420 \} \}
      \],
      nodes: \[
        \{ id: "vtep-onprem", name: "VTEP-OnPrem", role: "VTEP / L2 GW", zone: "on-prem", icon: "fa-network-wired", x: 140, y: 150, health: "green", status: "BGP UP", specs: \{ loopback: "10.255.0.1", vtep_ip: "10.255.0.1", vni: "10100" \}, tableType: "bgp", tableData: \[ \{ neighbor: "10.255.0.2", asn: "65000", state: "Establ", prefixes: "2" \} \] \},
        \{ id: "pe-onprem", name: "PE-OnPrem", role: "PE Router", zone: "mpls", icon: "fa-route", x: 370, y: 250, health: "green", status: "ONLINE", specs: \{ interface: "Gi0/0/0", vrf: "CORP", routing: "OSPF/LDP" \}, tableType: "routes", tableData: \[ \{ prefix: "10.255.0.2/32", nextHop: "MPLS", label: "1014" \} \] \},
        \{ id: "pe-cloud", name: "PE-Cloud", role: "PE Router", zone: "mpls", icon: "fa-route", x: 630, y: 250, health: "green", status: "ONLINE", specs: \{ interface: "Gi0/0/0", vrf: "CORP", routing: "OSPF/LDP" \}, tableType: "routes", tableData: \[ \{ prefix: "10.255.0.1/32", nextHop: "MPLS", label: "2048" \} \] \},
        \{ id: "vtep-cloud", name: "VTEP-Cloud", role: "VTEP / L2 GW", zone: "cloud", icon: "fa-network-wired", x: 860, y: 150, health: "green", status: "BGP UP", specs: \{ loopback: "10.255.0.2", vtep_ip: "10.255.0.2", vni: "10100" \}, tableType: "bgp", tableData: \[ \{ neighbor: "10.255.0.1", asn: "65000", state: "Establ", prefixes: "2" \} \] \},
        \{ id: "host-a", name: "Host-A", role: "Compute", zone: "on-prem", icon: "fa-server", x: 140, y: 350, health: "green", status: "ONLINE", specs: \{ ip: "10.1.100.10/24", gw: "10.1.100.1", mac: "00:1A:2B:3C:4D:5E" \}, tableType: "interfaces", tableData: \[ \{ iface: "eth0", status: "up", speed: "10G" \} \] \},
        \{ id: "host-b", name: "Host-B", role: "Compute", zone: "cloud", icon: "fa-server", x: 860, y: 350, health: "green", status: "ONLINE", specs: \{ ip: "10.1.100.20/24", gw: "10.1.100.1", mac: "00:5E:4D:3C:2B:1A" \}, tableType: "interfaces", tableData: \[ \{ iface: "eth0", status: "up", speed: "10G" \} \] \}
      \],"""

new_data = """      zones: [
        { id: "on-prem", label: "ON-PREMISES SITE", color: "#3b82f6", bounds: { left: 20, top: 40, width: 280, height: 420 } },
        { id: "mpls", label: "MPLS TRANSIT (WAN)", color: "#f59e0b", bounds: { left: 320, top: 40, width: 520, height: 420 } },
        { id: "cloud", label: "CLOUD REGION", color: "#8b5cf6", bounds: { left: 860, top: 40, width: 280, height: 420 } }
      ],
      nodes: [
        { id: "vtep-onprem", name: "VTEP-OnPrem", role: "VTEP / L2 GW", zone: "on-prem", icon: "fa-network-wired", x: 160, y: 150, health: "green", status: "BGP UP", specs: { loopback: "10.255.0.1", vtep_ip: "10.255.0.1", vni: "10100" }, tableType: "bgp", tableData: [ { neighbor: "10.255.0.2", asn: "65000", state: "Establ", prefixes: "2" } ] },
        { id: "pe-onprem", name: "PE-OnPrem", role: "PE Router", zone: "mpls", icon: "fa-route", x: 420, y: 250, health: "green", status: "ONLINE", specs: { interface: "Gi0/0/0", vrf: "CORP", routing: "OSPF/LDP" }, tableType: "routes", tableData: [ { prefix: "10.255.0.2/32", nextHop: "MPLS", label: "1014" } ] },
        { id: "pe-cloud", name: "PE-Cloud", role: "PE Router", zone: "mpls", icon: "fa-route", x: 740, y: 250, health: "green", status: "ONLINE", specs: { interface: "Gi0/0/0", vrf: "CORP", routing: "OSPF/LDP" }, tableType: "routes", tableData: [ { prefix: "10.255.0.1/32", nextHop: "MPLS", label: "2048" } ] },
        { id: "vtep-cloud", name: "VTEP-Cloud", role: "VTEP / L2 GW", zone: "cloud", icon: "fa-network-wired", x: 1000, y: 150, health: "green", status: "BGP UP", specs: { loopback: "10.255.0.2", vtep_ip: "10.255.0.2", vni: "10100" }, tableType: "bgp", tableData: [ { neighbor: "10.255.0.1", asn: "65000", state: "Establ", prefixes: "2" } ] },
        { id: "host-a", name: "Host-A", role: "Compute", zone: "on-prem", icon: "fa-server", x: 160, y: 350, health: "green", status: "ONLINE", specs: { ip: "10.1.100.10/24", gw: "10.1.100.1", mac: "00:1A:2B:3C:4D:5E" }, tableType: "interfaces", tableData: [ { iface: "eth0", status: "up", speed: "10G" } ] },
        { id: "host-b", name: "Host-B", role: "Compute", zone: "cloud", icon: "fa-server", x: 1000, y: 350, health: "green", status: "ONLINE", specs: { ip: "10.1.100.20/24", gw: "10.1.100.1", mac: "00:5E:4D:3C:2B:1A" }, tableType: "interfaces", tableData: [ { iface: "eth0", status: "up", speed: "10G" } ] }
      ],"""

content = re.sub(old_data, new_data, content)

# 3. Restore the Zone Frames
old_zones = r"""      data\.zones\.forEach\(z => \{
        const title = document\.createElement\('div'\);
        title\.className = 'absolute top-6 font-black text-sm tracking-\[0\.2em\] text-slate-400 dark:text-slate-500 pointer-events-none w-full text-center transition-opacity duration-500';
        title\.style\.left = z\.bounds\.left \+ 'px';
        title\.style\.width = z\.bounds\.width \+ 'px';
        title\.innerText = z\.label;
        if \(currentView === 'overlay' && z\.id === 'mpls'\) title\.classList\.add\('opacity-10'\);
        zonesLayer\.appendChild\(title\);
      \}\);"""

new_zones = """      data.zones.forEach(z => {
        const el = document.createElement('div');
        el.className = 'absolute border-2 border-dashed rounded-xl pointer-events-none transition-all duration-500 opacity-80 dark:opacity-60 z-0';
        el.style.borderColor = z.color;
        el.style.backgroundColor = z.color + '0D';
        el.style.left = z.bounds.left + 'px';
        el.style.top = z.bounds.top + 'px';
        el.style.width = z.bounds.width + 'px';
        el.style.height = z.bounds.height + 'px';
        
        if (currentView === 'overlay' && z.id === 'mpls') el.classList.add('opacity-10');

        const title = document.createElement('div');
        title.className = 'absolute top-4 left-5 font-black text-xs tracking-widest opacity-80 uppercase';
        title.style.color = z.color;
        title.innerText = z.label;
        el.appendChild(title);
        
        zonesLayer.appendChild(el);
      });"""

content = re.sub(old_zones, new_zones, content)

with open('projects/topology-design/evpn-vxlan-mpls-transit.html', 'w') as f:
    f.write(content)
