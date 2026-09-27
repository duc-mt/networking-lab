    function toggleTheme() {
      const html = document.documentElement;
      const isDark = html.classList.toggle('dark');
      try {
        localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
      } catch(e) {}
      
      const icon = document.getElementById('theme-icon');
      if (icon) {
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
      }
    }

    // --- 1. Data Schema ---
    const data = {
      zones: [
        { id: "on-prem", label: "On-Premises Site", color: "#3b82f6", bounds: { left: 40, top: 40, width: 260, height: 420 } },
        { id: "mpls", label: "MPLS Transit (WAN Underlay)", color: "#9ca3af", bounds: { left: 340, top: 40, width: 320, height: 420 } },
        { id: "cloud", label: "Cloud Region", color: "#8b5cf6", bounds: { left: 700, top: 40, width: 260, height: 420 } }
      ],
      nodes: [
        { id: "vtep-onprem", name: "VTEP-OnPrem", role: "VTEP / L2 Gateway", zone: "on-prem", icon: "fa-network-wired", x: 170, y: 150,
          specs: { "Loopback (VTEP IP)": "10.255.0.1/32", "BGP ASN": "65100" },
          tableType: "bgp",
          tableData: [
            { peer: "10.255.0.2 (Cloud)", type: "EVPN L2VPN", state: "ESTABLISHED", rcv: "Type-2, Type-3" },
            { peer: "10.0.1.2 (PE-OnPrem)", type: "IPv4 Unicast", state: "ESTABLISHED", rcv: "Underlay Routes" }
          ]
        },
        { id: "pe-onprem", name: "PE-OnPrem", role: "PE Router", zone: "mpls", icon: "fa-route", x: 420, y: 250,
          specs: { "VRF": "CORP", "Routing": "OSPF / LDP / MP-BGP" },
          tableType: "routing",
          tableData: [
            { prefix: "10.255.0.1/32", nextHop: "10.0.1.1 (VTEP-OnPrem)", proto: "eBGP", vrf: "CORP" },
            { prefix: "10.255.0.2/32", nextHop: "10.0.2.2 (PE-Cloud)", proto: "MPLS / iBGP", vrf: "CORP" }
          ]
        },
        { id: "pe-cloud", name: "PE-Cloud", role: "PE Router", zone: "mpls", icon: "fa-route", x: 580, y: 250,
          specs: { "VRF": "CORP", "Routing": "OSPF / LDP / MP-BGP" },
          tableType: "routing",
          tableData: [
            { prefix: "10.255.0.2/32", nextHop: "10.0.3.2 (VTEP-Cloud)", proto: "eBGP", vrf: "CORP" },
            { prefix: "10.255.0.1/32", nextHop: "10.0.2.1 (PE-OnPrem)", proto: "MPLS / iBGP", vrf: "CORP" }
          ]
        },
        { id: "vtep-cloud", name: "VTEP-Cloud", role: "VTEP / L2 Gateway", zone: "cloud", icon: "fa-network-wired", x: 830, y: 150,
          specs: { "Loopback (VTEP IP)": "10.255.0.2/32", "BGP ASN": "65200" },
          tableType: "bgp",
          tableData: [
            { peer: "10.255.0.1 (OnPrem)", type: "EVPN L2VPN", state: "ESTABLISHED", rcv: "Type-2, Type-3" },
            { peer: "10.0.3.1 (PE-Cloud)", type: "IPv4 Unicast", state: "ESTABLISHED", rcv: "Underlay Routes" }
          ]
        },
        { id: "host-a", name: "Host-A", role: "Compute", zone: "on-prem", icon: "fa-server", x: 170, y: 350,
          specs: { "IP Address": "10.1.100.10/24", "VLAN": "100" },
          tableType: "interfaces",
          tableData: [ { intf: "eth0", ip: "10.1.100.10", mac: "00:50:56:AA:AA:AA" } ]
        },
        { id: "host-b", name: "Host-B", role: "Compute", zone: "cloud", icon: "fa-server", x: 830, y: 350,
          specs: { "IP Address": "10.1.100.20/24", "VLAN": "100 (Stretched)" },
          tableType: "interfaces",
          tableData: [ { intf: "eth0", ip: "10.1.100.20", mac: "00:50:56:BB:BB:BB" } ]
        }
      ],
      links: [
        { id: "l1", from: "host-a", to: "vtep-onprem", type: "trunk", label: "VLAN 100", view: "both" },
        { id: "l2", from: "vtep-onprem", to: "pe-onprem", type: "routed", label: "Underlay IPv4", view: "underlay" },
        { id: "l3", from: "pe-onprem", to: "pe-cloud", type: "routed", label: "MPLS L3VPN, VRF CORP", view: "underlay" },
        { id: "l4", from: "pe-cloud", to: "vtep-cloud", type: "routed", label: "Underlay IPv4", view: "underlay" },
        { id: "l5", from: "host-b", to: "vtep-cloud", type: "trunk", label: "VLAN 100", view: "both" },
        { id: "l6", from: "vtep-onprem", to: "vtep-cloud", type: "overlay", label: "VXLAN VNI 10100 (EVPN control-plane, ARP suppressed)", view: "overlay", curve: -50 }
      ]
    };

    const flowData = {
      "host-a_host-b": {
        overlay: [
          { hop: "Host-A ➔ VTEP-OnPrem", action: "L2 Forwarding", desc: "Tra cứu MAC nội bộ VLAN 100. Chuyển tiếp L2 tới L2 Gateway (VTEP)." },
          { hop: "VTEP-OnPrem ➔ VTEP-Cloud", action: "EVPN Lookup & VXLAN Encap", desc: "Đã học MAC/IP của Host-B qua bản tin EVPN Type-2 (không cần broadcast ARP). Đóng gói VXLAN (VNI 10100) đẩy qua tunnel." },
          { hop: "VTEP-Cloud ➔ Host-B", action: "VXLAN Decap", desc: "Gỡ header VXLAN, map VNI 10100 về VLAN 100 nội bộ và đẩy trực tiếp xuống Host-B." }
        ],
        underlay: [
          { hop: "Host-A ➔ VTEP-OnPrem", action: "L2 Forwarding", desc: "Khung Ethernet (VLAN 100) nguyên bản gửi lên switch/VTEP." },
          { hop: "VTEP-OnPrem", action: "VXLAN Encap", desc: "Bọc gói L2 vào UDP/VXLAN. Outer IP Src: 10.255.0.1, Dst: 10.255.0.2." },
          { hop: "VTEP-OnPrem ➔ PE-OnPrem", action: "Underlay Routing", desc: "Tra bảng định tuyến IPv4, đẩy gói tin VXLAN tới PE-OnPrem qua đường truyền vật lý." },
          { hop: "PE-OnPrem ➔ PE-Cloud", action: "MPLS L3VPN Transit", desc: "PE gắn nhãn MPLS (Transport Label + VPN Label cho VRF CORP) truyền tải gói tin VXLAN qua mạng lõi." },
          { hop: "PE-Cloud ➔ VTEP-Cloud", action: "Underlay Routing", desc: "PE-Cloud gỡ nhãn MPLS cuối cùng, định tuyến gói IPv4 (chứa payload VXLAN) tới đích VTEP-Cloud." },
          { hop: "VTEP-Cloud ➔ Host-B", action: "VXLAN Decap", desc: "Nhận gói UDP 4789. Gỡ vỏ bọc VXLAN (~50 bytes overhead), lấy payload L2 gốc đẩy ra port Access/Trunk VLAN 100 tới Host-B." }
        ],
        pathNodes: ["host-a", "vtep-onprem", "pe-onprem", "pe-cloud", "vtep-cloud", "host-b"],
        pathLinks: { underlay: ["l1", "l2", "l3", "l4", "l5"], overlay: ["l1", "l6", "l5"] }
      },
      "host-b_host-a": {
        overlay: [
          { hop: "Host-B ➔ VTEP-Cloud", action: "L2 Forwarding", desc: "Tra cứu MAC nội bộ VLAN 100. Chuyển tiếp L2 tới L2 Gateway (VTEP)." },
          { hop: "VTEP-Cloud ➔ VTEP-OnPrem", action: "EVPN Lookup & VXLAN Encap", desc: "Đã học MAC/IP của Host-A qua bản tin EVPN Type-2. Đóng gói VXLAN (VNI 10100) đẩy qua tunnel chiều về." },
          { hop: "VTEP-OnPrem ➔ Host-A", action: "VXLAN Decap", desc: "Gỡ header VXLAN, map VNI 10100 về VLAN 100 nội bộ và đẩy trực tiếp xuống Host-A." }
        ],
        underlay: [
          { hop: "Host-B ➔ VTEP-Cloud", action: "L2 Forwarding", desc: "Khung Ethernet (VLAN 100) gửi lên VTEP-Cloud." },
          { hop: "VTEP-Cloud", action: "VXLAN Encap", desc: "Bọc gói L2 vào UDP/VXLAN. Outer IP Src: 10.255.0.2, Dst: 10.255.0.1." },
          { hop: "VTEP-Cloud ➔ PE-Cloud", action: "Underlay Routing", desc: "Tra bảng định tuyến IPv4 chiều về, đẩy gói VXLAN tới PE-Cloud." },
          { hop: "PE-Cloud ➔ PE-OnPrem", action: "MPLS L3VPN Transit", desc: "PE gắn nhãn MPLS đẩy qua mạng lõi chiều về." },
          { hop: "PE-OnPrem ➔ VTEP-OnPrem", action: "Underlay Routing", desc: "PE-OnPrem gỡ nhãn MPLS, định tuyến gói IPv4 tới VTEP-OnPrem." },
          { hop: "VTEP-OnPrem ➔ Host-A", action: "VXLAN Decap", desc: "Gỡ vỏ bọc VXLAN, lấy payload L2 gốc đẩy ra port VLAN 100 tới Host-A." }
        ],
        pathNodes: ["host-b", "vtep-cloud", "pe-cloud", "pe-onprem", "vtep-onprem", "host-a"],
        pathLinks: { underlay: ["l5", "l4", "l3", "l2", "l1"], overlay: ["l5", "l6", "l1"] }
      }
    };

    let currentView = 'underlay'; // 'underlay' or 'overlay'
    let selectedNodeId = null;

    // --- 2. Render Topology ---
    function renderTopology() {
      // Render Zones
      const zonesLayer = document.getElementById('zones-layer');
      zonesLayer.innerHTML = '';
      data.zones.forEach(z => {
        const el = document.createElement('div');
        el.className = `zone zone-${z.id}`;
        el.style.borderColor = z.color;
        el.style.left = z.bounds.left + 'px';
        el.style.top = z.bounds.top + 'px';
        el.style.width = z.bounds.width + 'px';
        el.style.height = z.bounds.height + 'px';
        
        const title = document.createElement('div');
        title.className = 'zone-title';
        title.style.color = z.color;
        title.innerText = z.label;
        el.appendChild(title);
        
        zonesLayer.appendChild(el);
      });

      // Render Nodes
      const nodesLayer = document.getElementById('nodes-layer');
      nodesLayer.innerHTML = '';
      data.nodes.forEach(n => {
        const el = document.createElement('div');
        el.id = `node-${n.id}`;
        el.className = `node node-${n.zone}`;
        el.style.left = n.x + 'px';
        el.style.top = n.y + 'px';
        el.onclick = () => selectNode(n.id);
        
        el.innerHTML = `
          <i class="fa-solid ${n.icon}"></i>
          <div class="node-label">${n.name}</div>
        `;
        nodesLayer.appendChild(el);
      });

      drawLinks();
    }

    function drawLinks() {
      const svg = document.getElementById('links-layer');
      svg.innerHTML = '';
      
      data.links.forEach(l => {
        if (l.view !== 'both' && l.view !== currentView) return;
        
        const src = data.nodes.find(n => n.id === l.from);
        const dst = data.nodes.find(n => n.id === l.to);
        
        // Calculate path
        let d = '';
        const mx = (src.x + dst.x) / 2;
        const my = (src.y + dst.y) / 2;
        
        if (l.curve) {
          d = `M ${src.x} ${src.y} Q ${mx} ${my + l.curve} ${dst.x} ${dst.y}`;
        } else {
          d = `M ${src.x} ${src.y} L ${dst.x} ${dst.y}`;
        }
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', d);
        path.id = `link-${l.id}`;
        path.setAttribute('class', `link-line type-${l.type}`);
        svg.appendChild(path);
        
        // Label Group
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class', 'link-label-group');
        const ly = l.curve ? (my + l.curve/2) : my;
        g.setAttribute('transform', `translate(${mx}, ${ly - 10})`);
        
        // Label text to measure
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('class', 'link-label-text');
        text.textContent = l.label;
        
        const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        bg.setAttribute('class', 'link-label-bg');
        
        g.appendChild(bg);
        g.appendChild(text);
        svg.appendChild(g);
        
        // Adjust bg rect based on text width
        setTimeout(() => {
          const bbox = text.getBBox();
          bg.setAttribute('x', bbox.x - 6);
          bg.setAttribute('y', bbox.y - 4);
          bg.setAttribute('width', bbox.width + 12);
          bg.setAttribute('height', bbox.height + 8);
        }, 0);
      });
      
      applyViewFades();
    }

    function applyViewFades() {
      // Dim PE routers and MPLS zone if Overlay view
      const mplsNodes = document.querySelectorAll('.node-mpls');
      const mplsZone = document.querySelector('.zone-mpls');
      
      if (currentView === 'overlay') {
        mplsNodes.forEach(n => n.classList.add('view-fade'));
        if (mplsZone) mplsZone.classList.add('view-fade');
      } else {
        mplsNodes.forEach(n => n.classList.remove('view-fade'));
        if (mplsZone) mplsZone.classList.remove('view-fade');
      }
    }

    function switchView(view) {
      currentView = view;
      
      const btnU = document.getElementById('btn-view-underlay');
      const btnO = document.getElementById('btn-view-overlay');
      const badge = document.getElementById('flow-view-badge');
      
      if (view === 'underlay') {
        btnU.className = "px-4 py-1.5 rounded-md text-sm font-medium bg-blue-600 text-white transition-colors shadow";
        btnO.className = "px-4 py-1.5 rounded-md text-sm font-medium text-slate-400 hover:text-white transition-colors";
        badge.className = "ml-auto px-2 py-0.5 rounded text-xs font-bold bg-blue-900/50 text-blue-400 border border-blue-800/50";
        badge.innerText = "UNDERLAY MODE";
      } else {
        btnO.className = "px-4 py-1.5 rounded-md text-sm font-medium bg-purple-600 text-white transition-colors shadow";
        btnU.className = "px-4 py-1.5 rounded-md text-sm font-medium text-slate-400 hover:text-white transition-colors";
        badge.className = "ml-auto px-2 py-0.5 rounded text-xs font-bold bg-purple-900/50 text-purple-400 border border-purple-800/50";
        badge.innerText = "OVERLAY MODE";
      }
      
      // Clear tracing states
      clearHighlights();
      document.getElementById('flow-content').innerHTML = '<div class="text-slate-400 font-sans text-sm text-center mt-10">View switched. Run "Trace Flow" again to see the path in this layer.</div>';
      
      drawLinks();
    }

    // --- 3. Interaction & Inspector ---
    function selectNode(id) {
      selectedNodeId = id;
      
      // Update Selection UI
      document.querySelectorAll('.node').forEach(n => n.classList.remove('selected'));
      document.getElementById(`node-${id}`).classList.add('selected');
      
      const node = data.nodes.find(n => n.id === id);
      
      // Update Inspector UI
      const badge = document.getElementById('inspector-badge');
      badge.className = "ml-auto px-2 py-0.5 rounded text-xs font-bold bg-emerald-900/50 text-emerald-400 border border-emerald-800/50";
      badge.innerText = node.role.toUpperCase();
      
      let html = `
        <div class="mb-4">
          <h4 class="text-lg font-bold text-white">${node.name}</h4>
        </div>
        <div class="flex flex-wrap items-center gap-4 mb-6">
      `;
      
      // Specs
      for (const [key, val] of Object.entries(node.specs)) {
        html += `
          <div class="bg-slate-900 rounded p-2 border border-slate-700 min-w-[140px] flex-1">
            <div class="text-slate-400 text-xs font-medium uppercase shrink-0">${key}</div>
            <div class="text-slate-200 text-sm mt-1 font-mono">${val}</div>
          </div>
        `;
      }
      html += `</div>`;
      
      // Table
      let tableTitle = "Configuration Table";
      if(node.tableType === 'bgp') tableTitle = "BGP / EVPN Sessions";
      if(node.tableType === 'routing') tableTitle = "VRF Routing Table";
      if(node.tableType === 'interfaces') tableTitle = "Network Interfaces";
      
      html += `
        <h5 class="text-sm font-semibold text-slate-300 mb-2">${tableTitle}</h5>
        <div class="overflow-x-auto border border-slate-700 rounded-lg">
          <table class="w-full text-sm cli-table">
            <thead class="bg-slate-900">
      `;
      
      if(node.tableData.length > 0) {
        const keys = Object.keys(node.tableData[0]);
        html += `<tr>${keys.map(k => `<th>${k}</th>`).join('')}</tr></thead><tbody class="bg-slate-800/50">`;
        node.tableData.forEach(row => {
          html += `<tr>${keys.map(k => `<td class="font-mono text-slate-300 whitespace-nowrap">${row[k]}</td>`).join('')}</tr>`;
        });
      }
      
      html += `</tbody></table></div>`;
      
      document.getElementById('inspector-content').innerHTML = html;
    }

    // --- 4. Flow Tracer ---
    function clearHighlights() {
      document.querySelectorAll('.link-line').forEach(l => l.classList.remove('highlight'));
    }

    function traceFlow() {
      clearHighlights();
      const src = document.getElementById('trace-src').value;
      const dst = document.getElementById('trace-dst').value;
      
      if (src === dst) {
        document.getElementById('flow-content').innerHTML = '<div class="text-amber-400 p-4">Source and Destination cannot be the same.</div>';
        return;
      }
      
      const routeKey = `${src}_${dst}`;
      const routeInfo = flowData[routeKey];
      
      if (!routeInfo) {
        document.getElementById('flow-content').innerHTML = '<div class="text-amber-400 p-4">No predefined flow data for this path.</div>';
        return;
      }
      
      const steps = currentView === 'overlay' ? routeInfo.overlay : routeInfo.underlay;
      const linksToHighlight = currentView === 'overlay' ? routeInfo.pathLinks.overlay : routeInfo.pathLinks.underlay;
      
      // Highlight Links
      linksToHighlight.forEach(lid => {
        const el = document.getElementById(`link-${lid}`);
        if(el) el.classList.add('highlight');
      });
      
      // Render Output
      let html = `<div class="space-y-4">`;
      steps.forEach((step, idx) => {
        html += `
          <div class="flex gap-4">
            <div class="flex flex-col items-center">
              <div class="w-6 h-6 rounded-full bg-blue-900 border border-blue-500 flex items-center justify-center text-xs font-bold text-blue-300 shrink-0">${idx + 1}</div>
              ${idx < steps.length - 1 ? '<div class="w-px h-full bg-slate-700 mt-1"></div>' : ''}
            </div>
            <div class="bg-slate-900 border border-slate-700 rounded-lg p-3 flex-1 mb-2">
              <div class="flex flex-wrap items-center gap-2 mb-2 border-b border-slate-800 pb-2">
                <span class="font-semibold text-slate-200">${step.hop}</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-slate-300 ml-auto">${step.action.toUpperCase()}</span>
              </div>
              <div class="text-slate-400 font-sans leading-relaxed text-[13px]">${step.desc}</div>
            </div>
          </div>
        `;
      });
      html += `</div>`;
      
      document.getElementById('flow-content').innerHTML = html;
    }

    // Initialize
    window.onload = () => {
      renderTopology();
    };

