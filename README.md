# Phòng Thi Trực Tuyến - THPT Hòn Đất (V11.2)

Hệ thống thi trắc nghiệm trực tuyến chính thức của Trường THPT Hòn Đất (An Giang) - Tác giả: **Lê Bá Nhẫn**.

---

## 🔗 Liên kết hệ thống

- **Mã nguồn GitHub**: [https://github.com/lebanhan113-dotcom/247nhanlbonline](https://github.com/lebanhan113-dotcom/247nhanlbonline)
- **Triển khai Vercel**: [https://vercel.com/le-nhan/247nhanlbonline](https://vercel.com/le-nhan/247nhanlbonline) (Web: [https://247nhanlbonline.vercel.app](https://247nhanlbonline.vercel.app))
- **Supabase Cloud Project**: [wzcosdniivggetnkdhmn](https://supabase.com/dashboard/project/wzcosdniivggetnkdhmn)
  - Endpoint: `https://wzcosdniivggetnkdhmn.supabase.co`

---

## 🚀 Tính năng nổi bật

1. **Chuẩn cấu trúc đề thi 3 phần theo quy định mới**:
   - **Phần I**: Trắc nghiệm 4 lựa chọn (A, B, C, D) - 0.25đ / câu.
   - **Phần II**: Trắc nghiệm Đúng/Sai (4 ý a, b, c, d) - chấm điểm lũy tiến 0.1đ - 0.25đ - 0.5đ - 1.0đ.
   - **Phần III**: Trắc nghiệm trả lời ngắn (số thực, phân số, số âm).
2. **Nhập đề tự động thông minh**:
   - Nhập file Word (.docx, .doc), PDF và Text thuần túy.
   - Hỗ trợ công thức toán học LaTeX / MathJax ($...$).
   - Sửa lỗi font chữ tự động (Unicode, VNI-Windows, TCVN3 / ABC).
   - Tự động nhận diện bảng đáp án dạng chuẩn hoặc in đậm/gạch chân.
3. **Quản lý đề thi & Giáo viên**:
   - Đăng nhập bảo mật với mật khẩu mặc định `123123`.
   - Phân quyền xóa đề thi và chỉnh sửa thông tin đề thi (thời gian làm bài, lớp, môn học, ngày thi, tiêu đề).
   - Kiểm soát phát hành đề theo mã hoặc mở công khai.
4. **Đồng bộ hóa đám mây Supabase**:
   - Tích hợp 1 chạm đồng bộ toàn bộ đề thi và kết quả làm bài lên Supabase Cloud (`wzcosdniivggetnkdhmn`).
   - Hỗ trợ kiểm tra độ trễ kết nối (Ping) trực tiếp từ giao diện.
   - Tự động lưu offline (LocalStorage fallback) bảo vệ dữ liệu khi mất kết nối.
5. **Giao diện làm bài chuyên nghiệp**:
   - Đếm ngược thời gian thực, cảnh báo sắp hết giờ.
   - Bảng điều hướng câu hỏi trực quan, phân chia rõ ràng 3 phần.
   - Tự động thu bài khi hết giờ và chấm điểm chi tiết tức thì.

---

## 🛠️ Hướng dẫn cài đặt & chạy cục bộ

1. **Cài đặt thư viện**:
   ```bash
   npm install
   ```

2. **Cấu hình môi trường**:
   Sao chép `.env.example` thành `.env.local` và cập nhật thông tin nếu cần:
   ```bash
   cp .env.example .env.local
   ```

3. **Chạy ứng dụng trong môi trường phát triển**:
   ```bash
   npm run dev
   ```

4. **Đóng gói dự án (Production Build)**:
   ```bash
   npm run build
   ```
