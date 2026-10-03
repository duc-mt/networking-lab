
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
        { id: 'R2', label: 'ABR', ip: '10.0.0.2', x: 350, y: 300, area: '0' },
        { id: 'R3', label: 'ABR', ip: '10.0.0.3', x: 1050, y: 300, area: '0' },
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
        { source: 'R1', target: 'R6', cost: 64, type: 'T1 Serial', state: 'up' }, // Direct but slow
        { source: 'R2', target: 'R3', cost: 64, type: 'T1 Serial', state: 'up' }
    ],
    zones: [
        { id: 'area0', title: 'Area 0 (Backbone)', color: 'blue', x: 250, y: 50, w: 900, h: 500 },
        { id: 'area1', title: 'Area 1', color: 'indigo', x: 20, y: 150, w: 200, h: 300 },
        { id: 'area2', title: 'Area 2', color: 'sky', x: 1180, y: 150, w: 200, h: 300 }
    ]
};

const SCENARIOS = [
    { id: 'normal', name: 'Normal Operation', patches: [], src: 'R4', dst: 'R5', note: 'Standard SPF calculation. R4 finds the shortest path to R5 via the backbone.' },
    { id: 'link-fail', name: 'Link Failure', patches: [{ type: 'link', source: 'R1', target: 'R3', state: 'down' }], src: 'R4', dst: 'R5', note: 'R1-R3 link fails. SPF recalculates path via R6 instead.' },
    { id: 'cost-tune', name: 'Cost Tuning', patches: [{ type: 'link', source: 'R2', target: 'R6', cost: 1, state: 'up' }, { type: 'link', source: 'R3', target: 'R6', cost: 1, state: 'up' }], src: 'R4', dst: 'R5', note: 'FastEthernet links upgraded to Gigabit. Cost is lower, so path might prefer R6.' },
    { id: 'ecmp', name: 'ECMP', patches: [{ type: 'link', source: 'R2', target: 'R6', cost: 1, state: 'up' }, { type: 'link', source: 'R3', target: 'R6', cost: 1, state: 'up' }, { type: 'link', source: 'R1', target: 'R6', cost: 2, state: 'up' }], src: 'R2', dst: 'R5', note: 'Equal Cost Multi-Path. Multiple paths have the exact same cost.' }
];

const App = (() => {
    let graph = deepClone(BASE_GRAPH);
    let srcNode = 'R4';
    let dstNode = 'R5';
    let activeScenario = SCENARIOS[0];
    
    let algorithmSteps = [];
    let spfStepIdx = 0;
    let autoPlayInterval = null;
    
    // UI Elements
    const elNodes = document.getElementById('nodes-layer');
    const elLinksHit = document.getElementById('svg-links-hit');
    const elLinksVis = document.getElementById('svg-links-vis');
    const elLabels = document.getElementById('labels-layer');
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
                
                document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
                document.getElementById(btn.dataset.target).classList.remove('hidden');
                document.getElementById(btn.dataset.target).classList.add('flex');
            });
        });
    }
    
    function setupThemeToggle() {
        const btn = document.getElementById('theme-toggle');
        btn.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
        });
    }
    
    function renderScenarios() {
        const p = document.getElementById('scenario-pills');
        p.innerHTML = SCENARIOS.map(s => `
            <button onclick="App.loadScenario('${s.id}')" class="px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${s.id === activeScenario.id ? 'border border-indigo-500 text-indigo-500 bg-indigo-500/10' : 'border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}">
                ${s.name}
            </button>
        `).join('');
    }
    
    function loadScenario(id) {
        activeScenario = SCENARIOS.find(s => s.id === id);
        renderScenarios(); // update active class
        
        graph = deepClone(BASE_GRAPH);
        srcNode = activeScenario.src;
        dstNode = activeScenario.dst;
        
        document.getElementById('hdr-src').innerText = srcNode;
        document.getElementById('hdr-dst').innerText = dstNode;
        
        // Apply patches
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
            desc: `Start SPF calculation from ${srcId}`,
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
                desc: `Selected ${u} with lowest cost ${dist[u]}`,
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
                        desc: `Evaluating neighbor ${v} via ${u} (cost ${l.cost})`,
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
                            desc: `Found better path to ${v} (cost ${alt})`,
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
                                desc: `Found equal cost path to ${v} via ${u} (ECMP, cost ${alt})`,
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
            desc: `SPF tree calculation complete`,
            dist: deepClone(dist),
            prevMulti: deepClone(prevMulti),
            candidates: Array.from(candidates),
            settled: Array.from(settled)
        });
        
        return { dist, prevMulti, steps };
    }
    function runAlgorithm() {
        spfStepIdx = 0;
        if (autoPlayInterval) clearInterval(autoPlayInterval);
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
            
            // Convert % to px to clamp, then back to %
            let pxX = (left / 100) * bounds.width;
            let pxY = (top / 100) * bounds.height;
            
            // Adjust so it's centered
            pxX -= w/2;
            pxY -= h/2;
            
            const EDGE_PX = 10;
            if (pxX < EDGE_PX) pxX = EDGE_PX;
            if (pxY < EDGE_PX) pxY = EDGE_PX;
            if (pxX + w > bounds.width - EDGE_PX) pxX = bounds.width - w - EDGE_PX;
            if (pxY + h > bounds.height - EDGE_PX) pxY = bounds.height - h - EDGE_PX;
            
            // Back to center %
            const newLeft = ((pxX + w/2) / bounds.width) * 100;
            const newTop = ((pxY + h/2) / bounds.height) * 100;
            
            card.style.left = newLeft + '%';
            card.style.top = newTop + '%';
        });
    }
    
    function renderTopology() {
        const step = algorithmSteps[spfStepIdx];
        
        // Render Zones
        let zoneHtml = '';
        graph.zones.forEach(z => {
            const hex = z.color === 'blue' ? '#3b82f6' : z.color === 'indigo' ? '#6366f1' : z.color === 'sky' ? '#0ea5e9' : '#64748b';
            zoneHtml += `
                <div class="zone-box flex flex-col justify-end p-2" style="
                    left: ${(z.x/REF_W)*100}%; top: ${(z.y/REF_H)*100}%; 
                    width: ${(z.w/REF_W)*100}%; height: ${(z.h/REF_H)*100}%; 
                    border-color: ${hex}55; background: ${hex}05;
                ">
                    <span class="text-[10px] font-bold uppercase tracking-widest" style="color: ${hex}">${z.title}</span>
                </div>
            `;
        });
        
        // Render Nodes
        let nodesHtml = zoneHtml;
        graph.nodes.forEach(n => {
            let stateClass = 'node-normal';
            let status = 'ONLINE';
            
            if (step) {
                if (n.id === srcNode) stateClass = 'node-source';
                else if (n.id === dstNode) stateClass = 'node-dest';
                else if (step.processing === n.id) stateClass = 'node-processing';
                else if (step.candidates.includes(n.id)) stateClass = 'node-candidate';
                else if (step.settled.includes(n.id)) stateClass = 'node-settled';
                
                // If done, highlight path
                if (step.action === 'done' && n.id !== srcNode && isNodeOnPath(n.id, step.prevMulti, srcNode, dstNode)) {
                    stateClass = 'node-path';
                }
            }
            
            const costLabel = step && step.dist[n.id] !== Infinity ? `Cost: ${step.dist[n.id]}` : (step && step.dist[n.id] === Infinity ? 'Unreachable' : '');
            
            nodesHtml += `
                <div class="node-card absolute flex flex-col items-center bg-white dark:bg-slate-900 border-2 rounded-xl p-2 w-28 shadow-sm transition-all-fast z-20 ${stateClass}" style="left: ${(n.x/REF_W)*100}%; top: ${(n.y/REF_H)*100}%; transform: translate(-50%, -50%);">
                    <div class="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[9px] font-bold border bg-white dark:bg-slate-800 whitespace-nowrap">${n.label}</div>
                    <div class="w-10 h-10 bg-gradient-to-b from-slate-50 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-full flex items-center justify-center border shadow-inner my-2">
                        <i class="fas fa-server text-slate-500 dark:text-slate-400"></i>
                    </div>
                    <div class="text-sm font-extrabold">${n.id}</div>
                    <div class="text-[9px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded mt-1">${n.ip}</div>
                    <div class="text-[9px] font-black tracking-widest px-2 py-0.5 rounded-full uppercase border mt-2 ${status==='ONLINE'?'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800':''}">${status}</div>
                    ${costLabel ? `<div class="absolute -bottom-5 text-[10px] font-mono font-bold px-2 rounded bg-slate-100 dark:bg-slate-800 ${step && step.dist[n.id]===Infinity ? 'text-red-500' : 'text-slate-600 dark:text-slate-300'}">${costLabel}</div>` : ''}
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
    function drawLinks(step) {
        const bounds = container.getBoundingClientRect();
        
        let visHtml = '';
        let hitHtml = '';
        let labelsHtml = '';
        
        graph.links.forEach((l, i) => {
            const n1 = document.querySelector(`.node-card:nth-child(${graph.nodes.findIndex(n => n.id === l.source) + 1 + graph.zones.length})`);
            const n2 = document.querySelector(`.node-card:nth-child(${graph.nodes.findIndex(n => n.id === l.target) + 1 + graph.zones.length})`);
            
            if (!n1 || !n2) return;
            
            const x1 = parseFloat(n1.style.left) * bounds.width / 100;
            const y1 = parseFloat(n1.style.top) * bounds.height / 100;
            const x2 = parseFloat(n2.style.left) * bounds.width / 100;
            const y2 = parseFloat(n2.style.top) * bounds.height / 100;
            
            let linkClass = 'link-active';
            if (l.state === 'down') linkClass = 'link-down';
            else if (step) {
                // If it's on the best path from src to dst when done
                
                if (step.action === 'done') {
                    let onPath = false;
                    let q = [dstNode];
                    let visited = new Set();
                    while(q.length > 0) {
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
                    if (onPath) linkClass = 'link-path';
                } else if (step.action === 'evaluate' && ((l.source === step.processing && l.target === step.from) || (l.target === step.processing && l.source === step.from))) {
                    linkClass = 'link-candidate'; // evaluating this link
                }
            }
            
            visHtml += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${linkClass}" ${linkClass==='link-path'?'marker-end="url(#arrow-emerald)"':''} ${linkClass==='link-candidate'?'marker-end="url(#arrow-violet)"':''}></line>`;
            hitHtml += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" data-idx="${i}" onclick="App.openLinkPopup(event, ${i})"></line>`;
            
            // Label in middle
            const mx = (x1 + x2) / 2;
            const my = (y1 + y2) / 2;
            labelsHtml += `
                <div class="absolute bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 px-1.5 py-0.5 rounded text-[10px] font-mono shadow-sm cursor-pointer hover:scale-110 transition-transform ${l.state==='down'?'text-red-500 line-through opacity-70':'text-slate-600 dark:text-slate-300'}" style="left: ${mx}px; top: ${my}px; transform: translate(-50%, -50%);" onclick="App.openLinkPopup(event, ${i})">
                    Cost: ${l.cost}
                </div>
            `;
        });
        
        elLinksVis.innerHTML = visHtml;
        elLinksHit.innerHTML = hitHtml;
        elLabels.innerHTML = labelsHtml;
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
            document.getElementById('popup-shut-txt').innerHTML = '<i class="fas fa-check-circle mr-1"></i> No Shutdown';
            shutBtn.classList.remove('text-red-500', 'hover:bg-red-50');
            shutBtn.classList.add('text-emerald-500', 'hover:bg-emerald-50', 'dark:hover:bg-emerald-900/20');
        } else {
            document.getElementById('popup-shut-txt').innerHTML = '<i class="fas fa-times-circle mr-1"></i> Shutdown Link';
            shutBtn.classList.remove('text-emerald-500', 'hover:bg-emerald-50', 'dark:hover:bg-emerald-900/20');
            shutBtn.classList.add('text-red-500', 'hover:bg-red-50', 'dark:hover:bg-red-900/20');
        }
        
        // Position
        popup.style.left = e.clientX + 'px';
        popup.style.top = e.clientY + 'px';
        popup.classList.remove('hidden');
    }
    
    // Bind popup actions
    document.querySelectorAll('.popup-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
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
        
        // Desc
        document.getElementById('step-desc-text').innerText = step.desc;
        
        // Candidates & Settled
        document.getElementById('list-candidates').innerHTML = step.candidates.length > 0 ? step.candidates.map(c => `<div>${c} <span class="text-slate-400">cost ${step.dist[c]}</span></div>`).join('') : '<div class="text-slate-400">Empty</div>';
        document.getElementById('list-settled').innerHTML = step.settled.length > 0 ? step.settled.map(c => `<div>${c} <span class="text-slate-400">cost ${step.dist[c]}</span></div>`).join('') : '<div class="text-slate-400">Empty</div>';
        
        // Distance table
        let distHtml = '';
        Object.keys(step.dist).forEach(n => {
            const cost = step.dist[n] === Infinity ? '<span class="text-red-500">INF</span>' : step.dist[n];
            const via = step.prevMulti[n] && step.prevMulti[n].length > 0 ? step.prevMulti[n].join(', ') : '-';
            distHtml += `<tr><td class="py-1 font-bold">${n}</td><td>${cost}</td><td>${via}</td></tr>`;
        });
        document.getElementById('table-distance').innerHTML = distHtml;
        
        // LSDB Tab
        let lsdbHtml = '';
        graph.nodes.forEach(n => {
            const nLinks = graph.links.filter(l => (l.source === n.id || l.target === n.id) && l.state === 'up');
            lsdbHtml += `
                <div class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-200 dark:border-slate-700">
                    <div class="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">${n.id} Router LSA</div>
                    <div class="text-[10px] font-mono text-slate-500">
                        ${nLinks.map(l => {
                            const peer = l.source === n.id ? l.target : l.source;
                            return `<div>Link: p2p -> ${peer} (metric ${l.cost})</div>`;
                        }).join('') || '<div>No active links</div>'}
                    </div>
                </div>
            `;
        });
        document.getElementById('lsdb-container').innerHTML = lsdbHtml;
        
        
        // RT Tab
        let rtHtml = `Gateway of last resort is not set\n\n`;
        graph.nodes.forEach(n => {
            if (n.id === srcNode) return;
            const cost = step.dist[n.id];
            if (cost === Infinity) {
                rtHtml += `O    ${n.ip}/32 is UNREACHABLE\n`;
            } else {
                let nexthops = [];
                if (step.prevMulti[n.id]) {
                    step.prevMulti[n.id].forEach(p => {
                        let curr = p;
                        // trace back to find the neighbor directly connected to srcNode
                        let isDirect = false;
                        if (curr === srcNode) {
                            nexthops.push(n.id);
                        } else {
                            while (curr && step.prevMulti[curr] && !step.prevMulti[curr].includes(srcNode) && curr !== srcNode) {
                                curr = step.prevMulti[curr][0]; // just take first path for tracing RT
                            }
                            if (curr && step.prevMulti[curr] && step.prevMulti[curr].includes(srcNode)) {
                                nexthops.push(curr);
                            }
                        }
                    });
                }
                // unique nexthops
                nexthops = [...new Set(nexthops)];
                if (nexthops.length === 0) nexthops = [n.id];
                
                nexthops.forEach((nh, idx) => {
                    const viaIp = graph.nodes.find(x => x.id === nh).ip;
                    if (idx === 0) {
                        rtHtml += `O    ${n.ip}/32 [110/${cost}] via ${viaIp}, 00:00:05, GigabitEthernet\n`;
                    } else {
                        rtHtml += `                    [110/${cost}] via ${viaIp}, 00:00:05, GigabitEthernet\n`;
                    }
                });
            }
        });
        document.getElementById('cli-rt').innerText = rtHtml;
    }
    
    function spfNext() {
        if (spfStepIdx < algorithmSteps.length - 1) {
            spfStepIdx++;
            renderTopology();
            updatePanel();
        } else {
            spfPlayPause(true); // stop if playing
        }
    }
    
    function spfPrev() {
        if (spfStepIdx > 0) {
            spfStepIdx--;
            renderTopology();
            updatePanel();
        }
    }
    
    function spfReset() {
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
            const interval = 2000 - speed + 200;
            
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
