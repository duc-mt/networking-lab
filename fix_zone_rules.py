import re

with open('docs/prompt-templates.md', 'r') as f:
    content = f.read()

old_rule = "### 3. Zone Bounding Boxes (Khung Phân Vùng)"
new_rule = """### 3. Zone Bounding Boxes (Khung Phân Vùng)
- **Bounding Box Sizing (Chiều cao an toàn):** Phải đảm bảo chiều cao của khung phân vùng (VD: `height: 92%`) đủ lớn để ôm trọn toàn bộ các thiết bị (nodes) bên trong, không được cắt ngang qua bất kỳ thiết bị nào (nhất là thiết bị nằm ở dưới cùng).
- **Z-index:** Bounding box bắt buộc phải nằm dưới cùng (`z-0`), còn các Nodes thiết bị phải nổi lên trên (`z-10` hoặc `z-20`)."""

content = content.replace(old_rule, new_rule)

with open('docs/prompt-templates.md', 'w') as f:
    f.write(content)
