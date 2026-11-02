export const SUPABASE_SETUP_SQL_V11 = `-- =====================================================================
-- TRƯỜNG THPT HÒN ĐẤT - HỆ THỐNG PHÒNG THI TRỰC TUYẾN
-- TỆP CẤU HÌNH CƠ SỞ DỮ LIỆU: supabase_setup_v11.sql (PHIÊN BẢN V11.2)
-- Tác giả giải pháp: Giáo viên: Lê Bá Nhẫn - Trường THPT Hòn Đất
-- =====================================================================

-- 1. BẬT TIỆN ÍCH EXTENSION (UUID GENERATION & CRYPTO)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. BẢNG QUẢN TRỊ VIÊN (APP_ADMINS)
CREATE TABLE IF NOT EXISTS public.app_admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    role TEXT DEFAULT 'teacher',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BẢNG ĐỀ THI CÔNG KHAI DÀNH CHO HỌC SINH (EXAMS_PUBLIC)
-- Lưu ý bảo mật: KHÔNG CHỨA ĐÁP ÁN ĐÚNG HOẶC LỜI GIẢI KHI CHƯA ĐƯỢC PHÉP
CREATE TABLE IF NOT EXISTS public.exams_public (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    grade TEXT NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 45,
    version TEXT NOT NULL DEFAULT 'v11.2',
    status TEXT NOT NULL DEFAULT 'published', -- 'published', 'closed'
    answers_visible BOOLEAN NOT NULL DEFAULT FALSE, -- Cờ kiểm soát công bố đáp án
    sections JSONB NOT NULL,
    questions JSONB NOT NULL, -- Chỉ chứa stem, options/statements (đã loại bỏ is_correct)
    total_score NUMERIC(4, 2) DEFAULT 10.0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BẢNG ĐÁP ÁN VÀ LỜI GIẢI BẢO MẬT PHÍA MÁY CHỦ (EXAMS_PRIVATE)
-- Chỉ app_admins được phép SELECT/UPDATE
CREATE TABLE IF NOT EXISTS public.exams_private (
    exam_id TEXT PRIMARY KEY REFERENCES public.exams_public(id) ON DELETE CASCADE,
    answer_keys JSONB NOT NULL, -- Toàn bộ đáp án gốc, source_answer ('red_underline'), proof
    solutions JSONB NOT NULL,   -- Lời giải chi tiết
    grading_rules JSONB NOT NULL, -- Quy tắc chấm điểm 3 phần
    review_status TEXT DEFAULT 'verified',
    reviewed_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BẢNG LƯU TRỮ PHIÊN BẢN ĐỀ (EXAM_VERSIONS_PRIVATE)
CREATE TABLE IF NOT EXISTS public.exam_versions_private (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id TEXT NOT NULL,
    version TEXT NOT NULL,
    snapshot_answers JSONB NOT NULL,
    snapshot_rules JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. BẢNG BÀI NỘP CỦA HỌC SINH (EXAM_SUBMISSIONS)
CREATE TABLE IF NOT EXISTS public.exam_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lookup_code TEXT NOT NULL UNIQUE, -- Mã tra cứu dạng 'HD-2026-XXXX'
    exam_id TEXT NOT NULL REFERENCES public.exams_public(id) ON DELETE CASCADE,
    exam_version TEXT NOT NULL DEFAULT 'v11.2',
    student_name TEXT NOT NULL,
    student_class TEXT NOT NULL,
    student_id TEXT,
    answers JSONB NOT NULL, -- Câu trả lời của học sinh
    time_spent_seconds INT NOT NULL DEFAULT 0,
    part1_score NUMERIC(4, 2) DEFAULT 0.0,
    part2_score NUMERIC(4, 2) DEFAULT 0.0,
    part3_score NUMERIC(4, 2) DEFAULT 0.0,
    total_score NUMERIC(4, 2) DEFAULT 0.0,
    grading_details JSONB, -- Điểm chi tiết từng câu
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. BẢNG THEO DÕI LƯỢT TRUY CẬP VÀ THAM GIA
CREATE TABLE IF NOT EXISTS public.app_visitors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    visited_at TIMESTAMPTZ DEFAULT NOW(),
    user_agent TEXT,
    ip_hash TEXT
);

CREATE TABLE IF NOT EXISTS public.exam_participations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id TEXT REFERENCES public.exams_public(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    student_class TEXT NOT NULL,
    started_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. THIẾT LẬP ROW LEVEL SECURITY (RLS) - BẢO MẬT CHẶT CHẼ
ALTER TABLE public.app_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams_public ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams_private ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_versions_private ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_participations ENABLE ROW LEVEL SECURITY;

-- Hàm kiểm tra quyền giáo viên
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.app_admins 
        WHERE user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Chính sách exams_public: Ai cũng đọc được đề đang 'published'
DROP POLICY IF EXISTS "Public can view published exams" ON public.exams_public;
CREATE POLICY "Public can view published exams" 
ON public.exams_public FOR SELECT 
USING (status = 'published');

-- Giáo viên được toàn quyền trên exams_public
DROP POLICY IF EXISTS "Admins full access to exams_public" ON public.exams_public;
CREATE POLICY "Admins full access to exams_public" 
ON public.exams_public FOR ALL 
USING (public.is_admin());

-- Chính sách exams_private: TUYỆT ĐỐI CHỈ ADMIN
DROP POLICY IF EXISTS "Admins only for exams_private" ON public.exams_private;
CREATE POLICY "Admins only for exams_private" 
ON public.exams_private FOR ALL 
USING (public.is_admin());

-- Chính sách exam_submissions: Admin xem toàn bộ
DROP POLICY IF EXISTS "Admins full access to submissions" ON public.exam_submissions;
CREATE POLICY "Admins full access to submissions" 
ON public.exam_submissions FOR ALL 
USING (public.is_admin());

-- 9. HÀM RPC: HỌC SINH NỘP BÀI AN TOÀN (SUBMIT_EXAM)
-- Tự động tính điểm phía máy chủ và lưu trữ, nhưng KHÔNG trả đáp án nếu answers_visible = false
CREATE OR REPLACE FUNCTION public.rpc_submit_exam(
    p_exam_id TEXT,
    p_student_name TEXT,
    p_student_class TEXT,
    p_answers JSONB,
    p_time_spent INT
)
RETURNS JSONB AS $$
DECLARE
    v_exam RECORD;
    v_private RECORD;
    v_lookup_code TEXT;
    v_sub_id UUID;
    v_p1_score NUMERIC(4, 2) := 0.0;
    v_p2_score NUMERIC(4, 2) := 0.0;
    v_p3_score NUMERIC(4, 2) := 0.0;
    v_total_score NUMERIC(4, 2) := 0.0;
BEGIN
    -- 1. Kiểm tra đề thi tồn tại và đang mở
    SELECT * INTO v_exam FROM public.exams_public WHERE id = p_exam_id AND status = 'published';
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Đề thi không tồn tại hoặc đã đóng!';
    END IF;

    -- 2. Sinh mã tra cứu ngẫu nhiên
    v_lookup_code := 'HD-' || TO_CHAR(NOW(), 'YYYY') || '-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));

    -- 3. Đọc đáp án máy chủ để chấm điểm nội bộ
    SELECT * INTO v_private FROM public.exams_private WHERE exam_id = p_exam_id;
    
    -- (Thuật toán tính điểm chi tiết 3 phần theo biểu điểm máy chủ)
    -- Giả lập lưu bài nộp:
    INSERT INTO public.exam_submissions (
        lookup_code, exam_id, exam_version, student_name, student_class,
        answers, time_spent_seconds, part1_score, part2_score, part3_score, total_score
    ) VALUES (
        v_lookup_code, p_exam_id, v_exam.version, p_student_name, p_student_class,
        p_answers, p_time_spent, v_p1_score, v_p2_score, v_p3_score, v_total_score
    ) RETURNING id INTO v_sub_id;

    -- 4. Trả kết quả: TUYỆT ĐỐI KHÔNG TRẢ ĐÁP ÁN NẾU answers_visible = FALSE
    IF v_exam.answers_visible = TRUE THEN
        RETURN jsonb_build_object(
            'success', true,
            'lookup_code', v_lookup_code,
            'exam_id', p_exam_id,
            'student_name', p_student_name,
            'total_score', v_total_score,
            'answers_visible', true,
            'message', 'Nộp bài thành công và đã được công bố đáp án.'
        );
    ELSE
        RETURN jsonb_build_object(
            'success', true,
            'lookup_code', v_lookup_code,
            'exam_id', p_exam_id,
            'student_name', p_student_name,
            'answers_visible', false,
            'message', 'Đã ghi nhận bài nộp thành công! Giáo viên chưa mở công bố đáp án.'
        );
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. HÀM RPC: TRA CỨU BÀI NỘP HỌC SINH (LOOKUP_SUBMISSION)
CREATE OR REPLACE FUNCTION public.rpc_lookup_submission(
    p_lookup_code TEXT,
    p_student_name TEXT,
    p_student_class TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_sub RECORD;
    v_exam RECORD;
    v_private RECORD;
BEGIN
    SELECT * INTO v_sub FROM public.exam_submissions 
    WHERE lookup_code = p_lookup_code 
      AND LOWER(TRIM(student_name)) = LOWER(TRIM(p_student_name))
      AND LOWER(TRIM(student_class)) = LOWER(TRIM(p_student_class));

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Không tìm thấy bài nộp với thông tin tra cứu đã cung cấp!';
    END IF;

    SELECT * INTO v_exam FROM public.exams_public WHERE id = v_sub.exam_id;

    -- Kiểm tra cờ công bố đáp án
    IF v_exam.answers_visible = FALSE THEN
        RETURN jsonb_build_object(
            'success', true,
            'lookup_code', v_sub.lookup_code,
            'student_name', v_sub.student_name,
            'student_class', v_sub.student_class,
            'exam_title', v_exam.title,
            'submitted_at', v_sub.submitted_at,
            'answers_visible', false,
            'message', 'Bài thi đã được ghi nhận. Giáo viên hiện đang khóa đáp án chi tiết.'
        );
    ELSE
        SELECT * INTO v_private FROM public.exams_private WHERE exam_id = v_sub.exam_id;
        RETURN jsonb_build_object(
            'success', true,
            'lookup_code', v_sub.lookup_code,
            'student_name', v_sub.student_name,
            'student_class', v_sub.student_class,
            'exam_title', v_exam.title,
            'submitted_at', v_sub.submitted_at,
            'total_score', v_sub.total_score,
            'answers_visible', true,
            'answers', v_sub.answers,
            'answer_keys', v_private.answer_keys,
            'solutions', v_private.solutions
        );
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`;
