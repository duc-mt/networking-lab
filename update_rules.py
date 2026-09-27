import re

with open('docs/prompt-templates.md', 'r') as f:
    content = f.read()

old_rule = "- **Port Labels (Nhãn Cổng Vật Lý/Logic):** Bất kỳ thông số cổng nào (như `Gi1/0/24`, `eth0`, `Tunnel0`) **PHẢI** được gắn chặt vào 2 đầu của sợi cáp (vị trí 15-20% và 80-85% trên chiều dài SVG link) dưới dạng HTML Badge. Không được thả lơ lửng ở giữa link."
new_rule = "- **Port Labels (Nhãn Cổng Vật Lý/Logic):** Bất kỳ thông số cổng nào (như `Gi1/0/24`, `eth0`, `Tunnel0`) **PHẢI** được gắn chặt vào 2 đầu của sợi cáp dưới dạng HTML Badge. **CẤM DÙNG tỷ lệ phần trăm cố định (VD: 20%)** vì nó sẽ lọt vào trong Node nếu Node nằm gần nhau. Bắt buộc dùng công thức toán học nội suy để đẩy Badge ra cách tâm Node một khoảng Pixel tuyệt đối (Khoảng `85px`) để nó nằm hoàn toàn trên cáp. VD: `let t_src = Math.min(0.4, 85 / distance);`"

content = content.replace(old_rule, new_rule)

with open('docs/prompt-templates.md', 'w') as f:
    f.write(content)
