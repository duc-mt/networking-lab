import re

with open('assets/js/projects.js', 'r') as f:
    content = f.read()

new_project = """    {
        id: 'vxlan-mtu-blackhole',
        title: 'EVPN-VXLAN MTU Blackhole',
        category: 'troubleshooting',
        type: 'troubleshooting',
        status: 'live',
        dateAdded: '2026-09-27',
        image: 'assets/images/protocol-placeholder.jpg',
        description:
            'Chẩn đoán sự cố mạng: Ping thông suốt qua đường hầm VXLAN Stretched L2 trên nền MPLS, nhưng TCP (truyền tải file) bị rớt hoàn toàn do lỗi Overhead MTU.',
        tags: ['EVPN', 'VXLAN', 'MPLS', 'MTU', 'Troubleshooting', 'Jumbo Frames'],
        href: 'projects/troubleshooting/vxlan-mtu-blackhole.html',
    },
"""

# Insert right after `const PROJECTS = [`
content = re.sub(r'(const PROJECTS = \[)', r'\1\n' + new_project, content)

with open('assets/js/projects.js', 'w') as f:
    f.write(content)
