const fs = require('fs');

const file = 'projects/failover/vrrp-ospf-failover.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Navigation Placement: Stepper with interconnected circles
// Replace buildStepper function
content = content.replace(
    /buildStepper\(\) \{[\s\S]*?\}\n\n  \/\/ ── Impact banner/m,
    `buildStepper() {
    const el = document.getElementById('stepper');
    if (!this.triggered) {
      el.innerHTML = '<span class="text-xs text-slate-500 dark:text-slate-400 font-mono">Bấm "Trigger Outage" để bắt đầu mô phỏng failover</span>';
      return;
    }
    
    let html = '<div class="flex items-center w-full max-w-4xl mx-auto">';
    TIMELINE.forEach((s, i) => {
      const isActive = i === this.cur;
      const isPast = i < this.cur;
      const colorCls = isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40 ring-4 ring-blue-500/20' 
                     : isPast ? 'bg-slate-800 text-white' 
                     : 'bg-white text-slate-400 border-2 border-slate-200';
      
      html += \`
        <div class="relative flex flex-col items-center flex-1 cursor-pointer group" onclick="app.seek(\${i})">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all z-10 \${colorCls}">
            \${i}
          </div>
          <div class="absolute top-10 w-32 text-center">
            <div class="text-[10px] font-bold uppercase tracking-widest \${isActive ? 'text-blue-600' : 'text-slate-500'} transition-colors">\${s.event}</div>
          </div>
        </div>
      \`;
      
      if (i < TIMELINE.length - 1) {
        const lineActive = i < this.cur ? 'bg-slate-800' : 'bg-slate-200';
        html += \`<div class="flex-1 h-0.5 \${lineActive} -mx-4 z-0 transition-colors"></div>\`;
      }
    });
    html += '</div>';
    el.innerHTML = html;
  }

  // ── Impact banner`
);

// Update stepper container CSS
content = content.replace(
    /<div class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-2\.5 overflow-x-auto shadow-sm">\s*<div class="flex items-center gap-2 min-w-max" id="stepper">/m,
    `<div class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-6 overflow-x-auto shadow-inner">
  <div class="w-full relative min-h-[60px]" id="stepper">`
);

// 2. Layout and UI Depth & Terminal
// Remove RIGHT sidebar, make canvas relative flex-1, add overlays
content = content.replace(
    /<!-- RIGHT: detail panel -->[\s\S]*?<\/main>/m,
    `<!-- OVERLAYS (Floating Cards) -->
    <div class="absolute top-4 left-4 z-40 flex flex-col gap-4 pointer-events-none">
      <div id="vrrp-card" class="bg-white rounded-xl shadow-xl border border-slate-200 p-4 w-[380px] pointer-events-auto transition-all"></div>
      <div id="ospf-card" class="bg-white rounded-xl shadow-xl border border-slate-200 p-4 w-[380px] pointer-events-auto transition-all"></div>
    </div>
    
    <!-- TERMINAL (Anchored Bottom) -->
    <div class="absolute bottom-4 left-4 right-4 z-40 pointer-events-none flex justify-center">
      <div class="bg-slate-900 rounded-xl shadow-2xl border border-slate-800 w-full max-w-5xl pointer-events-auto flex flex-col h-48 overflow-hidden">
        <div class="flex items-center space-x-2 px-4 py-2.5 bg-slate-800/80 border-b border-slate-700/80 shrink-0">
          <div class="w-3 h-3 rounded-full bg-rose-500/90"></div>
          <div class="w-3 h-3 rounded-full bg-amber-500/90"></div>
          <div class="w-3 h-3 rounded-full bg-emerald-500/90"></div>
          <div class="ml-4 text-[10px] text-slate-400 font-mono tracking-widest uppercase" id="term-title">Console</div>
        </div>
        <div class="text-sky-400 font-mono text-xs p-4 overflow-y-auto flex-1 whitespace-pre-wrap" id="term-out"></div>
      </div>
    </div>

  </div> <!-- end of flex-1 (was left side) -->
</main>`
);

// Add drop-shadow to nodes
content = content.replace(
    /\.ninner\{([\s\S]*?)box-shadow:([^\}]+)\}/g,
    `.ninner{$1box-shadow:$2;filter:drop-shadow(0 10px 15px rgba(0,0,0,0.1));}`
);

// Update renderPanel to populate floating cards instead of panel-body
content = content.replace(
    /renderPanel\(s\) \{[\s\S]*?  \} \/\/ end renderPanel/m,
    `renderPanel(s) {
    if (!this.triggered) {
      document.getElementById('vrrp-card').innerHTML = '<div class="text-xs text-slate-500 text-center py-4">Waiting for trigger...</div>';
      document.getElementById('ospf-card').innerHTML = '';
      document.getElementById('term-out').innerHTML = '';
      return;
    }
    
    // VRRP Table (clean white background, colored text)
    let vrrpHtml = \`
      <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">
        <i class="fas fa-shield-halved mr-1"></i> VRRP State
      </div>
      <div class="space-y-1">
    \`;
    
    s.vrrp.forEach(v => {
      let stColor = v.state.includes('MASTER') ? 'text-emerald-500' : v.state.includes('BACKUP') ? 'text-slate-500' : 'text-fuchsia-500';
      vrrpHtml += \`
        <div class="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full \${v.state.includes('MASTER') ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}"></div>
            <span class="text-xs font-bold text-slate-800 mono">\${v.node}</span>
          </div>
          <span class="text-[10px] font-bold \${stColor} uppercase tracking-widest">\${v.state}</span>
          <span class="text-[10px] text-slate-400 mono">Pri:\${v.pri}</span>
        </div>
      \`;
    });
    vrrpHtml += '</div>';
    document.getElementById('vrrp-card').innerHTML = vrrpHtml;

    // OSPF Table
    let ospfHtml = \`
      <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">
        <i class="fas fa-route mr-1"></i> OSPF Routing
      </div>
      <div class="space-y-2">
    \`;
    s.ospf.neighbors.forEach(n => {
      ospfHtml += \`
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-700 mono">\${n.from} ↔ \${n.to}</span>
          <span class="text-[10px] font-bold text-indigo-500">\${n.role}</span>
        </div>
      \`;
    });
    ospfHtml += '<div class="mt-2 pt-2 border-t border-slate-100 space-y-1">';
    s.ospf.routes.forEach(r => {
      let rCol = r.includes('!') ? 'text-amber-500' : 'text-slate-600';
      ospfHtml += \`<div class="text-[10.5px] font-mono \${rCol}">\${r}</div>\`;
    });
    ospfHtml += '</div></div>';
    document.getElementById('ospf-card').innerHTML = ospfHtml;

    // Terminal
    let termOut = s.cli;
    // apply basic syntax highlighting inside the template
    termOut = termOut.replace(/^(VyOS.*?#.*)$/gm, '<span class="text-slate-500">$1</span>');
    termOut = termOut.replace(/^(!.*)$/gm, '<span class="text-slate-400 italic">$1</span>');
    
    document.getElementById('term-out').innerHTML = termOut;
    document.getElementById('term-title').textContent = s.event;
    
  } // end renderPanel`
);

// Remove the setTab function and activeTab logic since we don't have tabs anymore
content = content.replace(/setTab\(tab\) \{[\s\S]*?\}/m, '');

// Clean up canvas CSS so it fills properly
content = content.replace(/min-height:480px;/, 'min-height:480px; flex: 1;');

// Remove 'xl:h-[calc(100vh-95px)]' so canvas can fill height, and set the main parent
content = content.replace(
    /<main class="flex-1 flex flex-col xl:flex-row overflow-y-auto xl:overflow-hidden xl:h-\[calc\(100vh-95px\)\]">/,
    '<main class="flex-1 flex flex-col overflow-hidden relative bg-slate-50">'
);
// Remove the <div class="flex-1 flex flex-col min-h-[480px] xl:min-h-0 bg-white ...
content = content.replace(
    /<div class="flex-1 flex flex-col min-h-\[480px\] xl:min-h-0 bg-white dark:bg-slate-950 border-b xl:border-b-0 xl:border-r border-slate-200 dark:border-slate-800\/60">/,
    '<div class="flex-1 flex flex-col w-full h-full relative">'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Update complete');
