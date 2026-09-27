import re

with open('projects/troubleshooting/vxlan-mtu-blackhole.html', 'r') as f:
    content = f.read()

old_logic = """                // Dynamically calculate ratio to ensure labels fall outside the nodes (approx 85px offset from center)
                let dist = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                let t_src = dist > 0 ? Math.min(0.4, 85 / dist) : 0.22;
                let t_dst = 1 - t_src;

                // Port Labels
                if (lDef.srcPort) {
                    const spBadge = document.createElement('div');
                    spBadge.className = 'absolute z-20 text-[8px] font-mono font-bold px-1 py-px rounded bg-white/90 dark:bg-slate-800/90 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-600 whitespace-nowrap transition-opacity duration-500 backdrop-blur-sm';
                    let px = lDef.curve ? this.getBezierPoint(t_src, x1, mx, x2) : x1 + (x2 - x1)*t_src;
                    let py = lDef.curve ? this.getBezierPoint(t_src, y1, my, y2) : y1 + (y2 - y1)*t_src;
                    spBadge.style.left = px + 'px';
                    spBadge.style.top = py + 'px';
                    spBadge.style.transform = 'translate(-50%, -50%)';
                    spBadge.innerText = lDef.srcPort;
                    this.dom.labels.appendChild(spBadge);
                }

                if (lDef.dstPort) {
                    const dpBadge = document.createElement('div');
                    dpBadge.className = 'absolute z-20 text-[8px] font-mono font-bold px-1 py-px rounded bg-white/90 dark:bg-slate-800/90 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-600 whitespace-nowrap transition-opacity duration-500 backdrop-blur-sm';
                    let px = lDef.curve ? this.getBezierPoint(t_dst, x1, mx, x2) : x1 + (x2 - x1)*t_dst;
                    let py = lDef.curve ? this.getBezierPoint(t_dst, y1, my, y2) : y1 + (y2 - y1)*t_dst;
                    dpBadge.style.left = px + 'px';
                    dpBadge.style.top = py + 'px';
                    dpBadge.style.transform = 'translate(-50%, -50%)';
                    dpBadge.innerText = lDef.dstPort;
                    this.dom.labels.appendChild(dpBadge);
                }"""

new_logic = """                // Dynamically calculate ratio to ensure labels fall outside the nodes (approx 85px offset from center)
                let dist = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                let t_src = dist > 0 ? Math.min(0.4, 85 / dist) : 0.22;
                let t_dst = 1 - t_src;
                
                // Calculate Normal Vector (perpendicular shift) to dodge node badges (Top/Bottom badges)
                let nx = dist > 0 ? -(y2 - y1) / dist : 0;
                let ny = dist > 0 ? (x2 - x1) / dist : 0;
                let shiftPx = 18; // shift 18px perpendicularly

                // Port Labels
                if (lDef.srcPort) {
                    const spBadge = document.createElement('div');
                    spBadge.className = 'absolute z-20 text-[8px] font-mono font-bold px-1 py-px rounded bg-white/90 dark:bg-slate-800/90 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-600 whitespace-nowrap transition-opacity duration-500 backdrop-blur-sm';
                    let px = lDef.curve ? this.getBezierPoint(t_src, x1, mx, x2) : x1 + (x2 - x1)*t_src;
                    let py = lDef.curve ? this.getBezierPoint(t_src, y1, my, y2) : y1 + (y2 - y1)*t_src;
                    
                    // Apply perpendicular shift
                    px += nx * shiftPx;
                    py += ny * shiftPx;
                    
                    spBadge.style.left = px + 'px';
                    spBadge.style.top = py + 'px';
                    spBadge.style.transform = 'translate(-50%, -50%)';
                    spBadge.innerText = lDef.srcPort;
                    this.dom.labels.appendChild(spBadge);
                }

                if (lDef.dstPort) {
                    const dpBadge = document.createElement('div');
                    dpBadge.className = 'absolute z-20 text-[8px] font-mono font-bold px-1 py-px rounded bg-white/90 dark:bg-slate-800/90 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-600 whitespace-nowrap transition-opacity duration-500 backdrop-blur-sm';
                    let px = lDef.curve ? this.getBezierPoint(t_dst, x1, mx, x2) : x1 + (x2 - x1)*t_dst;
                    let py = lDef.curve ? this.getBezierPoint(t_dst, y1, my, y2) : y1 + (y2 - y1)*t_dst;
                    
                    // Apply perpendicular shift
                    px += nx * shiftPx;
                    py += ny * shiftPx;
                    
                    dpBadge.style.left = px + 'px';
                    dpBadge.style.top = py + 'px';
                    dpBadge.style.transform = 'translate(-50%, -50%)';
                    dpBadge.innerText = lDef.dstPort;
                    this.dom.labels.appendChild(dpBadge);
                }"""

content = content.replace(old_logic, new_logic)

with open('projects/troubleshooting/vxlan-mtu-blackhole.html', 'w') as f:
    f.write(content)
