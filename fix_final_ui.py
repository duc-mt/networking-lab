import re

with open('projects/topology-design/evpn-vxlan-mpls-transit.html', 'r') as f:
    content = f.read()

# 1. Fix Topology Alignment (w-full -> max-w-[1000px] mx-auto)
content = content.replace(
    'id="topology-container" class="relative bg-slate-50 dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner overflow-hidden w-full h-[500px] my-6"',
    'id="topology-container" class="relative bg-slate-50 dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner overflow-hidden w-full max-w-[1000px] mx-auto h-[500px] my-6"'
)

# 2. Fix Initial Flow View Badge Contrast
content = content.replace(
    'class="ml-auto px-2 py-0.5 rounded text-xs font-medium bg-blue-900/50 text-blue-400 border border-blue-800/50">UNDERLAY MODE</span>',
    'class="ml-auto px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50">UNDERLAY MODE</span>'
)

# 3. Fix switchView Badges & Button text-color (should be text-white on colored background!)
content = content.replace(
    'btnU.className = "px-4 py-1.5 rounded-md text-sm font-medium bg-blue-600 text-slate-900 dark:text-white transition-colors shadow";',
    'btnU.className = "px-4 py-1.5 rounded-md text-sm font-medium bg-blue-600 text-white transition-colors shadow";'
)
content = content.replace(
    'btnO.className = "px-4 py-1.5 rounded-md text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors";',
    'btnO.className = "px-4 py-1.5 rounded-md text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors";'
)
content = content.replace(
    'badge.className = "ml-auto px-2 py-0.5 rounded text-xs font-bold bg-blue-900/50 text-blue-400 border border-blue-800/50";',
    'badge.className = "ml-auto px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50";'
)

content = content.replace(
    'btnO.className = "px-4 py-1.5 rounded-md text-sm font-medium bg-purple-600 text-slate-900 dark:text-white transition-colors shadow";',
    'btnO.className = "px-4 py-1.5 rounded-md text-sm font-medium bg-purple-600 text-white transition-colors shadow";'
)
content = content.replace(
    'btnU.className = "px-4 py-1.5 rounded-md text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors";',
    'btnU.className = "px-4 py-1.5 rounded-md text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors";'
)
content = content.replace(
    'badge.className = "ml-auto px-2 py-0.5 rounded text-xs font-bold bg-purple-900/50 text-purple-400 border border-purple-800/50";',
    'badge.className = "ml-auto px-2 py-0.5 rounded text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50";'
)

# 4. Fix selectNode Badge Contrast
content = content.replace(
    'badge.className = "ml-auto px-2 py-0.5 rounded text-xs font-bold bg-emerald-900/50 text-emerald-400 border border-emerald-800/50";',
    'badge.className = "ml-auto px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50";'
)

# 5. Fix Trace Flow hop action badge contrast
content = content.replace(
    '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-slate-600 dark:text-slate-300 ml-auto">${step.action.toUpperCase()}</span>',
    '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300 ml-auto border border-slate-300 dark:border-slate-600">${step.action.toUpperCase()}</span>'
)

# 6. Fix Trace Flow button text color (bg-emerald-600)
content = content.replace(
    '<button onclick="traceFlow()" class="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-900 dark:text-white text-sm font-medium transition-colors shadow">',
    '<button onclick="traceFlow()" class="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors shadow">'
)

# 7. Initial Buttons Text color (bg-blue-600)
content = content.replace(
    '<button id="btn-view-underlay" class="px-4 py-1.5 rounded-md text-sm font-medium bg-blue-600 text-slate-900 dark:text-white transition-colors shadow" onclick="switchView(\'underlay\')">',
    '<button id="btn-view-underlay" class="px-4 py-1.5 rounded-md text-sm font-medium bg-blue-600 text-white transition-colors shadow" onclick="switchView(\'underlay\')">'
)

with open('projects/topology-design/evpn-vxlan-mpls-transit.html', 'w') as f:
    f.write(content)
