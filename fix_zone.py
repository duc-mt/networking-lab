import re

with open('projects/topology-design/evpn-vxlan-mpls-transit.html', 'r') as f:
    content = f.read()

# Change MPLS color to Amber
content = content.replace('color: "#9ca3af", bounds: { left: 340', 'color: "#f59e0b", bounds: { left: 340')

# Update zone generation for background tint and better opacity
old_zone = r"""        const el = document\.createElement\('div'\);\s*el\.className = `absolute border-2 border-dashed rounded-xl pointer-events-none transition-opacity duration-500 opacity-60 dark:opacity-40`;\s*el\.style\.borderColor = z\.color;\s*el\.style\.left = z\.bounds\.left \+ 'px';"""
new_zone = """        const el = document.createElement('div');
        el.className = `absolute border-2 border-dashed rounded-xl pointer-events-none transition-all duration-500 opacity-80 dark:opacity-60`;
        el.style.borderColor = z.color;
        el.style.backgroundColor = z.color + '0D'; // ~5% opacity background tint
        el.style.left = z.bounds.left + 'px';"""
content = re.sub(old_zone, new_zone, content)

with open('projects/topology-design/evpn-vxlan-mpls-transit.html', 'w') as f:
    f.write(content)
