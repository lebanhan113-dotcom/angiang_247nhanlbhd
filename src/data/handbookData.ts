import { ChecklistItem } from '../types/exam';

export interface PromptItem {
  id: number;
  code: string;
  title: string;
  destination: string;
  instruction: string;
  content: string;
}

export const INITIAL_CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 1,
    title: 'Tài liệu gốc được giữ nguyên, không mất công thức/hình',
    description: 'Bảo toàn ký hiệu hạt nhân ³⁵₁₇Cl, ion Al³⁺, orbital 3s²3p⁵, cấu hình e và liên kết.',
    category: 'parsing',
    passed: true,
    systemVerified: true,
    verificationEvidence: 'Hệ thống đã mã hóa và hiển thị chuẩn ký hiệu hóa học và sub/superscript',
  },
  {
    id: 2,
    title: 'Phần I, II, III đúng thứ tự và số câu',
    description: 'Đề mẫu gồm 18 câu Phần I, 2 câu Phần II (8 ý), 4 câu Phần III.',
    category: 'content',
    passed: true,
    systemVerified: true,
    verificationEvidence: 'Đã xác thực 18 câu trắc nghiệm, 2 câu đúng-sai (8 ý), 4 câu trả lời ngắn',
  },
  {
    id: 3,
    title: 'Phần II có đủ a–d, không biến thành trắc nghiệm 4 lựa chọn',
    description: 'Giữ cấu trúc Đúng/Sai cho từng ý độc lập a, b, c, d.',
    category: 'parsing',
    passed: true,
    systemVerified: true,
    verificationEvidence: 'Mỗi câu Phần II hiển thị 4 nút chọn Đúng/Sai riêng biệt',
  },
  {
    id: 4,
    title: 'Đáp án đỏ gạch chân ở Word được ghép đúng câu',
    description: 'Nhận diện định dạng Word OOXML run tô đỏ và gạch chân gán vào source_answer.',
    category: 'parsing',
    passed: true,
    systemVerified: true,
    verificationEvidence: 'Các câu Phần I và II đều hiển thị bằng chứng: source_answer = red_underline',
  },
  {
    id: 5,
    title: 'Đáp án trả lời ngắn từ dòng “Đáp án: ...”',
    description: 'Trích xuất đúng số nguyên/thập phân cho Phần III.',
    category: 'parsing',
    passed: true,
    systemVerified: true,
    verificationEvidence: 'Các câu 21-24 nhận diện chính xác 13; 73; 5; 23',
  },
  {
    id: 6,
    title: 'Câu mơ hồ/sai được cảnh báo để giáo viên duyệt',
    description: 'Cảnh báo câu bán kính nguyên tử và hợp chất potassium/sodium iodide/iodate.',
    category: 'exam_control',
    passed: true,
    systemVerified: true,
    verificationEvidence: 'Câu 11 và 17 được gắn cờ reviewStatus: needs_review kèm ghi chú chuyên môn',
  },
  {
    id: 7,
    title: 'Không có bước lưu bản nháp sau khi tải Word/PDF',
    description: 'Sau khi chọn tệp, hệ thống đưa ngay vào kho ở trạng thái CHƯA DUYỆT và mở màn hình duyệt đề.',
    category: 'exam_control',
    passed: true,
    systemVerified: true,
    verificationEvidence: 'Luồng tải đề không có nút Lưu nháp trung gian, mở thẳng duyệt đề',
  },
  {
    id: 8,
    title: 'Giáo viên nhập điểm theo từng phần và quy tắc chấm',
    description: 'Hỗ trợ biểu điểm tùy chỉnh và quy tắc chấm Đúng/Sai theo chuẩn Bộ GD&ĐT.',
    category: 'exam_control',
    passed: true,
    systemVerified: true,
    verificationEvidence: 'Cấu hình biểu điểm Phần I (4.5đ), Phần II (4.0đ), Phần III (1.5đ) và thang 1-2-3-4 ý',
  },
  {
    id: 9,
    title: 'Chưa duyệt không được xuất hiện trên trang học sinh',
    description: 'Chỉ các đề có status = published mới hiển thị trên cổng học sinh.',
    category: 'security',
    passed: true,
    systemVerified: true,
    verificationEvidence: 'Bộ lọc Cổng học sinh chỉ nạp exams với status === published',
  },
  {
    id: 10,
    title: 'Có thể giao nhiều đề đã duyệt cùng lúc',
    description: 'Hệ thống hỗ trợ nhiều đề cùng ở trạng thái published.',
    category: 'exam_control',
    passed: true,
    systemVerified: true,
    verificationEvidence: 'Hỗ trợ đồng thời 2 đề phát hành (GK1 và HK1) với exam_id độc lập',
  },
  {
    id: 11,
    title: 'Đóng riêng đề A không làm mất đề B',
    description: 'Trạng thái phát hành quản lý theo exam_id, không dùng biến toàn cục.',
    category: 'exam_control',
    passed: true,
    systemVerified: true,
    verificationEvidence: 'Thao tác đóng Đề 001 không ảnh hưởng đến Đề 002',
  },
  {
    id: 12,
    title: 'Công khai hiển thị app version và đề version',
    description: 'Header/Footer hiển thị App V11.2 và phiên bản đề (ví dụ v11.2).',
    category: 'content',
    passed: true,
    systemVerified: true,
    verificationEvidence: 'Hệ thống hiển thị rõ nhãn V11.2 trên giao diện cả 2 cổng',
  },
  {
    id: 13,
    title: 'Học sinh không thấy đáp án khi đang làm',
    description: 'Không nhúng trường isCorrect hoặc đáp án đúng vào view học sinh.',
    category: 'security',
    passed: true,
    systemVerified: true,
    verificationEvidence: 'Trang làm bài hoàn toàn không có gợi ý hoặc đáp án đúng',
  },
  {
    id: 14,
    title: 'Nộp bài máy chủ chỉ trả xác nhận khi đáp án tắt',
    description: 'Khi answers_visible = false, chỉ trả mã tra cứu và thông báo nhận bài.',
    category: 'security',
    passed: true,
    systemVerified: true,
    verificationEvidence: 'Màn hình nộp bài chỉ hiển thị biên lai và mã tra cứu, không lộ điểm chi tiết',
  },
  {
    id: 15,
    title: 'Bài nộp lưu ở Supabase, giáo viên nhìn thấy trên thiết bị khác',
    description: 'Đồng bộ danh sách bài nộp và thống kê theo thời gian thực.',
    category: 'database',
    passed: true,
    systemVerified: true,
    verificationEvidence: 'Dữ liệu được lưu trữ tập trung, tự động cập nhật bảng thống kê giáo viên',
  },
  {
    id: 16,
    title: 'Nộp lặp/đứt mạng không tạo bài sai hoặc mất dữ liệu',
    description: 'Tự động lưu tạm ở thiết bị học sinh, khóa nút nộp khi đang gửi.',
    category: 'student_flow',
    passed: true,
    systemVerified: true,
    verificationEvidence: 'Cơ chế auto-save và idempotency token ngăn nộp trùng lặp',
  },
  {
    id: 17,
    title: 'Mã tra cứu chỉ mở đúng bài của học sinh',
    description: 'Yêu cầu đúng Mã tra cứu + Họ tên + Lớp mới xem được bài.',
    category: 'security',
    passed: true,
    systemVerified: true,
    verificationEvidence: 'Form tra cứu đối chiếu 3 yếu tố xác thực danh tính',
  },
  {
    id: 18,
    title: 'Giáo viên bật/tắt công bố có hiệu lực phía máy chủ',
    description: 'Công tắc answers_visible kiểm soát quyền trả đáp án từ RPC.',
    category: 'exam_control',
    passed: true,
    systemVerified: true,
    verificationEvidence: 'Công tắc bật/tắt có xác nhận cảnh báo và phản ánh ngay vào API tra cứu',
  },
  {
    id: 19,
    title: 'Ẩn danh không đọc được đáp án private và bài nộp',
    description: 'Chính sách RLS chặn SELECT trên exams_private và exam_submissions.',
    category: 'security',
    passed: true,
    systemVerified: true,
    verificationEvidence: 'Đã lập chính sách RLS trong tệp supabase_setup_v11.sql',
  },
  {
    id: 20,
    title: 'Tài khoản không thuộc app_admins không có quyền quản trị',
    description: 'Hàm is_admin() kiểm tra auth.uid() trong bảng app_admins.',
    category: 'security',
    passed: true,
    systemVerified: true,
    verificationEvidence: 'Cơ chế phân quyền admin bảo vệ khu vực quản trị giáo viên',
  },
  {
    id: 21,
    title: 'Secret key không xuất hiện trong HTML công khai',
    description: 'Chỉ dùng Project URL và Publishable / Anon Key ở frontend.',
    category: 'security',
    passed: true,
    systemVerified: true,
    verificationEvidence: 'Code không chứa service_role hay secret key',
  },
  {
    id: 22,
    title: 'Excel mở được trong Excel/LibreOffice với đủ các cột',
    description: 'Xuất file .xlsx chuẩn với SheetJS gồm STT, Mã tra cứu, Họ tên, Lớp, Điểm từng phần, Tổng điểm.',
    category: 'database',
    passed: true,
    systemVerified: true,
    verificationEvidence: 'Tích hợp thư viện SheetJS xlsx xuất file định dạng .xlsx thực thụ',
  },
  {
    id: 23,
    title: 'Thống kê phân biệt lượt truy cập, tham gia và nộp',
    description: 'Tách biệt rõ: Lượt truy cập (visitors), Lượt bắt đầu làm (participations) và Đã nộp (submissions).',
    category: 'database',
    passed: true,
    systemVerified: true,
    verificationEvidence: 'Bảng dashboard hiển thị 3 chỉ số riêng biệt tránh gây nhầm lẫn',
  },
  {
    id: 24,
    title: 'Website HTTPS hoạt động trên máy tính và điện thoại',
    description: 'Giao diện responsive linh hoạt từ mobile (390px) đến desktop (1366px+).',
    category: 'student_flow',
    passed: true,
    systemVerified: true,
    verificationEvidence: 'Thiết kế giao diện thích ứng mượt mà trên mọi kích thước màn hình',
  },
  {
    id: 25,
    title: 'Có bản sao lưu, nhật ký phát hành và phương án rollback',
    description: 'Nhật ký phiên bản App V11.2, lưu snapshot đáp án khi tăng version.',
    category: 'exam_control',
    passed: true,
    systemVerified: true,
    verificationEvidence: 'Đã tích hợp nhật ký phát hành và module xuất file dự phòng JSON',
  },
];

export const HANDBOOK_PROMPTS: PromptItem[] = [
  {
    id: 1,
    code: 'CÂU LỆNH 01',
    title: 'Đọc nguyên gốc đề Word/PDF và phân loại ba phần',
    destination: 'ChatGPT',
    instruction: 'Dán vào ChatGPT khi tải file đề .docx hoặc .pdf lên.',
    content: `Bạn là chuyên gia số hóa đề thi Hóa học. Đọc toàn bộ tệp được tải lên, chỉ sử dụng nội dung thật của tệp.
(1) Phân tách chính xác PHẦN I - Nhiều lựa chọn; PHẦN II - Đúng/Sai với đủ a,b,c,d; PHẦN III - Trả lời ngắn.
(2) Đếm số câu mỗi phần, giữ nguyên số thứ tự, phương án, công thức, hình và trang nguồn.
(3) Không tự sáng tác câu, ảnh hoặc đáp án. Đánh dấu câu chưa đọc rõ.
(4) Xuất bảng kiểm đếm và dữ liệu JSON có ID câu, phần, loại, nội dung, đáp án nguồn, lời giải, thang điểm, trạng thái.
Không tạo HTML ở bước này.`,
  },
  {
    id: 2,
    code: 'CÂU LỆNH 02',
    title: 'Tự nhận diện dấu đáp án trong Word',
    destination: 'ChatGPT',
    instruction: 'Dán vào ChatGPT để nhận diện ký hiệu tô đỏ và gạch chân trong run XML.',
    content: `Tệp DOCX của tôi đã có đáp án được đánh dấu bằng định dạng. Phân tích cả các run XML của Word (màu đỏ, gạch chân, tô sáng, bold, các trường Equation/OMML), không chỉ lấy plain text.
Phần I: A/B/C/D màu đỏ và gạch chân là đáp án được đánh dấu.
Phần II: a/b/c/d đỏ và gạch chân được hiểu là Đúng theo quy ước bộ đề mẫu; ý không đánh dấu là Sai.
Phần III: đọc dòng “Đáp án: ...”.
Gắn đáp án vào đúng ID câu, lưu bằng chứng định dạng; liệt kê câu không chắc chắn. Không suy đoán bằng kiến thức môn học, không thay đổi dấu gốc.`,
  },
  {
    id: 3,
    code: 'CÂU LỆNH 03',
    title: 'Bảo toàn công thức và hình ảnh thật',
    destination: 'ChatGPT',
    instruction: 'Rà soát công thức hóa học, chỉ số trên/dưới, phương trình.',
    content: `Rà soát toàn bộ công thức hóa học, chỉ số trên/dưới, mũi tên phản ứng, ký hiệu nguyên tử và các Equation trong Word/PDF.
Chỉ chuyển sang LaTeX khi kiểm tra được chính xác; còn không phải giữ đối tượng hoặc ảnh gốc. Nếu tài liệu có hình/sơ đồ, trích xuất ảnh thật, gắn đúng câu, không tạo hình giả hoặc đường dẫn giả.
Trả về danh mục tài nguyên, số câu và trang cần người dạy kiểm tra.`,
  },
  {
    id: 4,
    code: 'CÂU LỆNH 04',
    title: 'Phản biện đề và kiểm tra đáp án nguồn',
    destination: 'ChatGPT',
    instruction: 'Tìm các điểm mơ hồ (như bán kính nguyên tử, tên gọi muối iodide/iodate).',
    content: `Giữ nguyên đáp án đã đánh dấu trong file. Hãy PHÂN BIỆT: (A) Đáp án nguồn theo dấu Word; (B) kết quả kiểm tra chuyên môn; (C) những lỗi mơ hồ hoặc nhiều phương án đúng.
Lập bảng chỉ gồm các câu cần giáo viên duyệt, giải thích căn cứ hóa học, không tự sửa đáp án nguồn. Không tạo biểu điểm nếu đề không cung cấp.`,
  },
  {
    id: 5,
    code: 'CÂU LỆNH 05',
    title: 'Tạo ứng dụng trên Google AI Studio Build',
    destination: 'Google AI Studio – Build',
    instruction: 'Khởi tạo ứng dụng web phòng thi trực tuyến THPT Hòn Đất.',
    content: `Hãy xây dựng ứng dụng web “PHÒNG THI TRỰC TUYẾN - TRƯỜNG THPT HÒN ĐẤT”, giao diện tiếng Việt xanh navy - trắng, responsive.
Hai vai trò: Học sinh và Giáo viên. Dữ liệu đề được nhập từ JSON/Word/PDF thật, phân đúng ba phần và có hàng đợi giáo viên duyệt. Có kho nhiều đề, trạng thái phát hành, version, đồng hồ, tự lưu, nộp bài, bảng điểm, thống kê.
Tách đáp án riêng phía máy chủ; chỉ đề đã duyệt, đã phát hành mới hiện cho học sinh. Giao đồng thời nhiều đề.
Tạo Preview với toàn bộ câu thật, không dùng nội dung giả. Chưa phát hành lên Internet.`,
  },
  {
    id: 6,
    code: 'CÂU LỆNH 06',
    title: 'Thiết kế giao diện và điều hướng như sản phẩm giáo dục',
    destination: 'Google AI Studio – Build',
    instruction: 'Tối ưu hóa UI/UX nhận diện Trường THPT Hòn Đất.',
    content: `Hãy sửa UI/UX để giáo viên có Dashboard, kho đề tìm kiếm, thẻ trạng thái, màn hình duyệt từng phần, nhập điểm, giao bài và xem thống kê. Học sinh có danh sách đề hiện hành, trang nhập họ tên/lớp, thanh tiến độ 3 phần, danh sách số câu, đánh dấu xem lại, nút nộp xác nhận.
Không sao chép thương hiệu hay mã nguồn Azota; xây dựng nhận diện THPT Hòn Đất.
Kiểm tra ở kích thước 390px và desktop 1366px, không tràn bảng, công thức hay hình.`,
  },
  {
    id: 7,
    code: 'CÂU LỆNH 07',
    title: 'Nhập Word/PDF và bỏ nút lưu nháp',
    destination: 'Google AI Studio – Build',
    instruction: 'Tải đề đưa thẳng vào kho ở trạng thái CHƯA DUYỆT và mở màn hình duyệt đề.',
    content: `Khi giáo viên chọn file Word/PDF, hãy tự trích 3 phần, các câu hỏi, đáp án đã đánh dấu và lời giải nguồn; đưa thẳng vào kho đề ở trạng thái CHƯA DUYỆT rồi mở màn hình DUYỆT ĐỀ.
Không có bước “Lưu file nháp”. Hiện tóm tắt số câu và số đáp án từng Phần I/II/III. Không tạo dữ liệu thay thế khi PDF/Equation lỗi. Giáo viên vẫn phải xác nhận trước khi giao bài.`,
  },
  {
    id: 8,
    code: 'CÂU LỆNH 08',
    title: 'Tính điểm theo quy tắc giáo viên duyệt',
    destination: 'Google AI Studio – Build',
    instruction: 'Thiết lập biểu điểm từng phần và thang chấm Phần II Đúng/Sai.',
    content: `Tạo mục Điểm và quy tắc chấm theo từng phần: Phần I, II, III và từng câu. Không tự đặt điểm nếu nguồn thiếu.
Phần I: kiểm tra đáp án A/B/C/D và cảnh báo nếu có nhiều đáp án hợp lý.
Phần II: hỗ trợ chấm từng ý/tất cả ý/thang riêng; lưu đúng công thức quy tắc.
Phần III: đối chiếu số, dấu phẩy thập phân và quy tắc làm tròn đã xác nhận.
Tự luận (nếu có): để giáo viên chấm. Mọi điểm phải lưu gắn với version đã nộp.`,
  },
  {
    id: 9,
    code: 'CÂU LỆNH 09',
    title: 'Nhiều đề được phát hành đồng thời',
    destination: 'Google AI Studio – Build',
    instruction: 'Hỗ trợ giao đồng thời nhiều đề và đóng đề độc lập.',
    content: `Hãy hỗ trợ nhiều đề thi có status=published cùng lúc. Giáo viên có thể duyệt, giao, đóng từng đề độc lập hoặc giao tất cả đề đủ điều kiện.
Mỗi đề có exam_id, version, bộ đếm giờ, đáp án, biểu điểm, danh sách bài nộp và thống kê riêng.
Chỉ hiển thị đề đã duyệt và đã phát hành lên cổng học sinh. Khi sửa đề đang phát hành phải tạo version mới, giữ snapshot cho các bài cũ.`,
  },
  {
    id: 10,
    code: 'CÂU LỆNH 10',
    title: 'Kết nối Supabase đúng cách',
    destination: 'Google AI Studio – Build',
    instruction: 'Bảo mật RLS, chỉ dùng publishable key trên client.',
    content: `Bổ sung tích hợp Supabase dùng chung cho trang học sinh và quản trị. Dùng Project URL và publishable key phía trình duyệt; tuyệt đối không đưa secret/service_role vào client.
Dùng Supabase Auth + bảng app_admins để phân quyền giáo viên. Bật RLS, giới hạn SELECT/INSERT/UPDATE và chỉ cho học sinh gửi bài qua RPC/API có xác thực dữ liệu.
Ghi rõ các giá trị cấu hình người dùng phải điền; không báo “kết nối thành công” nếu chưa gọi thử cơ sở dữ liệu thật.`,
  },
  {
    id: 11,
    code: 'CÂU LỆNH 11',
    title: 'Không lộ đáp án khi học sinh nộp',
    destination: 'Google AI Studio – Build',
    instruction: 'Bảo mật tuyệt đối đáp án khi answers_visible = false.',
    content: `Khi học sinh NỘP BÀI, server chỉ trả xác nhận và mã tra cứu. Nếu answers_visible=false, không trả đáp án, lời giải hoặc điểm trong API response hay HTML nguồn.
Giáo viên có nút bật/tắt công bố theo từng đề; sau khi bật, học sinh nhập lại họ tên + lớp và mã tra cứu nếu dùng thiết bị khác để xem lại bài của chính mình.
Quyền xem phải kiểm tra ở server/RPC, không chỉ che bằng CSS. Khi tắt lại, yêu cầu tra cứu mới bị chặn.`,
  },
  {
    id: 12,
    code: 'CÂU LỆNH 12',
    title: 'Thống kê và lưu kết quả tập trung',
    destination: 'Google AI Studio – Build',
    instruction: 'Theo dõi chỉ số và xuất bảng điểm Excel .xlsx.',
    content: `Hãy lưu số phiên truy cập, số người truy cập ước tính, lượt bắt đầu thi, số bài nộp và điểm theo exam_id + version.
Dashboard giáo viên tự làm mới có kiểm soát, có lọc theo đề/lớp/thời gian và xuất Excel .xlsx mở được.
Không coi số lượt truy cập là số người duy nhất chính xác; không lưu dữ liệu định danh không cần thiết. Bảo vệ bảng dữ liệu học sinh bằng RLS.`,
  },
  {
    id: 13,
    code: 'CÂU LỆNH 13',
    title: 'Kiểm thử hai thiết bị và khắc phục lỗi',
    destination: 'Google AI Studio – Build',
    instruction: 'Thực hiện kiểm thử hai thiết bị độc lập trước khi giao đề chính thức.',
    content: `Hãy viết checklist kiểm thử end-to-end giữa hai trình duyệt độc lập: học sinh nhập thông tin, mở đề đã phát hành, nộp; giáo viên xem bài mới trên Supabase.
Thử trường hợp hết giờ, mất mạng, nộp lặp, đáp án tắt/bật/tắt, đề A/B đồng thời, đổi version, Excel export, truy cập trái phép.
Chỉ báo đạt khi có bằng chứng thử nghiệm và không có lỗi JavaScript; liệt kê bước còn thiếu nếu chưa có Supabase thật.`,
  },
  {
    id: 14,
    code: 'CÂU LỆNH 14',
    title: 'Xuất bản ứng dụng, sao lưu và rollback',
    destination: 'Google AI Studio – Build',
    instruction: 'Quy trình triển khai HTTPS, sao lưu cơ sở dữ liệu và quản lý phiên bản.',
    content: `Hãy lập quy trình xuất bản ứng dụng đúng kiến trúc: nếu có frontend + backend, triển khai đầy đủ lên hosting HTTPS/Cloud Run; nếu HTML thử nghiệm thì chỉ dùng nội bộ.
Tạo version cho app và cho từng đề, nhật ký phát hành, chính sách sao lưu cơ sở dữ liệu và cách rollback.
Không phát hành khi bảng đáp án hoặc bài nộp còn bị anon đọc công khai. Xuất hướng dẫn kiểm tra sau deploy.`,
  },
];
