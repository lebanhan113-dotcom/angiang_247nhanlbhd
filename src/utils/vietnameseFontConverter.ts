/**
 * Bộ chuyển đổi và chuẩn hóa bảng mã tiếng Việt: TCVN3 (ABC), VNI -> Unicode UTF-8
 * Dành cho hệ thống phòng thi THPT Hòn Đất - Thầy Lê Bá Nhẫn
 */

// Bảng ánh xạ TCVN3 (.VnTime, .VnTimeH) sang Unicode UTF-8 chuẩn
const TCVN3_MAP: Record<string, string> = {
  'a\u0300': 'à', 'a\u0301': 'á', 'a\u0303': 'ã', 'a\u0309': 'ả', 'a\u0323': 'ạ',
  '¸': 'á', 'µ': 'à', '¶': 'ả', '·': 'ã', '¹': 'ạ',
  '¨': 'ă', '¾': 'ắ', '»': 'ằ', '¼': 'ẳ', '½': 'ẵ', 'Æ': 'ặ',
  '©': 'â', 'Ê': 'ấ', 'Ç': 'ầ', 'È': 'ẩ', 'É': 'ẫ', 'Ë': 'ậ',
  '®': 'đ',
  'e\u0300': 'è', 'e\u0301': 'é', 'e\u0303': 'ẽ', 'e\u0309': 'ẻ', 'e\u0323': 'ẹ',
  'Ð': 'é', 'Ì': 'è', 'Î': 'ẻ', 'Ï': 'ẽ', 'Ñ': 'ẹ',
  'ª': 'ê', 'Õ': 'ế', 'Ò': 'ề', 'Ó': 'ể', 'Ô': 'ễ', 'Ö': 'ệ',
  'i\u0300': 'ì', 'i\u0301': 'í', 'i\u0303': 'ĩ', 'i\u0309': 'ỉ', 'i\u0323': 'ị',
  'Ý': 'í', '×': 'ì', 'Ø': 'ỉ', 'Ü': 'ĩ', 'Þ': 'ị',
  'o\u0300': 'ò', 'o\u0301': 'ó', 'o\u0303': 'õ', 'o\u0309': 'ỏ', 'o\u0323': 'ọ',
  'ã': 'ó', 'ß': 'ò', 'á': 'ỏ', 'â': 'õ', 'ä': 'ọ',
  '«': 'ô', 'è': 'ố', 'å': 'ồ', 'æ': 'ổ', 'ç': 'ỗ', 'é': 'ộ',
  '¬': 'ơ', 'í': 'ớ', 'ê': 'ờ', 'ë': 'ở', 'ì': 'ỡ', 'î': 'ợ',
  'u\u0300': 'ù', 'u\u0301': 'ú', 'u\u0303': 'ũ', 'u\u0309': 'ủ', 'u\u0323': 'ụ',
  'ó': 'ú', 'ï': 'ù', 'ñ': 'ủ', 'ò': 'ũ', 'ô': 'ụ',
  '­': 'ư', 'ù': 'ứ', 'ö': 'ừ', '÷': 'ử', 'ø': 'ữ', 'ú': 'ự',
  'y\u0300': 'ỳ', 'y\u0301': 'ý', 'y\u0303': 'ỹ', 'y\u0309': 'ỷ', 'y\u0323': 'ỵ',
  'ý': 'ý', 'û': 'ỳ', 'ü': 'ỷ', 'þ': 'ỹ', 'ỳ': 'ỵ',
  // Chữ hoa
  '¡': 'Ă', '¢': 'Â', '§': 'Đ', '£': 'Ê', '¤': 'Ô', '¥': 'Ơ', '¦': 'Ư',
};

// Bảng ánh xạ VNI sang Unicode
const VNI_COMPLEX_MAP: [RegExp, string][] = [
  [/a1/g, 'á'], [/a2/g, 'à'], [/a3/g, 'ả'], [/a4/g, 'ã'], [/a5/g, 'ạ'],
  [/a61/g, 'ấ'], [/a62/g, 'ầ'], [/a63/g, 'ẩ'], [/a64/g, 'ẫ'], [/a65/g, 'ậ'], [/a6/g, 'â'],
  [/a81/g, 'ắ'], [/a82/g, 'ằ'], [/a83/g, 'ẳ'], [/a84/g, 'ẵ'], [/a85/g, 'ặ'], [/a8/g, 'ă'],
  [/e1/g, 'é'], [/e2/g, 'è'], [/e3/g, 'ẻ'], [/e4/g, 'ẽ'], [/e5/g, 'ẹ'],
  [/e61/g, 'ế'], [/e62/g, 'ề'], [/e63/g, 'ể'], [/e64/g, 'ễ'], [/e65/g, 'ệ'], [/e6/g, 'ê'],
  [/i1/g, 'í'], [/i2/g, 'ì'], [/i3/g, 'ỉ'], [/i4/g, 'ĩ'], [/i5/g, 'ị'],
  [/o1/g, 'ó'], [/o2/g, 'ò'], [/o3/g, 'ỏ'], [/o4/g, 'õ'], [/o5/g, 'ọ'],
  [/o61/g, 'ố'], [/o62/g, 'ồ'], [/o63/g, 'ổ'], [/o64/g, 'ỗ'], [/o65/g, 'ộ'], [/o6/g, 'ô'],
  [/o71/g, 'ớ'], [/o72/g, 'ờ'], [/o73/g, 'ở'], [/o74/g, 'ỡ'], [/o75/g, 'ợ'], [/o7/g, 'ơ'],
  [/u1/g, 'ú'], [/u2/g, 'ù'], [/u3/g, 'ủ'], [/u4/g, 'ũ'], [/u5/g, 'ụ'],
  [/u71/g, 'ứ'], [/u72/g, 'ừ'], [/u73/g, 'ử'], [/u74/g, 'ữ'], [/u75/g, 'ự'], [/u7/g, 'ư'],
  [/y1/g, 'ý'], [/y2/g, 'ỳ'], [/y3/g, 'ỷ'], [/y4/g, 'ỹ'], [/y5/g, 'ỵ'],
  [/d9/g, 'đ'], [/D9/g, 'Đ'],
];

/**
 * Chuyển đổi chuỗi ký tự từ TCVN3 sang Unicode chuẩn
 */
export function convertTCVN3ToUnicode(text: string): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    result += TCVN3_MAP[char] !== undefined ? TCVN3_MAP[char] : char;
  }
  return result;
}

/**
 * Chuyển đổi chuỗi ký tự từ VNI sang Unicode chuẩn
 */
export function convertVNIToUnicode(text: string): string {
  let result = text;
  for (const [pattern, replacement] of VNI_COMPLEX_MAP) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

/**
 * Tự động phát hiện và sửa lỗi font chữ tiếng Việt
 */
export function autoFixVietnameseFont(text: string): { text: string; detectedEncoding: string } {
  if (!text) return { text: '', detectedEncoding: 'UTF-8' };

  // Kiểm tra dấu hiệu TCVN3: xuất hiện các ký tự đặc trưng như ¸, µ, ¶, ·, ¹, ¨, ©, ª, «, ¬
  const tcvn3Markers = /[¸µ¶·¹¨¾»¼½Æ©ÊÇÈÉË®¡¢§£¤¥¦]/;
  if (tcvn3Markers.test(text)) {
    return {
      text: convertTCVN3ToUnicode(text),
      detectedEncoding: 'TCVN3 (.VnTime)',
    };
  }

  // Kiểm tra dấu hiệu VNI có số 1-9 sau nguyên âm: e.g. "a1", "o61", "d9"
  const vniMarkers = /[aeiouy][1-8]|[aeo]6[1-5]|d9/i;
  if (vniMarkers.test(text)) {
    return {
      text: convertVNIToUnicode(text),
      detectedEncoding: 'VNI-Times',
    };
  }

  // Chuẩn hóa Unicode dựng sẵn (NFC)
  const normalized = text.normalize('NFC');
  return {
    text: normalized,
    detectedEncoding: 'UTF-8 (Unicode Chuẩn)',
  };
}

/**
 * Bản đồ chuyển đổi số và dấu thành Subscript và Superscript trong Hóa học
 */
const SUPERSCRIPT_MAP: Record<string, string> = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
  '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾',
  'n': 'ⁿ', 's': 'ˢ', 'p': 'ᵖ', 'd': 'ᵈ', 'f': 'ᶠ',
};

const SUBSCRIPT_MAP: Record<string, string> = {
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
  '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
  '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎',
  'a': 'ₐ', 'e': 'ₑ', 'o': 'ₒ', 'x': 'ₓ',
};

export function toSuperscript(str: string): string {
  return str.split('').map((c) => SUPERSCRIPT_MAP[c] || c).join('');
}

export function toSubscript(str: string): string {
  return str.split('').map((c) => SUBSCRIPT_MAP[c] || c).join('');
}
