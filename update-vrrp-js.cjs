const fs = require('fs');

const file = 'projects/failover/vrrp-ospf-failover.html';
let content = fs.readFileSync(file, 'utf8');

// The original file has:
//   setTab(tab) {
//     this.activeTab = tab;
//     ...
//   }
//   renderPanel(s) { ... }
//   renderVRRP(body, s) { ... }
//   renderOSPF(body, s) { ... }
//   renderCLI(body, s) { ... }

// We want to replace all of this with just our new renderPanel(s).
const newRenderPanel = `renderPanel(s) {
    if (!this.triggered) {
      document.getElementById('vrrp-card').innerHTML = '<div class="text-xs text-slate-500 text-center py-4">Waiting for trigger...</div>';
      document.getElementById('ospf-card').innerHTML = '';
      document.getElementById('term-out').innerHTML = '';
      return;
    }
    
    // VRRP Table
    let vrrpHtml = \`
      <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">
        <i class="fas fa-shield-halved mr-1"></i> VRRP State
      </div>
      <div class="space-y-1">
    \`;
    
    s.vrrp.forEach(v => {
      let isMaster = v.state.includes('MASTER');
      let stColor = isMaster ? 'text-emerald-500' : v.state.includes('BACKUP') ? 'text-slate-500' : 'text-amber-500';
      vrrpHtml += \`
        <div class="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full \${isMaster ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}"></div>
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
    let termOut = s.cli || '';
    termOut = termOut.replace(/^(VyOS.*?#.*)$/gm, '<span class="text-slate-500">$1</span>');
    termOut = termOut.replace(/^(!.*)$/gm, '<span class="text-slate-400 italic">$1</span>');
    
    document.getElementById('term-out').innerHTML = termOut;
    document.getElementById('term-title').textContent = s.event;
  }`;

// Use regex to replace from setTab(tab) to the end of renderCLI
content = content.replace(
    /setTab\(tab\) \{[\s\S]*?renderCLI\(body, s\) \{[\s\S]*?body\.innerHTML = html;\n  \}/m,
    newRenderPanel
);

// And since we might still have a call to `this.renderPanel(TIMELINE[this.cur]);` left behind from setTab, it's fine if it was removed, actually `setTab` was removed but maybe not if the previous regex failed.
// Actually, `setTab` might still be there if the first regex failed.

// Wait, I already removed setTab in the previous script?
// Let's check if setTab is still there.
// If it's not, we just replace `renderPanel(s) { ... }` up to `clampNodes() {`
content = content.replace(
    /renderPanel\(s\) \{[\s\S]*?clampNodes\(\) \{/m,
    newRenderPanel + '\n\n  clampNodes() {'
);

// Remove references to app.setTab from HTML (Wait, I already deleted the right sidebar!)
// The right sidebar was successfully replaced.

// Let's also check if "app.setTab" is anywhere else.
content = content.replace(/app\.setTab\('[^']+'\)/g, "console.log('Tabs removed')");

fs.writeFileSync(file, content, 'utf8');
console.log('Update renderPanel complete');
