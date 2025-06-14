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

// 시험 결과 PDF 생성 (HTML을 이미지로 변환하여 한글 지원)
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
    // 입력 데이터 검증
    if (!questions || !results || questions.length === 0) {
      throw new Error('시험 데이터가 없습니다.');
    }

    console.log('📄 PDF 생성 시작:', {
      questionsCount: questions.length,
      resultsCount: results.length,
      totalScore,
      totalQuestions
    });

    // HTML 요소 생성
    const htmlContent = createExamResultHTML(
      questions,
      results,
      subjectScores,
      totalScore,
      totalQuestions,
      examDate,
      { includeAnswers, includeExplanations, includeHints }
    );

    // 임시 div 생성
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    tempDiv.style.position = 'fixed';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0';
    tempDiv.style.width = '800px';
    tempDiv.style.backgroundColor = 'white';
    tempDiv.style.padding = '20px';
    tempDiv.style.fontFamily = 'Arial, sans-serif, "맑은 고딕", "Malgun Gothic", "돋움", Dotum';
    tempDiv.style.fontSize = '14px';
    tempDiv.style.lineHeight = '1.6';
    tempDiv.style.color = '#333';
    tempDiv.style.zIndex = '-1000';
    
    document.body.appendChild(tempDiv);

    // 렌더링 완료를 위한 대기
    await new Promise(resolve => setTimeout(resolve, 100));

    console.log('🖼️ Canvas 생성 시작');

    // HTML을 canvas로 변환 (더 안전한 옵션들)
    const canvas = await html2canvas(tempDiv, {
      scale: 1.5,
      useCORS: false,
      allowTaint: false,
      backgroundColor: '#ffffff',
      width: 800,
      height: tempDiv.scrollHeight || 1200,
      scrollX: 0,
      scrollY: 0,
      ignoreElements: (element) => {
        // 이미지 요소나 외부 리소스 무시
        return element.tagName === 'IMG' || element.tagName === 'VIDEO';
      },
      onclone: (clonedDoc) => {
        // 클론된 문서에서 외부 이미지 제거
        const images = clonedDoc.querySelectorAll('img');
        images.forEach(img => {
          img.style.display = 'none';
        });
      }
    });

    console.log('🖼️ Canvas 생성 완료:', {
      width: canvas.width,
      height: canvas.height
    });

    // 임시 div 제거
    document.body.removeChild(tempDiv);

    // Canvas가 비어있는지 확인
    if (canvas.width === 0 || canvas.height === 0) {
      throw new Error('Canvas 생성에 실패했습니다.');
    }

    // PDF 생성
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Canvas를 PNG로 변환 (품질 개선)
    let imgData: string;
    try {
      imgData = canvas.toDataURL('image/png', 0.95);
    } catch (canvasError) {
      console.error('Canvas toDataURL 실패:', canvasError);
      throw new Error('이미지 변환에 실패했습니다.');
    }

    // 이미지 데이터 검증
    if (!imgData || imgData === 'data:,') {
      throw new Error('이미지 데이터가 생성되지 않았습니다.');
    }

    console.log('📄 PDF에 이미지 추가');

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    // 이미지 크기를 PDF에 맞게 조정
    const mmPerPixel = 0.264583; // 1px = 0.264583mm (96dpi 기준)
    const scaledWidth = Math.min(pdfWidth - 20, (imgWidth * mmPerPixel));
    const scaledHeight = (imgHeight * mmPerPixel) * (scaledWidth / (imgWidth * mmPerPixel));
    
    // 한 페이지에 들어가는지 확인
    if (scaledHeight <= pdfHeight - 20) {
      // 한 페이지에 모두 들어감
      pdf.addImage(
        imgData,
        'PNG',
        10, // x position
        10, // y position
        scaledWidth,
        scaledHeight
      );
    } else {
      // 여러 페이지로 나누기
      const pageHeight = pdfHeight - 20; // 여백 고려
      let remainingHeight = scaledHeight;
      let pageNum = 0;
      let sourceY = 0;

      while (remainingHeight > 0) {
        if (pageNum > 0) {
          pdf.addPage();
        }

        const heightForThisPage = Math.min(pageHeight, remainingHeight);
        const sourceHeight = (heightForThisPage / scaledHeight) * imgHeight;
        
        // 페이지별로 잘라서 추가
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = imgWidth;
        pageCanvas.height = sourceHeight;
        const pageCtx = pageCanvas.getContext('2d');
        
        if (pageCtx) {
          pageCtx.drawImage(canvas, 0, sourceY, imgWidth, sourceHeight, 0, 0, imgWidth, sourceHeight);
          const pageImgData = pageCanvas.toDataURL('image/png', 0.95);
          
          pdf.addImage(
            pageImgData,
            'PNG',
            10,
            10,
            scaledWidth,
            heightForThisPage
          );
        }

        remainingHeight -= heightForThisPage;
        sourceY += sourceHeight;
        pageNum++;
      }
    }

    console.log('💾 PDF 저장:', fileName);

    // PDF 다운로드
    pdf.save(fileName);
    
    console.log('✅ PDF 생성 완료');
  } catch (error) {
    console.error('❌ PDF 생성 실패:', error);
    throw new Error(`PDF 생성에 실패했습니다: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// HTML 콘텐츠 생성 함수
const createExamResultHTML = (
  questions: Question[],
  results: QuestionResult[],
  subjectScores: SubjectScore[],
  totalScore: number,
  totalQuestions: number,
  examDate: Date,
  options: { includeAnswers: boolean; includeExplanations: boolean; includeHints: boolean }
): string => {
  // 데이터 안전성 확인
  const safeQuestions = questions || [];
  const safeResults = results || [];
  const safeSubjectScores = subjectScores || [];
  
  const wrongQuestions = safeQuestions.filter((_, index) => !safeResults[index]?.isCorrect);
  const correctCount = safeResults.filter(r => r?.isCorrect).length;

  return `
    <div style="font-family: 'Arial', 'Malgun Gothic', '맑은 고딕', sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
      <!-- 제목 -->
      <h1 style="text-align: center; color: #1976d2; margin-bottom: 30px; font-size: 28px;">
        🎯 시험 결과 리포트
      </h1>
      
      <!-- 시험 정보 -->
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h2 style="color: #333; margin-bottom: 15px; font-size: 18px;">📊 시험 정보</h2>
        <p><strong>시험 날짜:</strong> ${formatDate(examDate)}</p>
        <p><strong>총 점수:</strong> ${totalScore}점</p>
        <p><strong>정답률:</strong> ${correctCount}/${totalQuestions}문제 (${totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0}%)</p>
        <p><strong>소요 시간:</strong> ${Math.floor(safeResults.reduce((sum, result) => sum + (result?.timeSpent || 0), 0) / 60)}분 ${safeResults.reduce((sum, result) => sum + (result?.timeSpent || 0), 0) % 60}초</p>
      </div>

      <!-- 과목별 점수 -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; margin-bottom: 15px; font-size: 18px;">📚 과목별 점수</h2>
        ${safeSubjectScores.map(score => `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #eee;">
            <span style="font-weight: bold; color: #1976d2;">${getSubjectDisplayName(score?.subject || '')}</span>
            <span style="color: ${(score?.percentage || 0) >= 80 ? '#4CAF50' : (score?.percentage || 0) >= 60 ? '#FF9800' : '#F44336'}; font-weight: bold;">
              ${score?.percentage || 0}% (${score?.correct || 0}/${score?.total || 0})
            </span>
          </div>
        `).join('')}
      </div>

      ${wrongQuestions.length > 0 ? `
        <!-- 틀린 문제들 -->
        <div style="margin-bottom: 30px;">
          <h2 style="color: #F44336; margin-bottom: 15px; font-size: 18px;">❌ 틀린 문제 (${wrongQuestions.length}개)</h2>
          ${wrongQuestions.map((question, index) => {
            const questionIndex = safeQuestions.findIndex(q => q?.id === question?.id);
            const result = safeResults[questionIndex];
            
            return `
              <div style="border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 20px; background-color: #fafafa;">
                <div style="margin-bottom: 10px;">
                  <span style="background-color: #F44336; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                    ${getSubjectDisplayName(question?.subject || '')}
                  </span>
                </div>
                
                <h3 style="color: #333; margin-bottom: 15px; font-size: 16px;">
                  ${index + 1}. ${question?.question || '문제 내용 없음'}
                </h3>

                ${options.includeAnswers ? `
                  <div style="margin-bottom: 15px;">
                    <h4 style="color: #666; font-size: 14px; margin-bottom: 10px;">선택지:</h4>
                    ${(question?.options || []).map((option, optionIndex) => {
                      const isCorrect = optionIndex === (question?.correctAnswer ?? -1);
                      const isUserAnswer = optionIndex === (result?.userAnswer ?? -1);
                      let bgColor = '#ffffff';
                      let textColor = '#333';
                      let prefix = '';
                      
                      if (isCorrect) {
                        bgColor = '#e8f5e8';
                        textColor = '#2e7d32';
                        prefix = '✅ ';
                      } else if (isUserAnswer) {
                        bgColor = '#ffebee';
                        textColor = '#d32f2f';
                        prefix = '❌ ';
                      }
                      
                      return `
                        <div style="padding: 8px 12px; margin: 5px 0; border-radius: 4px; background-color: ${bgColor}; color: ${textColor};">
                          ${prefix}${optionIndex + 1}. ${option}
                        </div>
                      `;
                    }).join('')}
                  </div>
                ` : ''}

                ${options.includeExplanations && question?.explanation ? `
                  <div style="margin-bottom: 15px;">
                    <h4 style="color: #1976d2; font-size: 14px; margin-bottom: 10px;">💡 해설:</h4>
                    <div style="background-color: #e3f2fd; padding: 12px; border-radius: 4px; color: #0d47a1;">
                      ${question.explanation}
                    </div>
                  </div>
                ` : ''}

                ${options.includeHints && question?.hintText ? `
                  <div style="margin-bottom: 15px;">
                    <h4 style="color: #FF9800; font-size: 14px; margin-bottom: 10px;">💡 힌트:</h4>
                    <div style="background-color: #fff3e0; padding: 12px; border-radius: 4px; color: #e65100;">
                      ${question.hintText}
                    </div>
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      ` : `
        <div style="text-align: center; padding: 40px; background-color: #e8f5e8; border-radius: 8px; color: #2e7d32;">
          <h2 style="margin-bottom: 10px;">🎉 완벽한 점수입니다!</h2>
          <p>모든 문제를 정답으로 맞히셨습니다.</p>
        </div>
      `}

      <!-- 푸터 -->
      <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #1976d2; color: #666;">
        <p>서비스디자인 자격시험 대비 시스템</p>
        <p style="font-size: 12px;">생성일: ${new Date().toLocaleString('ko-KR')}</p>
      </div>
    </div>
  `;
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
  }).replace(/\. /g, ' ').replace(/\.$/, '');
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