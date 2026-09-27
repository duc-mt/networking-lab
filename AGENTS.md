---
name: design-system-rules
description: Quy định bắt buộc về UI/UX và phong cách thiết kế cho dự án networking-lab.
trigger: always_on
---

# Bắt buộc tuân thủ Design System (UI/UX)
Mỗi khi khởi tạo, chỉnh sửa HTML/CSS hoặc các thành phần giao diện trong dự án này, AI LUÔN LUÔN phải tuân thủ nghiêm ngặt các quy định sau để giữ phong cách hiện đại, tinh tế và đồng nhất trên toàn dự án:

## 1. Không gian màu (Color Palette)
- **Không dùng màu trắng/đen thuần:** Tuyệt đối không dùng `#ffffff` hay `#000000`. Bắt buộc dùng hệ màu trung tính `Slate` của Tailwind.
- **Nền (Background):** Light mode luôn dùng `bg-slate-50`. Dark mode luôn dùng `bg-slate-950`.
- **Thẻ (Cards/Surfaces):** Trên Dark mode, thẻ phải dùng `bg-slate-900` kết hợp viền mỏng `border-slate-800` để tạo chiều sâu.
- **Điểm nhấn (Accents):** Thay vì tô màu phẳng (flat color) gắt, hãy dùng gradient tinh tế (VD: `bg-gradient-to-br from-blue-500 to-indigo-600`) cho logo, icon hoặc nút bấm chính.

## 2. Typography (Nghệ thuật Kiểu chữ)
- **Văn bản/UI chính:** Bắt buộc dùng font sans-serif `Inter`. Linh hoạt độ nặng: `font-extrabold` cho tiêu đề chính, `font-medium` cho văn bản phụ.
- **Code/Technical/Tags:** Bắt buộc dùng font Monospace `Fira Code` cho các nhãn trạng thái, huy hiệu, thông số kỹ thuật.
- **Khoảng cách (Tracking):** Tiêu đề lớn phải ép hẹp khoảng cách (`tracking-tight`). Nhãn phụ/nhãn nhỏ phải in hoa và kéo giãn khoảng cách (`uppercase tracking-widest text-xs`).

## 3. Hiệu ứng, Bố cục & Khoảng trắng
- **Header:** Luôn sử dụng hiệu ứng Glassmorphism (`backdrop-blur-md bg-white/80 dark:bg-slate-900/80`).
- **Khoảng trắng (Whitespace):** Cố ý giữ padding và margin lớn (VD: `gap-20`, `py-24`) giữa các khối nội dung. Không nhồi nhét thành phần UI.
- **Tương tác (Micro-interactions):** Sử dụng class `.transition-all-fast` của dự án. Hover lên thẻ phải nảy nhẹ (`hover:-translate-y-1 hover:shadow-lg`), không đổi màu quá đột ngột.
