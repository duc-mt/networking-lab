import re

with open('projects/troubleshooting/vxlan-mtu-blackhole.html', 'r') as f:
    content = f.read()

# Fix the heights and top offsets of the zones
old_zones = """                <!-- Zones -->
                <div class="absolute border-2 border-dashed rounded-xl pointer-events-none opacity-80 z-0 border-blue-500 bg-blue-500/5" style="left: 4%; top: 6%; width: 22%; height: 85%;">
                    <div class="absolute top-4 left-5 font-black text-xs tracking-widest opacity-80 uppercase text-blue-500">ON-PREMISES</div>
                </div>
                <div class="absolute border-2 border-dashed rounded-xl pointer-events-none opacity-80 z-0 border-amber-500 bg-amber-500/5" style="left: 28%; top: 6%; width: 44%; height: 85%;">
                    <div class="absolute top-4 left-5 font-black text-xs tracking-widest opacity-80 uppercase text-amber-500">MPLS TRANSIT (WAN)</div>
                </div>
                <div class="absolute border-2 border-dashed rounded-xl pointer-events-none opacity-80 z-0 border-purple-500 bg-purple-500/5" style="left: 74%; top: 6%; width: 22%; height: 85%;">
                    <div class="absolute top-4 left-5 font-black text-xs tracking-widest opacity-80 uppercase text-purple-500">CLOUD REGION</div>
                </div>"""

new_zones = """                <!-- Zones -->
                <div class="absolute border-2 border-dashed rounded-xl pointer-events-none opacity-80 z-0 border-blue-500 bg-blue-500/5" style="left: 4%; top: 4%; width: 22%; height: 92%;">
                    <div class="absolute top-4 left-5 font-black text-xs tracking-widest opacity-80 uppercase text-blue-500">ON-PREMISES</div>
                </div>
                <div class="absolute border-2 border-dashed rounded-xl pointer-events-none opacity-80 z-0 border-amber-500 bg-amber-500/5" style="left: 28%; top: 4%; width: 44%; height: 92%;">
                    <div class="absolute top-4 left-5 font-black text-xs tracking-widest opacity-80 uppercase text-amber-500">MPLS TRANSIT (WAN)</div>
                </div>
                <div class="absolute border-2 border-dashed rounded-xl pointer-events-none opacity-80 z-0 border-purple-500 bg-purple-500/5" style="left: 74%; top: 4%; width: 22%; height: 92%;">
                    <div class="absolute top-4 left-5 font-black text-xs tracking-widest opacity-80 uppercase text-purple-500">CLOUD REGION</div>
                </div>"""

content = content.replace(old_zones, new_zones)

with open('projects/troubleshooting/vxlan-mtu-blackhole.html', 'w') as f:
    f.write(content)
