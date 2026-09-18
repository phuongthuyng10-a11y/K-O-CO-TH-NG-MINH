# 🏆 Kéo Co Tri Thức (Tug of War Quiz Game)

Trò chơi đối kháng kéo co kết hợp hỏi đáp đố vui trí tuệ với đồ họa hoạt hình sinh động, hiệu ứng âm thanh sống động và mô phỏng vật lý chân thực.

---

## 🌟 Tính Năng Nổi Bật

- 🤖 **Chơi Với Máy (AI) & 2 Người (PvP):** Đấu trí với máy tính qua 3 cấp độ (Dễ 50%, Vừa 75%, Khó 90%) hoặc thi đấu 2 người trên cùng màn hình.
- ⚡ **2 Thể Thức Thi Đấu:**
  - **Đấu Luân Phiên (Lần lượt):** Từng đội trả lời theo lượt với giới hạn 10 giây. Nếu không trả lời kịp hoặc sai, quyền trả lời sẽ chuyển qua đối phương cướp điểm!
  - **Đấu Song Song (Cùng lúc):** 2 bên cùng giải đố đồng thời trên 2 cột độc lập.
- 📝 **Quản Lý Câu Hỏi:** Tích hợp đầy đủ chức năng Thêm mới, Chỉnh sửa, Xóa câu hỏi và tự động đồng bộ vào `localStorage`.
- 🎪 **Sân Đấu Kéo Co 3D/2D Sống Động:** Dây thừng co giãn, nhân vật gồng mình kéo dây, bụi đất tung bay, cờ trung tâm di chuyển mượt mà.
- 🔊 **Âm Thanh & Pháo Hoa Chúc Mừng:** Hệ thống âm thanh Web Audio API tích tắc, tiếng còi, reo hò chiến thắng và pháo hoa rực rỡ.

---

## 🚀 Hướng Dẫn Deploy Lên GitHub Pages (3 Cách Cực Dễ)

Dự án đã được cấu hình đường dẫn tương đối (`base: './'`), sẵn sàng 100% để deploy lên GitHub Pages!

### Cách 1: Sử dụng thư mục `/docs` có sẵn (Đơn giản nhất, không cần cài đặt)
Thư mục `docs/` đã được build sẵn bao gồm đầy đủ `index.html`, file `.js` và `.css`:
1. Đẩy mã nguồn dự án lên GitHub repository của bạn (`git push origin main`).
2. Trên trang repository của bạn tại GitHub, vào **Settings** > **Pages** (ở thanh menu bên trái).
3. Tại mục **Build and deployment**:
   - **Source**: Chọn `Deploy from a branch`.
   - **Branch**: Chọn `main` (hoặc `master`), và thư mục chọn `/docs`.
   - Bấm **Save**.
4. Chờ 1 - 2 phút, GitHub Pages sẽ cấp cho bạn đường link chơi game trực tiếp (dạng `https://<tên-tài-khoản>.github.io/<tên-repo>/`).

---

### Cách 2: Tự động deploy bằng GitHub Actions (Đã có sẵn file cấu hình)
Dự án đã tạo sẵn file workflow `.github/workflows/deploy.yml`:
1. Đẩy mã nguồn lên GitHub repository của bạn.
2. Vào **Settings** > **Pages** trên GitHub.
3. Tại mục **Source**, chọn **GitHub Actions**.
4. GitHub sẽ tự động build và deploy trang web mỗi khi bạn push code mới!

---

### Cách 3: Chạy local hoặc tự build lại
```bash
# Cài đặt thư viện
npm install

# Chạy thử trên máy tính cá nhân
npm run dev

# Build ra file HTML, JS, CSS tĩnh (sẽ tự động cập nhật vào dist/ và docs/)
npm run build
```
Thư mục `dist/` hoặc `docs/` sau khi build có thể tải lên bất kỳ hosting tĩnh nào như GitHub Pages, Vercel, Netlify, Cloudflare Pages,...

---

## 📁 Cấu Trúc Mã Nguồn

```
├── docs/                 # Thư mục chứa HTML, JS, CSS tĩnh đã build (Dùng cho GitHub Pages)
│   ├── index.html        # File HTML chính
│   └── assets/           # File Javascript và CSS đã biên dịch
├── src/                  # Mã nguồn TypeScript & React
│   ├── components/       # Các component giao diện (Sân đấu, Câu hỏi, Cài đặt,...)
│   ├── data/             # Ngân hàng 60+ câu hỏi đa dạng
│   ├── utils/            # Tiện ích âm thanh (Web Audio API)
│   ├── types.ts          # Định nghĩa kiểu dữ liệu TypeScript
│   ├── App.tsx           # Logic trò chơi trung tâm
│   └── index.css         # Styling Tailwind CSS
├── .github/workflows/    # Workflow tự động deploy GitHub Actions
├── index.html            # Entry point phát triển
├── vite.config.ts        # Cấu hình Vite (đã bật base: './')
└── package.json          # Quản lý dependencies & scripts
```
