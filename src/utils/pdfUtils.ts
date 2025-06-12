import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Question, QuestionResult, SubjectScore } from '../types/Question';

// PDF 생성 옵션
interface PDFOptions {
  fileName?: string;
  includeAnswers?: boolean;
  includeExplanations?: boolean;
  includeHints?: boolean;
}

// 시험 결과 PDF 생성
export const generateExamResultPDF = async (
  questions: Question[],
  results: QuestionResult[],
  subjectScores: SubjectScore[],
  totalScore: number,
  totalQuestions: number,
  examDate: Date,
  options: PDFOptions = {}
): Promise<void> => {
  const {
    fileName = `시험결과_${formatDate(examDate)}.pdf`,
    includeAnswers = true,
    includeExplanations = true,
    includeHints = true
  } = options;

  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    let yPosition = 20;
    const pageHeight = pdf.internal.pageSize.height;
    const margin = 20;
    const lineHeight = 7;

    // 폰트 설정 (한글 지원을 위해 기본 폰트 사용)
    pdf.setFont('helvetica');

    // 제목
    pdf.setFontSize(20);
    pdf.text('시험 결과 리포트', margin, yPosition);
    yPosition += 15;

    // 시험 정보
    pdf.setFontSize(12);
    pdf.text(`시험 날짜: ${formatDate(examDate)}`, margin, yPosition);
    yPosition += lineHeight;
    pdf.text(`총 점수: ${totalScore}점 (${totalQuestions}문제 중 ${results.filter(r => r.isCorrect).length}문제 정답)`, margin, yPosition);
    yPosition += lineHeight * 2;

    // 과목별 점수
    pdf.setFontSize(14);
    pdf.text('과목별 점수', margin, yPosition);
    yPosition += lineHeight;

    pdf.setFontSize(10);
    subjectScores.forEach(score => {
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.text(`${getSubjectDisplayName(score.subject)}: ${score.percentage}% (${score.correct}/${score.total})`, margin, yPosition);
      yPosition += lineHeight;
    });

    yPosition += lineHeight;

    // 틀린 문제들
    const wrongQuestions = questions.filter((_, index) => !results[index]?.isCorrect);
    if (wrongQuestions.length > 0) {
      pdf.setFontSize(14);
      pdf.text(`틀린 문제 (${wrongQuestions.length}개)`, margin, yPosition);
      yPosition += lineHeight * 2;

      wrongQuestions.forEach((question, index) => {
        const questionIndex = questions.findIndex(q => q.id === question.id);
        const result = results[questionIndex];

        if (yPosition > pageHeight - 50) {
          pdf.addPage();
          yPosition = margin;
        }

        // 문제 번호와 과목
        pdf.setFontSize(12);
        pdf.text(`${index + 1}. [${getSubjectDisplayName(question.subject)}]`, margin, yPosition);
        yPosition += lineHeight;

        // 문제 내용
        pdf.setFontSize(10);
        const questionLines = pdf.splitTextToSize(question.question, 170);
        questionLines.forEach((line: string) => {
          if (yPosition > pageHeight - 30) {
            pdf.addPage();
            yPosition = margin;
          }
          pdf.text(line, margin, yPosition);
          yPosition += lineHeight;
        });

        yPosition += 3;

        // 선택지
        if (includeAnswers) {
          question.options.forEach((option, optionIndex) => {
            if (yPosition > pageHeight - 30) {
              pdf.addPage();
              yPosition = margin;
            }
            
            const isCorrect = optionIndex === question.correctAnswer;
            const isUserAnswer = optionIndex === result?.userAnswer;
            
            let prefix = `${optionIndex + 1}. `;
            if (isCorrect) prefix += '✓ ';
            if (isUserAnswer && !isCorrect) prefix += '✗ ';

            const optionLines = pdf.splitTextToSize(`${prefix}${option}`, 165);
            optionLines.forEach((line: string) => {
              pdf.text(line, margin + 5, yPosition);
              yPosition += lineHeight;
            });
          });
        }

        // 해설
        if (includeExplanations && question.explanation) {
          yPosition += 3;
          pdf.setFontSize(9);
          pdf.text('해설:', margin, yPosition);
          yPosition += lineHeight;
          
          const explanationLines = pdf.splitTextToSize(question.explanation, 170);
          explanationLines.forEach((line: string) => {
            if (yPosition > pageHeight - 30) {
              pdf.addPage();
              yPosition = margin;
            }
            pdf.text(line, margin + 5, yPosition);
            yPosition += lineHeight;
          });
        }

        // 힌트
        if (includeHints && question.hintText) {
          yPosition += 3;
          pdf.setFontSize(9);
          pdf.text('힌트:', margin, yPosition);
          yPosition += lineHeight;
          
          const hintLines = pdf.splitTextToSize(question.hintText, 170);
          hintLines.forEach((line: string) => {
            if (yPosition > pageHeight - 30) {
              pdf.addPage();
              yPosition = margin;
            }
            pdf.text(line, margin + 5, yPosition);
            yPosition += lineHeight;
          });
        }

        yPosition += lineHeight * 2;
      });
    }

    // PDF 다운로드
    pdf.save(fileName);
  } catch (error) {
    console.error('PDF 생성 실패:', error);
    throw new Error('PDF 생성에 실패했습니다.');
  }
};

// HTML 요소를 PDF로 변환
export const generatePDFFromElement = async (
  elementId: string,
  fileName: string = 'document.pdf'
): Promise<void> => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('요소를 찾을 수 없습니다.');
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 0;

    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save(fileName);
  } catch (error) {
    console.error('PDF 생성 실패:', error);
    throw new Error('PDF 생성에 실패했습니다.');
  }
};

// 날짜 포맷팅
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).replace(/\. /g, '').replace(/\.$/, '');
};

// 과목명 변환
const getSubjectDisplayName = (subject: string): string => {
  const subjectNames: Record<string, string> = {
    '서비스경험디자인기획설계': '서비스경험디자인 기획설계',
    '사용자조사분석': '사용자조사분석',
    '사용자중심전략수립': '사용자중심전략수립',
    '서비스경험디자인개발및운영': '서비스경험디자인 개발및운영'
  };
  return subjectNames[subject] || subject;
}; 