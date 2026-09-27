import re

with open('projects/topology-design/evpn-vxlan-mpls-transit.html', 'r') as f:
    content = f.read()

# 1. Header Badges
content = content.replace(
    'class="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-purple-500/20 text-purple-400 border border-purple-500/30"',
    'class="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30"'
)

content = content.replace(
    'class="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"',
    'class="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30"'
)

# 2. Warning Box
old_warning = """    <!-- Design Note Callout -->
    <div class="bg-amber-950/30 border border-amber-900/50 rounded-xl p-4 flex gap-4 items-start">
      <i class="fa-solid fa-triangle-exclamation text-amber-500 mt-1 text-xl shrink-0"></i>
      <div>
        <h4 class="text-amber-400 font-semibold mb-1">Crucial Design Note: MTU & Overhead Warning</h4>
        <p class="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">"""

new_warning = """    <!-- Design Note Callout -->
    <div class="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4 flex gap-4 items-start shadow-sm">
      <i class="fa-solid fa-triangle-exclamation text-amber-600 dark:text-amber-500 mt-1 text-xl shrink-0"></i>
      <div>
        <h4 class="text-amber-800 dark:text-amber-400 font-bold mb-1">Crucial Design Note: MTU & Overhead Warning</h4>
        <p class="text-amber-900/80 dark:text-slate-300 text-sm leading-relaxed">"""

content = content.replace(old_warning, new_warning)

with open('projects/topology-design/evpn-vxlan-mpls-transit.html', 'w') as f:
    f.write(content)
