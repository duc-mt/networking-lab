const REF_W = 1400;
const REF_H = 600;

// deepClone utility
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

const BASE_GRAPH = {
    nodes: [
        { id: 'R1', label: 'Core Switch', ip: '10.0.0.1', x: 700, y: 150, area: '0' },
        { id: 'R6', label: 'Core Switch', ip: '10.0.0.6', x: 700, y: 450, area: '0' },
        { id: 'R2', label: 'ABR Router', ip: '10.0.0.2', x: 350, y: 300, area: '0' },
        { id: 'R3', label: 'ABR Router', ip: '10.0.0.3', x: 1050, y: 300, area: '0' },
        { id: 'R4', label: 'Access Switch', ip: '10.0.1.4', x: 100, y: 300, area: '1' },
        { id: 'R5', label: 'Access Switch', ip: '10.0.2.5', x: 1300, y: 300, area: '2' },
    ],
    links: [
        { source: 'R1', target: 'R2', cost: 1, type: 'GigabitEthernet', state: 'up' },
        { source: 'R1', target: 'R3', cost: 1, type: 'GigabitEthernet', state: 'up' },
        { source: 'R2', target: 'R6', cost: 10, type: 'FastEthernet', state: 'up' },
        { source: 'R3', target: 'R6', cost: 10, type: 'FastEthernet', state: 'up' },
        { source: 'R2', target: 'R4', cost: 1, type: 'GigabitEthernet', state: 'up' },
        { source: 'R3', target: 'R5', cost: 1, type: 'GigabitEthernet', state: 'up' },
        { source: 'R1', target: 'R6', cost: 64, type: 'T1 Serial', state: 'up' },
        { source: 'R2', target: 'R3', cost: 64, type: 'T1 Serial', state: 'up' }
    ],
    zones: [
        { id: 'area0', title: 'Area 0 (Backbone)', color: 'blue', x: 250, y: 50, w: 900, h: 500 },
        { id: 'area1', title: 'Area 1', color: 'indigo', x: 20, y: 150, w: 200, h: 300 },
        { id: 'area2', title: 'Area 2', color: 'sky', x: 1180, y: 150, w: 200, h: 300 }
    ]
};

const SCENARIOS = [
    { id: 'normal', name: 'Normal Operation', patches: [], src: 'R4', dst: 'R5', note: 'Standard SPF calculation. R4 computes the shortest path to R5 via Backbone Area 0 (R4 → R2 → R1 → R3 → R5).' },
    { id: 'link-fail', name: 'Link Failure', patches: [{ type: 'link', source: 'R1', target: 'R3', state: 'down' }], src: 'R4', dst: 'R5', note: 'R1-R3 primary link fails. OSPF runs SPF recalculation and shifts path to transit via R6 instead.' },
    { id: 'cost-tune', name: 'Cost Tuning', patches: [{ type: 'link', source: 'R2', target: 'R6', cost: 1, state: 'up' }, { type: 'link', source: 'R3', target: 'R6', cost: 1, state: 'up' }], src: 'R4', dst: 'R5', note: 'FastEthernet links upgraded to Gigabit (Cost 1). Path calculation re-routes through R6 with identical low cost.' },
    { id: 'ecmp', name: 'ECMP', patches: [{ type: 'link', source: 'R2', target: 'R6', cost: 1, state: 'up' }, { type: 'link', source: 'R3', target: 'R6', cost: 1, state: 'up' }, { type: 'link', source: 'R1', target: 'R6', cost: 2, state: 'up' }], src: 'R2', dst: 'R5', note: 'Equal-Cost Multi-Path (ECMP). Dual paths have identical cumulative metric, enabling load balancing.' }
];

const App = (() => {
    let graph = deepClone(BASE_GRAPH);
    let srcNode = 'R4';
    let dstNode = 'R5';
    let activeScenario = SCENARIOS[0];
    
    let algorithmSteps = [];
    let spfStepIdx = 0;
    let autoPlayInterval = null;
    
    // Packet Animation Controls
    let currentAnim = null;
    let packetTimer = null;
    let sequenceTimers = [];
    
    // UI Elements
    const elNodes = document.getElementById('nodes-layer');
    const elLinksTrack = document.getElementById('svg-links-track');
    const elLinksHit = document.getElementById('svg-links-hit');
    const elLinksVis = document.getElementById('svg-links-vis');
    const elLabels = document.getElementById('labels-layer');
    const elPacket = document.getElementById('animated-packet');
    const container = document.getElementById('topology-container');
    
    function init() {
        setupTabs();
        setupThemeToggle();
        renderScenarios();
        
        window.addEventListener('resize', () => {
            renderTopology();
        });
        
        document.addEventListener('click', (e) => {
            const popup = document.getElementById('link-popup');
            if (!popup.classList.contains('hidden') && !e.target.closest('#link-popup') && !e.target.closest('.topology-hit')) {
                popup.classList.add('hidden');
            }
        });
        
        loadScenario('normal');
    }
    
    function setupTabs() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => {
                    b.classList.remove('text-indigo-600', 'dark:text-indigo-400', 'border-b-2', 'border-indigo-600', 'dark:border-indigo-400');
                    b.classList.add('text-slate-500', 'dark:text-slate-400');
                });
                btn.classList.add('text-indigo-600', 'dark:text-indigo-400', 'border-b-2', 'border-indigo-600', 'dark:border-indigo-400');
                btn.classList.remove('text-slate-500', 'dark:text-slate-400');
                
                document.querySelectorAll('.tab-content').forEach(c => {
                    c.classList.add('hidden');
                    c.classList.remove('flex');
                });
                const target = document.getElementById(btn.dataset.target);
                target.classList.remove('hidden');
                target.classList.add('flex');
            });
        });
    }
    
    function setupThemeToggle() {
        const btn = document.getElementById('theme-toggle');
        const icon = btn.querySelector('i');
        
        // Initial icon state
        const isDark = document.documentElement.classList.contains('dark');
        if (icon) icon.className = isDark ? 'fas fa-sun text-amber-400' : 'fas fa-moon text-slate-600';
        
        btn.addEventListener('click', () => {
            const nowDark = !document.documentElement.classList.contains('dark');
            document.documentElement.classList.toggle('dark', nowDark);
            if (icon) icon.className = nowDark ? 'fas fa-sun text-amber-400' : 'fas fa-moon text-slate-600';
            try {
                localStorage.setItem('portfolio-theme', nowDark ? 'dark' : 'light');
            } catch(e) {}
            renderTopology();
        });
    }
    
    function renderScenarios() {
        const p = document.getElementById('scenario-pills');
        p.innerHTML = SCENARIOS.map(s => `
            <button onclick="App.loadScenario('${s.id}')" class="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all-fast whitespace-nowrap ${s.id === activeScenario.id ? 'border border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 shadow-sm' : 'border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}">
                ${s.name}
            </button>
        `).join('');
    }
    
    function loadScenario(id) {
        clearAllAnimations();
        activeScenario = SCENARIOS.find(s => s.id === id) || SCENARIOS[0];
        renderScenarios();
        
        graph = deepClone(BASE_GRAPH);
        srcNode = activeScenario.src;
        dstNode = activeScenario.dst;
        
        document.getElementById('hdr-src').innerText = srcNode;
        document.getElementById('hdr-dst').innerText = dstNode;
        
        // Apply scenario patches
        activeScenario.patches.forEach(p => {
            if (p.type === 'link') {
                const link = graph.links.find(l => (l.source === p.source && l.target === p.target) || (l.source === p.target && l.target === p.source));
                if (link) {
                    if (p.cost !== undefined) link.cost = p.cost;
                    if (p.state !== undefined) link.state = p.state;
                }
            }
        });
        
        const noteBox = document.getElementById('teaching-note');
        if (activeScenario.note) {
            document.getElementById('teaching-note-content').innerText = activeScenario.note;
            noteBox.classList.remove('hidden');
        } else {
            noteBox.classList.add('hidden');
        }
        
        runAlgorithm();
    }
    
    function resetTopology() {
        clearAllAnimations();
        loadScenario(activeScenario.id);
    }
    
    function dijkstra(nodes, links, srcId) {
        let dist = {};
        let prevMulti = {};
        let steps = [];
        let candidates = new Set(nodes.map(n => n.id));
        let settled = new Set();
        
        nodes.forEach(n => {
            dist[n.id] = Infinity;
            prevMulti[n.id] = [];
        });
        dist[srcId] = 0;
        
        steps.push({
            action: 'init',
            processing: srcId,
            desc: `Khởi tạo giải thuật SPF từ Router gốc ${srcId} (Metric: 0)`,
            dist: deepClone(dist),
            prevMulti: deepClone(prevMulti),
            candidates: Array.from(candidates),
            settled: Array.from(settled)
        });
        
        while (candidates.size > 0) {
            let u = null;
            let min = Infinity;
            candidates.forEach(c => {
                if (dist[c] < min) {
                    min = dist[c];
                    u = c;
                }
            });
            
            if (u === null || min === Infinity) break;
            
            candidates.delete(u);
            settled.add(u);
            
            steps.push({
                action: 'settle',
                processing: u,
                desc: `Đã chốt nút ${u} vào SPF Tree với metric nhỏ nhất (${dist[u]})`,
                dist: deepClone(dist),
                prevMulti: deepClone(prevMulti),
                candidates: Array.from(candidates),
                settled: Array.from(settled)
            });
            
            let adjLinks = links.filter(l => l.state === 'up' && (l.source === u || l.target === u));
            adjLinks.forEach(l => {
                let v = l.source === u ? l.target : l.source;
                if (!settled.has(v)) {
                    let alt = dist[u] + l.cost;
                    
                    steps.push({
                        action: 'evaluate',
                        processing: v,
                        from: u,
                        cost: l.cost,
                        desc: `Đang thẩm tra nút láng giềng ${v} qua ${u} (Link metric: ${l.cost})`,
                        dist: deepClone(dist),
                        prevMulti: deepClone(prevMulti),
                        candidates: Array.from(candidates),
                        settled: Array.from(settled)
                    });
                    
                    if (alt < dist[v]) {
                        dist[v] = alt;
                        prevMulti[v] = [u];
                        
                        steps.push({
                            action: 'update',
                            processing: v,
                            from: u,
                            cost: alt,
                            desc: `Cập nhật đường đi tối ưu hơn tới ${v} qua ${u} (Metric mới: ${alt})`,
                            dist: deepClone(dist),
                            prevMulti: deepClone(prevMulti),
                            candidates: Array.from(candidates),
                            settled: Array.from(settled)
                        });
                    } else if (alt === dist[v]) {
                        if (!prevMulti[v].includes(u)) {
                            prevMulti[v].push(u);
                            steps.push({
                                action: 'update',
                                processing: v,
                                from: u,
                                cost: alt,
                                desc: `Phát hiện đường đi đồng chi phí tới ${v} qua ${u} (ECMP, Metric: ${alt})`,
                                dist: deepClone(dist),
                                prevMulti: deepClone(prevMulti),
                                candidates: Array.from(candidates),
                                settled: Array.from(settled)
                            });
                        }
                    }
                }
            });
        }
        
        steps.push({
            action: 'done',
            processing: null,
            desc: `Thuật toán SPF Dijkstra đã hoàn tất toàn bộ cây định tuyến (SPF Tree).`,
            dist: deepClone(dist),
            prevMulti: deepClone(prevMulti),
            candidates: Array.from(candidates),
            settled: Array.from(settled)
        });
        
        return { dist, prevMulti, steps };
    }
    
    function runAlgorithm() {
        spfStepIdx = 0;
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
        document.getElementById('btn-play').innerHTML = '<i class="fas fa-play"></i>';
        
        const res = dijkstra(graph.nodes, graph.links, srcNode);
        algorithmSteps = res.steps;
        
        renderTopology();
        updatePanel();
    }
    
    function clampNodes() {
        const bounds = container.getBoundingClientRect();
        document.querySelectorAll('.node-card').forEach(card => {
            const w = card.offsetWidth;
            const h = card.offsetHeight;
            let left = parseFloat(card.style.left);
            let top = parseFloat(card.style.top);
            
            let pxX = (left / 100) * bounds.width;
            let pxY = (top / 100) * bounds.height;
            
            pxX -= w/2;
            pxY -= h/2;
            
            const EDGE_PX = 16;
            if (pxX < EDGE_PX) pxX = EDGE_PX;
            if (pxY < EDGE_PX) pxY = EDGE_PX;
            if (pxX + w > bounds.width - EDGE_PX) pxX = bounds.width - w - EDGE_PX;
            if (pxY + h > bounds.height - EDGE_PX) pxY = bounds.height - h - EDGE_PX;
            
            const newLeft = ((pxX + w/2) / bounds.width) * 100;
            const newTop = ((pxY + h/2) / bounds.height) * 100;
            
            card.style.left = newLeft + '%';
            card.style.top = newTop + '%';
        });
    }
    
    function renderTopology() {
        const step = algorithmSteps[spfStepIdx];
        
        // Render Zones (Areas)
        let zoneHtml = '';
        graph.zones.forEach(z => {
            const hex = z.color === 'blue' ? '#3b82f6' : z.color === 'indigo' ? '#6366f1' : z.color === 'sky' ? '#0ea5e9' : '#64748b';
            zoneHtml += `
                <div class="zone-box flex flex-col justify-end p-2.5 shadow-xs" style="
                    left: ${(z.x/REF_W)*100}%; top: ${(z.y/REF_H)*100}%; 
                    width: ${(z.w/REF_W)*100}%; height: ${(z.h/REF_H)*100}%; 
                    border-color: ${hex}55; background: ${hex}08;
                ">
                    <span class="text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5" style="color: ${hex}">
                        <span class="w-2 h-2 rounded-full" style="background:${hex}"></span>
                        ${z.title}
                    </span>
                </div>
            `;
        });
        
        // Render 5-Layer Node Cards
        let nodesHtml = zoneHtml;
        graph.nodes.forEach(n => {
            let stateClass = 'node-normal';
            let status = 'ONLINE';
            
            if (step) {
                if (n.id === srcNode) stateClass = 'node-source';
                else if (n.id === dstNode) stateClass = 'node-dest';
                else if (step.processing === n.id) stateClass = 'node-processing';
                else if (step.candidates && step.candidates.includes(n.id)) stateClass = 'node-candidate';
                else if (step.settled && step.settled.includes(n.id)) stateClass = 'node-settled';
                
                // If done, highlight path
                if (step.action === 'done' && n.id !== srcNode && isNodeOnPath(n.id, step.prevMulti, srcNode, dstNode)) {
                    stateClass = 'node-path';
                }
            }
            
            const costLabel = step && step.dist[n.id] !== Infinity ? `Cost: ${step.dist[n.id]}` : (step && step.dist[n.id] === Infinity ? 'UNREACHABLE' : '');
            
            nodesHtml += `
                <div id="node-${n.id}" class="node-card absolute flex flex-col items-center bg-white dark:bg-slate-900 border-2 rounded-2xl p-3 w-32 shadow-md transition-all-fast z-20 ${stateClass}" style="left: ${(n.x/REF_W)*100}%; top: ${(n.y/REF_H)*100}%; transform: translate(-50%, -50%);">
                    <!-- Layer 1: Top Absolute Role Badge -->
                    <div class="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-xs whitespace-nowrap">${n.label}</div>
                    
                    <!-- Layer 2: Circular Gradient Icon Housing -->
                    <div class="w-12 h-12 bg-gradient-to-b from-slate-50 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-full flex items-center justify-center border border-slate-300 dark:border-slate-600 shadow-inner my-1.5">
                        <i class="fas fa-route text-lg text-slate-700 dark:text-slate-300"></i>
                    </div>
                    
                    <!-- Layer 3: Device Title -->
                    <h3 class="text-sm font-extrabold text-slate-800 dark:text-white tracking-tight">${n.id}</h3>
                    
                    <!-- Layer 4: Monospace IP/Subnet Badge -->
                    <span class="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded mt-1 border border-slate-200/60 dark:border-slate-700/60">${n.ip}</span>
                    
                    <!-- Layer 5: Bottom Status Pill -->
                    <span class="text-[9px] font-black tracking-widest px-2.5 py-0.5 rounded-full uppercase border mt-2 ${status==='ONLINE'?'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/80':'bg-slate-100 text-slate-500 border-slate-200'}">${status}</span>
                    
                    <!-- Metric Pill -->
                    ${costLabel ? `<div class="absolute -bottom-5 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shadow-xs border ${step && step.dist[n.id]===Infinity ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800' : 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'}">${costLabel}</div>` : ''}
                </div>
            `;
        });
        elNodes.innerHTML = nodesHtml;
        
        setTimeout(() => {
            clampNodes();
            drawLinks(step);
        }, 50);
    }
    
    function isNodeOnPath(nodeId, prevMulti, src, dst) {
        let q = [dst];
        let visited = new Set();
        while (q.length > 0) {
            let curr = q.shift();
            if (curr === nodeId) return true;
            if (curr === src) continue;
            if (prevMulti[curr]) {
                prevMulti[curr].forEach(p => {
                    if (!visited.has(p)) {
                        visited.add(p);
                        q.push(p);
                    }
                });
            }
        }
        return false;
    }
    
    function getPathHops(prevMulti, src, dst) {
        if (!prevMulti || !prevMulti[dst] || prevMulti[dst].length === 0) return null;
        let hops = [dst];
        let curr = dst;
        let visited = new Set([dst]);
        while (curr !== src) {
            const prevs = prevMulti[curr];
            if (!prevs || prevs.length === 0) break;
            curr = prevs[0];
            if (visited.has(curr)) break;
            visited.add(curr);
            hops.unshift(curr);
        }
        return hops[0] === src ? hops : null;
    }
    
    function drawLinks(step) {
        const bounds = container.getBoundingClientRect();
        
        let trackHtml = '';
        let visHtml = '';
        let hitHtml = '';
        let labelsHtml = '';
        
        graph.links.forEach((l, i) => {
            const n1 = document.getElementById('node-' + l.source);
            const n2 = document.getElementById('node-' + l.target);
            
            if (!n1 || !n2) return;
            
            const x1 = parseFloat(n1.style.left) * bounds.width / 100;
            const y1 = parseFloat(n1.style.top) * bounds.height / 100;
            const x2 = parseFloat(n2.style.left) * bounds.width / 100;
            const y2 = parseFloat(n2.style.top) * bounds.height / 100;
            
            let linkFlowClass = 'link-flow-active';
            let marker = '';
            
            if (l.state === 'down') {
                linkFlowClass = 'link-flow-down';
            } else if (step) {
                if (step.action === 'done') {
                    // Check if link belongs to any optimal SPF path
                    let onPath = false;
                    let q = [dstNode];
                    let visited = new Set();
                    while (q.length > 0) {
                        let curr = q.shift();
                        if (curr === srcNode) continue;
                        if (step.prevMulti[curr]) {
                            step.prevMulti[curr].forEach(p => {
                                if ((curr === l.target && p === l.source) || (curr === l.source && p === l.target)) {
                                    onPath = true;
                                }
                                if (!visited.has(p)) {
                                    visited.add(p);
                                    q.push(p);
                                }
                            });
                        }
                    }
                    if (onPath) {
                        linkFlowClass = 'link-flow-path';
                        marker = 'marker-end="url(#arrow-emerald)"';
                    }
                } else if (step.action === 'evaluate' && ((l.source === step.processing && l.target === step.from) || (l.target === step.processing && l.source === step.from))) {
                    linkFlowClass = 'link-flow-candidate';
                    marker = 'marker-end="url(#arrow-violet)"';
                }
            }
            
            // Dual-layer cable rendering (track + animated active overlay)
            trackHtml += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="link-track"></line>`;
            visHtml += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${linkFlowClass}" ${marker}></line>`;
            hitHtml += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" data-idx="${i}" onclick="App.openLinkPopup(event, ${i})"></line>`;
            
            // Link Cost Pill
            const mx = (x1 + x2) / 2;
            const my = (y1 + y2) / 2;
            const iconClass = l.type === 'GigabitEthernet' ? 'fa-bolt text-amber-500' : (l.type === 'FastEthernet' ? 'fa-network-wired text-blue-500' : 'fa-wave-square text-slate-400');
            
            labelsHtml += `
                <div class="absolute bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 px-2.5 py-0.5 rounded-full text-[10px] font-mono shadow-sm cursor-pointer hover:scale-110 hover:border-blue-400 dark:hover:border-blue-500 transition-all z-20 flex items-center gap-1.5 ${l.state==='down'?'text-rose-500 line-through opacity-70 border-rose-300 dark:border-rose-900/50':'text-slate-600 dark:text-slate-300'}" style="left: ${mx}px; top: ${my}px; transform: translate(-50%, -50%);" onclick="App.openLinkPopup(event, ${i})">
                    <i class="fas ${iconClass} text-[9px]"></i>
                    <span>Cost: <b class="font-bold">${l.cost}</b></span>
                </div>
            `;
        });
        
        if (elLinksTrack) elLinksTrack.innerHTML = trackHtml;
        elLinksVis.innerHTML = visHtml;
        elLinksHit.innerHTML = hitHtml;
        elLabels.innerHTML = labelsHtml;
    }
    
    // Packet Animation Engine (synchronized with Web Animations API from older labs)
    function clearAllAnimations() {
        if (currentAnim) {
            currentAnim.cancel();
            currentAnim = null;
        }
        if (packetTimer) {
            clearTimeout(packetTimer);
            packetTimer = null;
        }
        sequenceTimers.forEach(t => clearTimeout(t));
        sequenceTimers = [];
        if (elPacket) elPacket.classList.add('hidden');
    }
    
    function animatePacket(p) {
        clearAllAnimations();
        if (!p || !elPacket) return;
        
        const src = document.getElementById('node-' + p.from);
        const tgt = document.getElementById('node-' + p.to);
        if (!src || !tgt) return;
        
        document.getElementById('packet-label').textContent = p.label || 'OSPF Packet';
        document.getElementById('packet-icon').className = `fas ${p.icon || 'fa-paper-plane'}`;
        elPacket.className = `absolute z-50 flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold text-white whitespace-nowrap ${p.color || 'bg-blue-600'} shadow-xl pointer-events-none transition-colors duration-200`;
        elPacket.classList.remove('hidden');
        
        const cr = container.getBoundingClientRect();
        const sr = src.getBoundingClientRect();
        const tr = tgt.getBoundingClientRect();
        
        const sx = sr.left - cr.left + sr.width / 2;
        const sy = sr.top - cr.top + sr.height / 2;
        const tx = tr.left - cr.left + tr.width / 2;
        const ty = tr.top - cr.top + tr.height / 2;
        
        elPacket.style.left = '0px';
        elPacket.style.top = '0px';
        
        const duration = p.duration || 1200;
        currentAnim = elPacket.animate([
            { transform: `translate(calc(${sx}px - 50%), calc(${sy}px - 50%)) scale(0.75)`, opacity: 0 },
            { transform: `translate(calc(${sx}px - 50%), calc(${sy}px - 50%)) scale(1)`, opacity: 1, offset: 0.12 },
            { transform: `translate(calc(${tx}px - 50%), calc(${ty}px - 50%)) scale(1)`, opacity: 1, offset: 0.88 },
            { transform: `translate(calc(${tx}px - 50%), calc(${ty}px - 50%)) scale(0.75)`, opacity: 0 }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            fill: 'forwards'
        });
        
        packetTimer = setTimeout(() => {
            elPacket.classList.add('hidden');
            if (p.onComplete) p.onComplete();
        }, duration);
    }
    
    function animatePathSequence(hops) {
        clearAllAnimations();
        if (!hops || hops.length < 2) return;
        
        let hopIdx = 0;
        function playHop() {
            if (hopIdx >= hops.length - 1) return;
            const from = hops[hopIdx];
            const to = hops[hopIdx + 1];
            hopIdx++;
            
            animatePacket({
                from: from,
                to: to,
                label: `SPF Path: ${from} → ${to}`,
                icon: 'fa-paper-plane',
                color: 'bg-emerald-600',
                duration: 900,
                onComplete: () => {
                    const timer = setTimeout(playHop, 150);
                    sequenceTimers.push(timer);
                }
            });
        }
        playHop();
    }
    
    let popupActiveLinkIdx = null;
    function openLinkPopup(e, idx) {
        e.stopPropagation();
        popupActiveLinkIdx = idx;
        const link = graph.links[idx];
        const popup = document.getElementById('link-popup');
        
        document.getElementById('popup-title').innerText = `${link.source} ↔ ${link.target} (${link.type})`;
        
        const shutBtn = document.querySelector('.popup-btn-shut');
        if (link.state === 'down') {
            document.getElementById('popup-shut-txt').innerHTML = '<i class="fas fa-check-circle mr-1"></i> Khôi phục Link (No Shutdown)';
            shutBtn.classList.remove('text-red-500', 'hover:bg-red-50');
            shutBtn.classList.add('text-emerald-500', 'hover:bg-emerald-50', 'dark:hover:bg-emerald-900/20');
        } else {
            document.getElementById('popup-shut-txt').innerHTML = '<i class="fas fa-times-circle mr-1"></i> Ngắt kết nối Link (Shutdown)';
            shutBtn.classList.remove('text-emerald-500', 'hover:bg-emerald-50', 'dark:hover:bg-emerald-900/20');
            shutBtn.classList.add('text-red-500', 'hover:bg-red-50', 'dark:hover:bg-red-900/20');
        }
        
        popup.style.left = Math.min(e.clientX, window.innerWidth - 280) + 'px';
        popup.style.top = Math.min(e.clientY, window.innerHeight - 300) + 'px';
        popup.classList.remove('hidden');
    }
    
    // Bind popup actions
    document.querySelectorAll('.popup-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (popupActiveLinkIdx !== null) {
                const link = graph.links[popupActiveLinkIdx];
                link.cost = parseInt(btn.dataset.cost);
                document.getElementById('link-popup').classList.add('hidden');
                runAlgorithm();
            }
        });
    });
    
    document.querySelector('.popup-btn-shut').addEventListener('click', () => {
        if (popupActiveLinkIdx !== null) {
            const link = graph.links[popupActiveLinkIdx];
            link.state = link.state === 'up' ? 'down' : 'up';
            document.getElementById('link-popup').classList.add('hidden');
            runAlgorithm();
        }
    });
    
    function updatePanel() {
        const step = algorithmSteps[spfStepIdx];
        document.getElementById('step-counter').innerText = `Step ${spfStepIdx + 1} / ${algorithmSteps.length}`;
        
        if (!step) return;
        
        // Update Description
        document.getElementById('step-desc-text').innerText = step.desc;
        
        // Candidates & Settled Lists
        document.getElementById('list-candidates').innerHTML = step.candidates && step.candidates.length > 0 
            ? step.candidates.map(c => `<div class="flex justify-between py-0.5 border-b border-slate-100 dark:border-slate-800"><span>${c}</span> <span class="text-slate-400">cost ${step.dist[c] === Infinity ? 'INF' : step.dist[c]}</span></div>`).join('') 
            : '<div class="text-slate-400 py-1 italic">Danh sách trống</div>';
            
        document.getElementById('list-settled').innerHTML = step.settled && step.settled.length > 0 
            ? step.settled.map(c => `<div class="flex justify-between py-0.5 border-b border-slate-100 dark:border-slate-800"><span class="text-emerald-500 font-bold">${c}</span> <span class="text-slate-400">cost ${step.dist[c]}</span></div>`).join('') 
            : '<div class="text-slate-400 py-1 italic">Chưa có nút chốt</div>';
        
        // Distance Vector Table
        let distHtml = '';
        Object.keys(step.dist).forEach(n => {
            const cost = step.dist[n] === Infinity ? '<span class="text-rose-500 font-bold">INF</span>' : `<span class="font-bold text-slate-800 dark:text-white">${step.dist[n]}</span>`;
            const via = step.prevMulti[n] && step.prevMulti[n].length > 0 ? step.prevMulti[n].join(', ') : '-';
            distHtml += `<tr class="border-b border-slate-100 dark:border-slate-800/60"><td class="py-1.5 font-bold">${n}</td><td>${cost}</td><td>${via}</td></tr>`;
        });
        document.getElementById('table-distance').innerHTML = distHtml;
        
        // LSDB Tab
        let lsdbHtml = '';
        graph.nodes.forEach(n => {
            const nLinks = graph.links.filter(l => (l.source === n.id || l.target === n.id) && l.state === 'up');
            lsdbHtml += `
                <div class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-200 dark:border-slate-700">
                    <div class="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                        <span>${n.id} Router LSA</span>
                        <span class="text-[9px] font-mono text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-1.5 py-0.5 rounded">Type 1</span>
                    </div>
                    <div class="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                        ${nLinks.map(l => {
                            const peer = l.source === n.id ? l.target : l.source;
                            return `<div class="py-0.5">• Link p2p → ${peer} (metric ${l.cost})</div>`;
                        }).join('') || '<div class="py-0.5 text-rose-400 italic">Không có link hoạt động</div>'}
                    </div>
                </div>
            `;
        });
        document.getElementById('lsdb-container').innerHTML = lsdbHtml;
        
        // Routing Table Tab
        let rtHtml = `Gateway of last resort is not set\n\n`;
        graph.nodes.forEach(n => {
            if (n.id === srcNode) return;
            const cost = step.dist[n.id];
            if (cost === Infinity) {
                rtHtml += `O    ${n.ip}/32 is UNREACHABLE (no SPF path)\n`;
            } else {
                let nexthops = [];
                if (step.prevMulti[n.id]) {
                    step.prevMulti[n.id].forEach(p => {
                        let curr = p;
                        if (curr === srcNode) {
                            nexthops.push(n.id);
                        } else {
                            while (curr && step.prevMulti[curr] && !step.prevMulti[curr].includes(srcNode) && curr !== srcNode) {
                                curr = step.prevMulti[curr][0];
                            }
                            if (curr && step.prevMulti[curr] && step.prevMulti[curr].includes(srcNode)) {
                                nexthops.push(curr);
                            }
                        }
                    });
                }
                nexthops = [...new Set(nexthops)];
                if (nexthops.length === 0) nexthops = [n.id];
                
                nexthops.forEach((nh, idx) => {
                    const viaNode = graph.nodes.find(x => x.id === nh);
                    const viaIp = viaNode ? viaNode.ip : '10.0.0.x';
                    if (idx === 0) {
                        rtHtml += `O    ${n.ip}/32 [110/${cost}] via ${viaIp}, 00:00:15, GigabitEthernet\n`;
                    } else {
                        rtHtml += `                    [110/${cost}] via ${viaIp}, 00:00:15, GigabitEthernet\n`;
                    }
                });
            }
        });
        document.getElementById('cli-rt').innerText = rtHtml;
        
        // Trigger synchronized packet flow animation
        triggerStepPacket(step);
    }
    
    function triggerStepPacket(step) {
        if (!step) return;
        
        if (step.action === 'evaluate') {
            animatePacket({
                from: step.from,
                to: step.processing,
                label: `SPF Probe (Cost: ${step.cost})`,
                icon: 'fa-share-nodes',
                color: 'bg-indigo-600',
                duration: 1100
            });
        } else if (step.action === 'update') {
            animatePacket({
                from: step.from,
                to: step.processing,
                label: `SPF Update (Cost: ${step.cost})`,
                icon: 'fa-bolt',
                color: 'bg-emerald-600',
                duration: 1100
            });
        } else if (step.action === 'done') {
            const hops = getPathHops(step.prevMulti, srcNode, dstNode);
            if (hops && hops.length >= 2) {
                animatePathSequence(hops);
            }
        } else {
            clearAllAnimations();
        }
    }
    
    function spfNext() {
        if (spfStepIdx < algorithmSteps.length - 1) {
            spfStepIdx++;
            renderTopology();
            updatePanel();
        } else {
            spfPlayPause(true);
        }
    }
    
    function spfPrev() {
        if (spfStepIdx > 0) {
            clearAllAnimations();
            spfStepIdx--;
            renderTopology();
            updatePanel();
        }
    }
    
    function spfReset() {
        clearAllAnimations();
        spfStepIdx = 0;
        renderTopology();
        updatePanel();
    }
    
    function spfPlayPause(forceStop = false) {
        if (autoPlayInterval || forceStop) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
            document.getElementById('btn-play').innerHTML = '<i class="fas fa-play"></i>';
        } else {
            const speed = parseInt(document.getElementById('speed-slider').value);
            const interval = 2200 - speed + 200;
            
            document.getElementById('btn-play').innerHTML = '<i class="fas fa-pause"></i>';
            autoPlayInterval = setInterval(() => {
                spfNext();
            }, interval);
        }
    }

    return {
        init,
        loadScenario,
        resetTopology,
        openLinkPopup,
        spfNext,
        spfPrev,
        spfReset,
        spfPlayPause
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
