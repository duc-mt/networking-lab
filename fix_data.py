import re

with open('projects/topology-design/evpn-vxlan-mpls-transit.html', 'r') as f:
    content = f.read()

old_links = r"""      links: \[
        \{ id: "l1", src: "host-a", dst: "vtep-onprem", type: "trunk", label: "VLAN 100", srcPort: "eth0", dstPort: "Gi1/0/1" \},
        \{ id: "l2", src: "vtep-onprem", dst: "pe-onprem", type: "routed", label: "Underlay IPv4", srcPort: "Gi1/0/48", dstPort: "Gi0/0/1" \},
        \{ id: "l3", src: "pe-onprem", dst: "pe-cloud", type: "mpls", label: "MPLS L3VPN, VRF CORP", curve: 100, srcPort: "Te0/0/0", dstPort: "Te0/0/0" \},
        \{ id: "l4", src: "vtep-cloud", dst: "pe-cloud", type: "routed", label: "Underlay IPv4", srcPort: "Gi1/0/48", dstPort: "Gi0/0/1" \},
        \{ id: "l5", src: "host-b", dst: "vtep-cloud", type: "trunk", label: "VLAN 100", srcPort: "eth0", dstPort: "Gi1/0/1" \},
        \{ id: "l6", src: "vtep-onprem", dst: "vtep-cloud", type: "overlay", label: "VXLAN VNI 10100", curve: -120, srcPort: "Tu0", dstPort: "Tu0" \}
      \]"""

new_links = """      links: [
        { id: "l1", from: "host-a", to: "vtep-onprem", type: "trunk", label: "VLAN 100", view: "both", srcPort: "eth0", dstPort: "Gi1/0/1" },
        { id: "l2", from: "vtep-onprem", to: "pe-onprem", type: "routed", label: "Underlay IPv4", view: "underlay", srcPort: "Gi1/0/48", dstPort: "Gi0/0/1" },
        { id: "l3", from: "pe-onprem", to: "pe-cloud", type: "mpls", label: "MPLS L3VPN, VRF CORP", curve: 100, view: "underlay", srcPort: "Te0/0/0", dstPort: "Te0/0/0" },
        { id: "l4", from: "vtep-cloud", to: "pe-cloud", type: "routed", label: "Underlay IPv4", view: "underlay", srcPort: "Gi1/0/48", dstPort: "Gi0/0/1" },
        { id: "l5", from: "host-b", to: "vtep-cloud", type: "trunk", label: "VLAN 100", view: "both", srcPort: "eth0", dstPort: "Gi1/0/1" },
        { id: "l6", from: "vtep-onprem", to: "vtep-cloud", type: "overlay", label: "VXLAN VNI 10100", curve: -120, view: "overlay", srcPort: "Tu0", dstPort: "Tu0" }
      ]"""

content = re.sub(old_links, new_links, content)

# Update zone label text color to be more visible
content = content.replace(
    "className = 'absolute top-6 font-black text-sm tracking-[0.2em] text-slate-300 dark:text-slate-600",
    "className = 'absolute top-6 font-black text-sm tracking-[0.2em] text-slate-400 dark:text-slate-500"
)

with open('projects/topology-design/evpn-vxlan-mpls-transit.html', 'w') as f:
    f.write(content)
