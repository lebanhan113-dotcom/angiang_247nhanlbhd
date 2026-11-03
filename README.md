# PHÒNG THI TRỰC TUYẾN - TRƯỜNG THPT HÒN ĐẤT

Tác giả giải pháp: **Giáo viên Lê Bá Nhẫn – Trường THPT Hòn Đất (Tỉnh An Giang)**.

## Đưa lên GitHub Pages

1. Tạo repository GitHub (ví dụ `phong-thi-hoa10`) và tải toàn bộ nội dung ZIP này vào thư mục gốc.
2. Vào **Settings → Pages → Build and deployment → Source**, chọn **GitHub Actions** để workflow `.github/workflows/pages.yml` triển khai tự động khi cập nhật nhánh `main`.
3. Vào **Actions** để kiểm tra workflow hoàn thành và lấy URL, ví dụ `https://TEN_TAI_KHOAN.github.io/phong-thi-hoa10/`.
4. Khi lần đầu mở web, mặc định đề **CHƯA DUYỆT**. Giáo viên đăng nhập, cài thông tin kỳ thi, kiểm tra tất cả câu, duyệt đề; sau đó vào **Triển khai & đồng bộ** → **TẢI index.html ĐÃ DUYỆT**.
5. Tải file index.html vừa xuất lên repository, **ghi đè index.html gốc**, commit vào `main`. Chờ GitHub Actions báo triển khai thành công, rồi mở trang trong cửa sổ ẩn danh để kiểm tra phòng thi đã mở.
6. Muốn đóng phòng, xuất `index.html ĐÓNG PHÒNG` và commit thay file trên GitHub.

## Giới hạn quan trọng

- GitHub Pages chỉ chạy website tĩnh. Passcode giáo viên và trạng thái duyệt trong HTML là **bảo vệ giao diện để thử nghiệm**, không phải bảo mật thực sự.
- Đáp án hiện có trong bộ dữ liệu ở phía trình duyệt; người có kiến thức kỹ thuật có thể đọc mã nguồn.
- Kết quả/đáp án học sinh vẫn lưu trong **localStorage trên từng máy**, chưa thể đồng bộ lên giáo viên hoặc quản lý nhiều thiết bị.
- Việc commit vào GitHub giúp **tự động triển khai trang GitHub Pages**, không tự push từ HTML, không đồng bộ Supabase, không tự Publish lên `*.ai.studio`.
- Để thi chính thức cần backend, xác thực giáo viên, RLS/kiểm soát quyền, giám sát nộp bài theo giờ máy chủ và cơ sở dữ liệu trung tâm.

## Google AI Studio

Trong **Build**, dùng **Import from GitHub** cho repo này, kiểm tra nội dung, chọn **Publish**, thiết lập Custom URL `*.ai.studio` nếu được cấp và kiểm tra địa chỉ thật sau khi publish. Đây là thao tác tách biệt với deploy GitHub Pages.

## Kiểm tra nguồn

Đề: 21 câu thật từ Word gốc, 3 phần, 4 đáp án ghi rõ bằng chữ, 17 câu cần giáo viên xác nhận đáp án. Hai câu học thuật cần kiểm tra: Phần I câu 12 và Phần II câu 2. Không tự chia điểm hoặc tự bịa đáp án.
