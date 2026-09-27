import re

with open('projects/topology-design/evpn-vxlan-mpls-transit.html', 'r') as f:
    content = f.read()

# Fix microchip icon
content = content.replace(
    '<i class="fa-solid fa-microchip text-slate-500 dark:text-slate-400"></i>',
    '<i class="fa-solid fa-microchip text-indigo-500 dark:text-indigo-400"></i>'
)

# Fix list-ol icon
content = content.replace(
    '<i class="fa-solid fa-list-ol text-slate-500 dark:text-slate-400"></i>',
    '<i class="fa-solid fa-list-ol text-emerald-500 dark:text-emerald-400"></i>'
)

# Fix "NO DEVICE SELECTED" badge
content = content.replace(
    '<span id="inspector-badge" class="ml-auto px-2 py-0.5 rounded text-xs font-medium bg-slate-700 text-slate-600 dark:text-slate-300">NO DEVICE SELECTED</span>',
    '<span id="inspector-badge" class="ml-auto px-2 py-0.5 rounded text-xs font-medium bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400">NO DEVICE SELECTED</span>'
)

with open('projects/topology-design/evpn-vxlan-mpls-transit.html', 'w') as f:
    f.write(content)
