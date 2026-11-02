import JSZip from 'jszip';
import mammoth from 'mammoth';
import { autoFixVietnameseFont, toSuperscript, toSubscript } from './vietnameseFontConverter';

export interface ExtractedDocxResult {
  text: string;
  detectedFontEncoding: string;
  redUnderlineFound: number;
  paragraphCount: number;
  extractedWith: 'jszip_ooxml' | 'mammoth' | 'plaintext';
}

/**
 * Đọc file Word (.docx) nhị phân trực tiếp từ ArrayBuffer, bảo toàn font chữ tiếng Việt,
 * dấu tô đỏ gạch chân, và chỉ số trên/dưới trong công thức Hóa học.
 */
export async function extractTextFromWordFile(file: File): Promise<ExtractedDocxResult> {
  const fileName = file.name.toLowerCase();

  // 1. Nếu là file văn bản thuần (.txt)
  if (fileName.endsWith('.txt')) {
    const buffer = await file.arrayBuffer();
    const decoder = new TextDecoder('utf-8');
    let rawText = decoder.decode(buffer);
    const fixed = autoFixVietnameseFont(rawText);
    return {
      text: fixed.text,
      detectedFontEncoding: fixed.detectedEncoding,
      redUnderlineFound: 0,
      paragraphCount: fixed.text.split('\n').length,
      extractedWith: 'plaintext',
    };
  }

  // 2. Đọc file .docx bằng JSZip để phân tích chính xác từng thẻ XML (Runs, Color, Underline, Formula)
  try {
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);
    const documentXmlFile = zip.file('word/document.xml');

    if (documentXmlFile) {
      const xmlString = await documentXmlFile.async('string');
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'application/xml');

      let fullText = '';
      let redUnderlineCount = 0;
      let paragraphCount = 0;

      const paragraphs = xmlDoc.getElementsByTagName('w:p');
      paragraphCount = paragraphs.length;

      for (let i = 0; i < paragraphs.length; i++) {
        const p = paragraphs[i];
        let pText = '';

        // Đọc từng run trong đoạn văn
        const runs = p.getElementsByTagName('w:r');
        for (let j = 0; j < runs.length; j++) {
          const r = runs[j];
          const rPr = r.getElementsByTagName('w:rPr')[0];

          // Kiểm tra định dạng tô đỏ hoặc gạch chân
          let isRed = false;
          let isUnderline = false;
          let isSuperscript = false;
          let isSubscript = false;

          if (rPr) {
            // Kiểm tra màu chữ (red, FF0000, vv.)
            const colorElem = rPr.getElementsByTagName('w:color')[0];
            if (colorElem) {
              const colorVal = (colorElem.getAttribute('w:val') || '').toUpperCase();
              if (colorVal === 'RED' || colorVal === 'FF0000' || colorVal === 'C00000' || colorVal.startsWith('FF')) {
                isRed = true;
              }
            }

            // Kiểm tra gạch chân
            const uElem = rPr.getElementsByTagName('w:u')[0];
            if (uElem) {
              const uVal = uElem.getAttribute('w:val') || 'single';
              if (uVal !== 'none') {
                isUnderline = true;
              }
            }

            // Kiểm tra chỉ số trên / dưới (sub / super)
            const vertAlign = rPr.getElementsByTagName('w:vertAlign')[0];
            if (vertAlign) {
              const vVal = vertAlign.getAttribute('w:val');
              if (vVal === 'superscript') isSuperscript = true;
              if (vVal === 'subscript') isSubscript = true;
            }
          }

          // Lấy nội dung chữ trong run
          const tElems = r.getElementsByTagName('w:t');
          let runText = '';
          for (let k = 0; k < tElems.length; k++) {
            runText += tElems[k].textContent || '';
          }

          if (runText) {
            // Chuyển đổi chỉ số hóa học sang ký tự Unicode đẹp
            if (isSuperscript) {
              runText = toSuperscript(runText);
            } else if (isSubscript) {
              runText = toSubscript(runText);
            }

            // Ghi chú nếu là đáp án tô đỏ hoặc gạch chân theo quy ước đề mẫu
            if (isRed && isUnderline) {
              runText = `${runText} [đỏ gạch chân]`;
              redUnderlineCount++;
            } else if (isRed) {
              runText = `${runText} [đỏ]`;
              redUnderlineCount++;
            } else if (isUnderline) {
              runText = `${runText} [gạch chân]`;
              redUnderlineCount++;
            }

            pText += runText;
          }
        }

        if (pText.trim()) {
          fullText += pText + '\n';
        }
      }

      if (fullText.trim().length > 0) {
        const fontNormalized = autoFixVietnameseFont(fullText);
        return {
          text: fontNormalized.text,
          detectedFontEncoding: fontNormalized.detectedEncoding,
          redUnderlineFound: redUnderlineCount,
          paragraphCount,
          extractedWith: 'jszip_ooxml',
        };
      }
    }
  } catch (zipErr) {
    console.warn('JSZip extraction fallback to mammoth', zipErr);
  }

  // 3. Fallback bằng thư viện mammoth nếu file có định dạng đặc thù
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const fixed = autoFixVietnameseFont(result.value);
    return {
      text: fixed.text,
      detectedFontEncoding: fixed.detectedEncoding,
      redUnderlineFound: 0,
      paragraphCount: fixed.text.split('\n').length,
      extractedWith: 'mammoth',
    };
  } catch (mammothErr) {
    console.error('Mammoth extraction error', mammothErr);
  }

  // 4. Fallback cuối cùng
  const fallbackBuffer = await file.arrayBuffer();
  const textDecoder = new TextDecoder('utf-8', { fatal: false });
  const rawDecoded = textDecoder.decode(fallbackBuffer);
  const fixed = autoFixVietnameseFont(rawDecoded);

  return {
    text: fixed.text,
    detectedFontEncoding: 'UTF-8 (Dự phòng)',
    redUnderlineFound: 0,
    paragraphCount: fixed.text.split('\n').length,
    extractedWith: 'plaintext',
  };
}
