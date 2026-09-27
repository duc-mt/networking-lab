import re
import glob
import os

files = glob.glob('./projects/**/*.html', recursive=True)

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Find the topology tag
    pattern = r'(<(?:section|div)[^>]*?id="topology-(?:canvas|container)"[^>]*?>)'
    match = re.search(pattern, content)
    if not match:
        return False
        
    tag = match.group(1)
    
    # Check if already wrapped
    # Simple heuristic: is there a div with overflow-x-auto right before it?
    before = content[:match.start()]
    if 'overflow-x-auto' in before[-150:]:
        print(f"Skipping {filepath} (Already wrapped)")
        return False

    # 1. Modify the tag to include style="min-width: 900px;" if not present
    new_tag = tag
    if 'style="' in new_tag:
        if 'min-width' not in new_tag:
            new_tag = re.sub(r'style="([^"]*)"', r'style="\1; min-width: 900px;"', new_tag)
    else:
        new_tag = new_tag.replace('class="', 'style="min-width: 900px;" class="')
    
    # 2. Add wrapper
    wrapper_start = '<!-- Golden Standard Wrapper -->\n            <div class="w-full overflow-x-auto">\n                '
    wrapper_end = '\n            </div>'
    
    # We need to find where the closing tag is to insert wrapper_end
    # Since it's HTML, we'll try to find the matching closing tag.
    tag_name = "section" if "<section" in tag else "div"
    
    # Regex to find the first closing tag after our start tag.
    # This might be tricky if there are nested tags of the same type.
    # But for these canvases, let's look for the matching closing tag.
    # A simple parser:
    rest = content[match.end():]
    depth = 1
    pos = 0
    while depth > 0 and pos < len(rest):
        next_open = rest.find(f'<{tag_name}', pos)
        next_close = rest.find(f'</{tag_name}>', pos)
        
        if next_close == -1:
            break
            
        if next_open != -1 and next_open < next_close:
            depth += 1
            pos = next_open + 1
        else:
            depth -= 1
            pos = next_close + len(f'</{tag_name}>')

    if depth != 0:
        print(f"Failed to find closing tag for {filepath}")
        return False
        
    closing_pos = match.end() + pos
    
    new_content = content[:match.start()] + wrapper_start + new_tag + content[match.end():closing_pos] + wrapper_end + content[closing_pos:]
    
    with open(filepath, 'w') as f:
        f.write(new_content)
        
    print(f"Successfully updated {filepath}")
    return True

for f in files:
    process_file(f)
