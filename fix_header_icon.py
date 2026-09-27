import re

with open('projects/topology-design/evpn-vxlan-mpls-transit.html', 'r') as f:
    content = f.read()

old_str = '<a href="../../index.html" class="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all-fast shrink-0" title="Về trang chủ Portfolio">\n                  <i class="fas fa-home text-sm"></i>'
new_str = '<a href="../../index.html" class="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-700 flex items-center justify-center text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all-fast shrink-0" title="Về trang chủ Portfolio">\n                  <i class="fa-solid fa-diagram-project"></i>'

content = content.replace(old_str, new_str)

with open('projects/topology-design/evpn-vxlan-mpls-transit.html', 'w') as f:
    f.write(content)
