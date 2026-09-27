import re
import glob

files = glob.glob('./projects/**/*.html', recursive=True)
for f in files:
    with open(f, 'r') as file:
        content = file.read()
        match = re.search(r'(<[^>]+id="topology-(container|canvas)"[^>]*>)', content)
        if match:
            print(f"File: {f}")
            print(f"Canvas: {match.group(1)}")
            print("-" * 50)
