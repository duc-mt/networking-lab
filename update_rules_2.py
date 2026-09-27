import re

with open('docs/prompt-templates.md', 'r') as f:
    content = f.read()

old_rule = "VD: `let t_src = Math.min(0.4, 85 / distance);`"
new_rule = "VD: `let t_src = Math.min(0.4, 85 / distance);`. Đồng thời, CẤM ghim nhãn nằm chết tại tâm đường link, phải tính vector pháp tuyến (Normal Vector) và tịnh tiến (Shift) nhãn sang hai bên đường link khoảng `18px` để né xung đột (Anchor Collision) với các nhãn khác ở Top/Bottom của thiết bị."

content = content.replace(old_rule, new_rule)

with open('docs/prompt-templates.md', 'w') as f:
    f.write(content)
