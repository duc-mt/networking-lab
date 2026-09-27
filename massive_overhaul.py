import re

with open('projects/topology-design/evpn-vxlan-mpls-transit.html', 'r') as f:
    content = f.read()

# 1. Update Data Schema
new_data = """const data = {
      zones: [
        { id: "on-prem", label: "ON-PREMISES SITE", bounds: { left: 20, top: 40, width: 240, height: 420 } },
        { id: "mpls", label: "MPLS TRANSIT (WAN)", bounds: { left: 280, top: 40, width: 440, height: 420 } },
        { id: "cloud", label: "CLOUD REGION", bounds: { left: 740, top: 40, width: 240, height: 420 } }
      ],
      nodes: [
        { id: "vtep-onprem", name: "VTEP-OnPrem", role: "VTEP / L2 GW", zone: "on-prem", icon: "fa-network-wired", x: 140, y: 150, health: "green", status: "BGP UP", specs: { loopback: "10.255.0.1", vtep_ip: "10.255.0.1", vni: "10100" }, tableType: "bgp", tableData: [ { neighbor: "10.255.0.2", asn: "65000", state: "Establ", prefixes: "2" } ] },
        { id: "pe-onprem", name: "PE-OnPrem", role: "PE Router", zone: "mpls", icon: "fa-route", x: 370, y: 250, health: "green", status: "ONLINE", specs: { interface: "Gi0/0/0", vrf: "CORP", routing: "OSPF/LDP" }, tableType: "routes", tableData: [ { prefix: "10.255.0.2/32", nextHop: "MPLS", label: "1014" } ] },
        { id: "pe-cloud", name: "PE-Cloud", role: "PE Router", zone: "mpls", icon: "fa-route", x: 630, y: 250, health: "green", status: "ONLINE", specs: { interface: "Gi0/0/0", vrf: "CORP", routing: "OSPF/LDP" }, tableType: "routes", tableData: [ { prefix: "10.255.0.1/32", nextHop: "MPLS", label: "2048" } ] },
        { id: "vtep-cloud", name: "VTEP-Cloud", role: "VTEP / L2 GW", zone: "cloud", icon: "fa-network-wired", x: 860, y: 150, health: "green", status: "BGP UP", specs: { loopback: "10.255.0.2", vtep_ip: "10.255.0.2", vni: "10100" }, tableType: "bgp", tableData: [ { neighbor: "10.255.0.1", asn: "65000", state: "Establ", prefixes: "2" } ] },
        { id: "host-a", name: "Host-A", role: "Compute", zone: "on-prem", icon: "fa-server", x: 140, y: 350, health: "green", status: "ONLINE", specs: { ip: "10.1.100.10/24", gw: "10.1.100.1", mac: "00:1A:2B:3C:4D:5E" }, tableType: "interfaces", tableData: [ { iface: "eth0", status: "up", speed: "10G" } ] },
        { id: "host-b", name: "Host-B", role: "Compute", zone: "cloud", icon: "fa-server", x: 860, y: 350, health: "green", status: "ONLINE", specs: { ip: "10.1.100.20/24", gw: "10.1.100.1", mac: "00:5E:4D:3C:2B:1A" }, tableType: "interfaces", tableData: [ { iface: "eth0", status: "up", speed: "10G" } ] }
      ],
      links: [
        { id: "l1", src: "host-a", dst: "vtep-onprem", type: "trunk", label: "VLAN 100", srcPort: "eth0", dstPort: "Gi1/0/1" },
        { id: "l2", src: "vtep-onprem", dst: "pe-onprem", type: "routed", label: "Underlay IPv4", srcPort: "Gi1/0/48", dstPort: "Gi0/0/1" },
        { id: "l3", src: "pe-onprem", dst: "pe-cloud", type: "mpls", label: "MPLS L3VPN, VRF CORP", curve: 100, srcPort: "Te0/0/0", dstPort: "Te0/0/0" },
        { id: "l4", src: "vtep-cloud", dst: "pe-cloud", type: "routed", label: "Underlay IPv4", srcPort: "Gi1/0/48", dstPort: "Gi0/0/1" },
        { id: "l5", src: "host-b", dst: "vtep-cloud", type: "trunk", label: "VLAN 100", srcPort: "eth0", dstPort: "Gi1/0/1" },
        { id: "l6", src: "vtep-onprem", dst: "vtep-cloud", type: "overlay", label: "VXLAN VNI 10100", curve: -120, srcPort: "Tu0", dstPort: "Tu0" }
      ]
    };"""
content = re.sub(r'const data = \{.*?  \};', new_data, content, flags=re.DOTALL)

# 2. Update Zones Layer rendering (remove dashed boxes, keep titles via whitespace)
old_zones = r"""const zonesLayer = document\.getElementById\('zones-layer'\);\s*zonesLayer\.innerHTML = '';\s*data\.zones\.forEach\(z => \{.*?\}\);"""
new_zones = """const zonesLayer = document.getElementById('zones-layer');
      zonesLayer.innerHTML = '';
      data.zones.forEach(z => {
        const title = document.createElement('div');
        title.className = 'absolute top-6 font-black text-sm tracking-[0.2em] text-slate-300 dark:text-slate-600 pointer-events-none w-full text-center transition-opacity duration-500';
        title.style.left = z.bounds.left + 'px';
        title.style.width = z.bounds.width + 'px';
        title.innerText = z.label;
        if (currentView === 'overlay' && z.id === 'mpls') title.classList.add('opacity-10');
        zonesLayer.appendChild(title);
      });"""
content = re.sub(old_zones, new_zones, content, flags=re.DOTALL)

# 3. Update Nodes rendering (Borders & Glow, Status Badges, Color Semantics)
old_nodes = r"""const nodesLayer = document\.getElementById\('nodes-layer'\);\s*nodesLayer\.innerHTML = '';\s*data\.nodes\.forEach\(n => \{.*?nodesLayer\.appendChild\(el\);\s*\}\);"""
new_nodes = """const nodesLayer = document.getElementById('nodes-layer');
      nodesLayer.innerHTML = '';
      data.nodes.forEach(n => {
        const el = document.createElement('div');
        el.id = `node-${n.id}`;
        
        let borderClass = 'border-slate-300 dark:border-slate-600 shadow-lg';
        let statusBadge = 'bg-slate-100 text-slate-500 border-slate-200';
        let iconGlow = 'text-slate-600 dark:text-slate-300';
        
        if (n.health === 'green') {
           borderClass = 'border-emerald-400 dark:border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] dark:shadow-[0_0_15px_rgba(16,185,129,0.2)]';
           statusBadge = 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50';
           iconGlow = 'text-emerald-600 dark:text-emerald-400';
        } else if (n.health === 'yellow') {
           borderClass = 'border-amber-400 dark:border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]';
           statusBadge = 'bg-amber-50 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400 border-amber-200 dark:border-amber-800/50';
           iconGlow = 'text-amber-500';
        } else if (n.health === 'red') {
           borderClass = 'border-red-400 dark:border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]';
           statusBadge = 'bg-red-50 text-red-600 dark:bg-red-900/40 dark:text-red-400 border-red-200 dark:border-red-800/50';
           iconGlow = 'text-red-500';
        }
        
        el.className = `absolute w-32 md:w-36 bg-white dark:bg-slate-800 rounded-xl p-3 border-2 ${borderClass} flex flex-col items-center cursor-pointer transition-all duration-300 z-10 hover:scale-105 group`;
        el.style.left = n.x + 'px';
        el.style.top = n.y + 'px';
        el.style.transform = 'translate(-50%, -50%)';
        el.onclick = () => selectNode(n.id);
        
        if (currentView === 'overlay' && n.zone === 'mpls') el.classList.add('opacity-20');
        
        let primarySpec = Object.values(n.specs)[0];

        el.innerHTML = `
          <div class="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[9px] font-bold border whitespace-nowrap bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600">${n.role}</div>
          <div class="w-10 h-10 mb-1 bg-gradient-to-b from-slate-50 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-full flex items-center justify-center border border-slate-300 dark:border-slate-600 shadow-inner group-hover:border-blue-400 transition-colors">
              <i class="fa-solid ${n.icon} text-lg ${iconGlow} group-hover:text-blue-500 transition-colors"></i>
          </div>
          <h3 class="text-xs font-extrabold text-slate-800 dark:text-white text-center leading-tight">${n.name}</h3>
          <div class="text-[9px] font-mono text-slate-500 text-center truncate w-full mt-0.5">${primarySpec}</div>
          <span class="text-[8px] font-black tracking-widest px-2 py-0.5 mt-1.5 rounded border ${statusBadge}">${n.status}</span>
        `;
        nodesLayer.appendChild(el);
      });"""
content = re.sub(old_nodes, new_nodes, content, flags=re.DOTALL)

# 4. Interface Labels in drawLinks
old_draw_labels = r"""        // HTML Badge Label.*?document\.getElementById\('links-labels-layer'\)\.appendChild\(badge\);"""
new_draw_labels = """        // Main Link Badge (Tech Label)
        const ly = l.curve ? (my + l.curve/2) : my;
        const badge = document.createElement('div');
        let badgeStyle = "bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 border-blue-200 dark:border-blue-800"; // default routed
        if (l.type === 'overlay') badgeStyle = "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300 border-purple-200 dark:border-purple-700";
        if (l.type === 'trunk') badgeStyle = "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700";
        if (l.type === 'mpls') badgeStyle = "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300 border-amber-200 dark:border-amber-700";
        
        badge.className = `absolute z-20 text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${badgeStyle} transition-opacity duration-500 whitespace-nowrap`;
        badge.style.left = mx + 'px';
        badge.style.top = (ly - 10) + 'px';
        badge.style.transform = 'translate(-50%, -50%)';
        badge.innerText = l.label;
        document.getElementById('links-labels-layer').appendChild(badge);

        // Interface Endpoints (Port Labels)
        const getBezierPoint = (t, p0, p1, p2) => (1-t)*(1-t)*p0 + 2*(1-t)*t*p1 + t*t*p2;
        const cpX = mx;
        const cpY = my + (l.curve || 0);
        
        if (l.srcPort) {
            const spBadge = document.createElement('div');
            spBadge.className = 'absolute z-20 text-[8px] font-mono font-bold px-1 py-px rounded bg-white/90 dark:bg-slate-800/90 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-600 whitespace-nowrap transition-opacity duration-500 backdrop-blur-sm';
            let px = l.curve ? getBezierPoint(0.18, src.x, cpX, dst.x) : src.x + (dst.x - src.x)*0.22;
            let py = l.curve ? getBezierPoint(0.18, src.y, cpY, dst.y) : src.y + (dst.y - src.y)*0.22;
            spBadge.style.left = px + 'px';
            spBadge.style.top = py + 'px';
            spBadge.style.transform = 'translate(-50%, -50%)';
            spBadge.innerText = l.srcPort;
            if (currentView === 'overlay' && l.type !== 'overlay' && l.type !== 'trunk') spBadge.classList.add('opacity-0');
            document.getElementById('links-labels-layer').appendChild(spBadge);
        }
        
        if (l.dstPort) {
            const dpBadge = document.createElement('div');
            dpBadge.className = 'absolute z-20 text-[8px] font-mono font-bold px-1 py-px rounded bg-white/90 dark:bg-slate-800/90 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-600 whitespace-nowrap transition-opacity duration-500 backdrop-blur-sm';
            let px = l.curve ? getBezierPoint(0.82, src.x, cpX, dst.x) : src.x + (dst.x - src.x)*0.78;
            let py = l.curve ? getBezierPoint(0.82, src.y, cpY, dst.y) : src.y + (dst.y - src.y)*0.78;
            dpBadge.style.left = px + 'px';
            dpBadge.style.top = py + 'px';
            dpBadge.style.transform = 'translate(-50%, -50%)';
            dpBadge.innerText = l.dstPort;
            if (currentView === 'overlay' && l.type !== 'overlay' && l.type !== 'trunk') dpBadge.classList.add('opacity-0');
            document.getElementById('links-labels-layer').appendChild(dpBadge);
        }"""
content = re.sub(old_draw_labels, new_draw_labels, content, flags=re.DOTALL)

# 5. Add Health Down CSS rule (Error Path Mechanism)
css_injection = """    .link-line.type-trunk { stroke: #10b981; stroke-dasharray: 5 3; }
    
    .link-line.health-down { stroke: #ef4444 !important; stroke-dasharray: 4 !important; }
    @keyframes dangerPulse { 0%,100%{filter: drop-shadow(0 0 2px rgba(239,68,68,0));} 50%{filter: drop-shadow(0 0 8px rgba(239,68,68,0.8));} }
    .animate-danger { animation: dangerPulse 1.5s infinite; }
"""
content = content.replace('    .link-line.type-trunk { stroke: #10b981; stroke-dasharray: 5 3; }\n', css_injection)

# 6. Make selectNode function preserve health styles when selected (remove hardcoded border-slate replacement)
select_js = r"""      document\.querySelectorAll\('#nodes-layer > div'\)\.forEach\(n => \{
        n\.classList\.remove\('border-blue-500', 'dark:border-blue-400', 'shadow-\[0_0_15px_rgba\(59,130,246,0\.4\)\]'\);
        n\.classList\.add\('border-slate-300', 'dark:border-slate-600'\);
        const i = n\.querySelector\('i'\);
        if\(i\) \{
           i\.classList\.remove\('text-blue-500'\);
           i\.classList\.add\('text-slate-500', 'dark:text-slate-400'\);
        \}
      \}\);
      const selected = document\.getElementById\(`node-\$\{id\}`\);
      selected\.classList\.remove\('border-slate-300', 'dark:border-slate-600'\);
      selected\.classList\.add\('border-blue-500', 'dark:border-blue-400', 'shadow-\[0_0_15px_rgba\(59,130,246,0\.4\)\]'\);
      const si = selected\.querySelector\('i'\);
      if\(si\) \{
         si\.classList\.remove\('text-slate-500', 'dark:text-slate-400'\);
         si\.classList\.add\('text-blue-500'\);
      \}"""

new_select_js = """      // Clear previous specific highlight borders but preserve health colors
      document.querySelectorAll('#nodes-layer > div').forEach(nodeEl => {
        nodeEl.classList.remove('ring-4', 'ring-blue-400', 'dark:ring-blue-500', 'ring-offset-2', 'dark:ring-offset-slate-900');
      });
      // Add selection ring to the active node
      const selected = document.getElementById(`node-${id}`);
      selected.classList.add('ring-4', 'ring-blue-400', 'dark:ring-blue-500', 'ring-offset-2', 'dark:ring-offset-slate-900');"""

content = re.sub(select_js, new_select_js, content)


with open('projects/topology-design/evpn-vxlan-mpls-transit.html', 'w') as f:
    f.write(content)
