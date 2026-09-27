import re

with open('projects/topology-design/evpn-vxlan-mpls-transit.html', 'r') as f:
    content = f.read()

# Replace node generation code
old_node_js = r"""        const el = document.createElement\('div'\);\s*el\.id = `node-\$\{n\.id\}`;\s*el\.className = `absolute w-16 h-16 bg-white dark:bg-slate-800 rounded-full border-2 border-slate-300 dark:border-slate-600 shadow-md flex flex-col items-center justify-center cursor-pointer transition-all duration-300 z-10 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-\[0_0_15px_rgba\(59,130,246,0\.4\)\] group`;\s*el\.style\.left = n\.x \+ 'px';\s*el\.style\.top = n\.y \+ 'px';\s*el\.style\.transform = 'translate\(-50%, -50%\)';\s*el\.onclick = \(\) => selectNode\(n\.id\);\s*// Dim if MPLS node in overlay view\s*if \(currentView === 'overlay' && n\.zone === 'mpls'\) el\.classList\.add\('opacity-20'\);\s*el\.innerHTML = `\s*<i class="fa-solid \$\{n\.icon\} text-xl text-slate-500 dark:text-slate-400 transition-colors group-hover:text-blue-500"></i>\s*<div class="absolute top-\[70px\] whitespace-nowrap text-\[11px\] font-semibold bg-white dark:bg-slate-900 px-2 py-0\.5 border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-300 shadow-sm">\$\{n\.name\}</div>\s*`;\s*nodesLayer\.appendChild\(el\);"""

new_node_js = """        const el = document.createElement('div');
        el.id = `node-${n.id}`;
        el.className = `absolute w-32 md:w-36 bg-white dark:bg-slate-800 rounded-xl p-3 border-2 border-slate-300 dark:border-slate-600 shadow-lg flex flex-col items-center cursor-pointer transition-all duration-300 z-10 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] group`;
        el.style.left = n.x + 'px';
        el.style.top = n.y + 'px';
        el.style.transform = 'translate(-50%, -50%)';
        el.onclick = () => selectNode(n.id);
        
        if (currentView === 'overlay' && n.zone === 'mpls') el.classList.add('opacity-20');
        
        let badgeColor = "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200 dark:border-blue-700";
        if (n.zone === 'mpls') badgeColor = "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600";
        if (n.zone === 'cloud') badgeColor = "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 border-purple-200 dark:border-purple-700";
        
        let primarySpec = Object.values(n.specs)[0];

        el.innerHTML = `
          <div class="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[9px] font-bold border whitespace-nowrap ${badgeColor}">${n.role}</div>
          <div class="w-10 h-10 mb-2 bg-gradient-to-b from-slate-50 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-full flex items-center justify-center border border-slate-300 dark:border-slate-600 shadow-inner group-hover:border-blue-400 transition-colors">
              <i class="fa-solid ${n.icon} text-lg text-slate-600 dark:text-slate-300 group-hover:text-blue-500"></i>
          </div>
          <h3 class="text-xs font-extrabold text-slate-800 dark:text-white text-center">${n.name}</h3>
          <div class="text-[9px] font-mono text-slate-500 mt-1 text-center truncate w-full">${primarySpec}</div>
        `;
        nodesLayer.appendChild(el);"""

content = re.sub(old_node_js, new_node_js, content)

with open('projects/topology-design/evpn-vxlan-mpls-transit.html', 'w') as f:
    f.write(content)
