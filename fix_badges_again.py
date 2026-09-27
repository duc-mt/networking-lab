import re

with open('projects/topology-design/evpn-vxlan-mpls-transit.html', 'r') as f:
    content = f.read()

old_str = """        let badgeStyle = "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700";
        if (l.type === 'overlay') badgeStyle = "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300 border-purple-200 dark:border-purple-700";
        if (l.type === 'trunk') badgeStyle = "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700";"""

new_str = """        let badgeStyle = "bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 border-blue-200 dark:border-blue-800"; // default routed
        if (l.type === 'overlay') badgeStyle = "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300 border-purple-200 dark:border-purple-700";
        if (l.type === 'trunk') badgeStyle = "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700";
        if (l.type === 'mpls') badgeStyle = "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300 border-amber-200 dark:border-amber-700";"""

content = content.replace(old_str, new_str)

with open('projects/topology-design/evpn-vxlan-mpls-transit.html', 'w') as f:
    f.write(content)
