import glob
import re

files = glob.glob('./projects/**/*.html', recursive=True)
for f in files:
    with open(f, 'r') as file:
        content = file.read()
        if 'id="topology-' not in content:
            continue
        
        # Look for the lines just before the topology-canvas/container
        lines = content.split('\n')
        for i, line in enumerate(lines):
            if 'id="topology-canvas"' in line or 'id="topology-container"' in line:
                print(f"File: {f}")
                start = max(0, i - 2)
                for j in range(start, i+1):
                    print(lines[j])
                print("-" * 50)
                break
