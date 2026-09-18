# 🏆 Kéo Co Tri Thức (Tug of War Quiz Game)

Trò chơi đối kháng kéo co kết hợp hỏi đáp đố vui trí tuệ được xây dựng hoàn toàn bằng **HTML, CSS và JavaScript thuần** (không cần cài đặt môi trường, không phụ thuộc backend), sẵn sàng 100% để deploy trực tiếp lên **GitHub Pages** hoặc mở chạy ngay trên bất kỳ trình duyệt nào.

---

## 🌟 Tính Năng Nổi Bật

- 🤖 **Chơi Với Máy (AI) & 2 Người (PvP):** Đấu trí với máy tính qua 3 cấp độ (Dễ 50%, Vừa 75%, Khó 90%) hoặc thi đấu 2 người trên cùng màn hình.
- ⚡ **2 Thể Thức Thi Đấu:**
  - **Đấu Luân Phiên (Lần lượt):** Từng đội trả lời theo lượt với giới hạn 10 giây. Nếu không trả lời kịp hoặc sai, quyền trả lời sẽ chuyển qua đối phương cướp điểm!
  - **Đấu Song Song (Cùng lúc):** 2 bên cùng giải đố đồng thời trên 2 cột độc lập (hỗ trợ phím tắt A-S-D-F và J-K-L-;).
- 📝 **Quản Lý Câu Hỏi (CRUD):** Tích hợp đầy đủ chức năng Thêm mới, Chỉnh sửa, Xóa câu hỏi và tự động lưu vào `localStorage`. Sẵn có hơn 60 câu hỏi phong phú.
- 🎪 **Sân Đấu Kéo Co Trực Quan:** Dây thừng co giãn, nhân vật hoạt hình gồng mình kéo dây, vạch mốc -5 đến +5, cờ đỏ trung tâm di chuyển mượt mà.
- 🔊 **Âm Thanh & Pháo Hoa:** Hệ thống âm thanh Web Audio API tích tắc đếm ngược, tiếng còi trọng tài, tiếng căng dây thừng, reo hò chiến thắng và pháo hoa rực rỡ.

---

## 🚀 Hướng Dẫn Deploy Lên GitHub Pages (Cực Kỳ Đơn Giản)

### Cách 1: Deploy trực tiếp từ nhánh `main` (Không cần cài đặt gì)
Dự án bao gồm các file tĩnh `index.html`, `style.css`, `script.js`, `questions.js` ngay tại thư mục gốc và thư mục `docs/`:
1. Đẩy toàn bộ mã nguồn lên GitHub repository của bạn (`git push origin main`).
2. Vào **Settings** > **Pages** trên repository GitHub của bạn.
3. Tại phần **Branch**:
   - Bạn có thể chọn nhánh `main` với thư mục `/ (root)` HOẶC chọn thư mục `/docs`.
   - Bấm **Save**.
4. Chờ 1 - 2 phút, GitHub Pages sẽ tạo đường link công khai: `https://<tên-user>.github.io/<tên-repo>/`.

---

### Cách 2: Tự động deploy bằng GitHub Actions
Dự án đã có sẵn file workflow tại `.github/workflows/deploy.yml`:
1. Vào **Settings** > **Pages** trên GitHub.
2. Tại mục **Build and deployment > Source**, chọn **GitHub Actions**.
3. Mỗi khi bạn đẩy code mới lên nhánh `main`, GitHub sẽ tự động build và xuất bản trang web.

---

### Cách 3: Mở trực tiếp trên máy tính cá nhân
Chỉ cần nhấp đúp vào file `index.html` trong máy tính của bạn là có thể chơi ngay lập tức mà không cần cài đặt Node.js hay máy chủ web.

---

## 📁 Cấu Trúc File Dự Án

```
├── index.html            # Giao diện chính của trò chơi (HTML5 chuẩn)
├── style.css             # Toàn bộ hiệu ứng hình ảnh, sân kéo co & hoạt ảnh (CSS)
├── script.js             # Logic trò chơi, tính điểm, đồng hồ 10s & AI bot (JS)
├── questions.js          # Ngân hàng 60+ câu hỏi đa lĩnh vực & xáo trộn đáp án (JS)
├── docs/                 # Bản build tĩnh sẵn sàng cho GitHub Pages (/docs)
├── .github/workflows/    # Quy trình tự động deploy GitHub Actions
└── README.md             # Tài liệu hướng dẫn sử dụng và triển khai
```
