import re

with open('projects/topology-design/evpn-vxlan-mpls-transit.html', 'r') as f:
    content = f.read()

old_header = r"""        <h1 class="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-3">
          WAN & Multi-Cloud Transit
          <span class="px-2 py-0.5 rounded text-\[10px\] font-bold tracking-wider bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30">EVPN-VXLAN STRETCHED L2</span>
          <span class="px-2 py-0.5 rounded text-\[10px\] font-bold tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">MPLS UNDERLAY</span>
        </h1>"""

new_header = """        <h1 class="text-xl font-bold text-slate-900 dark:text-white leading-tight">
          EVPN-VXLAN over MPLS Transit
        </h1>"""

content = re.sub(old_header, new_header, content)

with open('projects/topology-design/evpn-vxlan-mpls-transit.html', 'w') as f:
    f.write(content)
