import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  LinearProgress,
  Chip,
  Paper,
  Divider
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Stop as StopIcon
} from '@mui/icons-material';
import { Question, Subject } from '../types/Question';
import { subscribeToQuestions } from '../services/questionService';

interface StudyPageProps {
  onBackToHome: () => void;
}

const StudyPage: React.FC<StudyPageProps> = ({ onBackToHome }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [showStopDialog, setShowStopDialog] = useState(false);

  useEffect(() => {
    // Firebase에서 실시간으로 모든 문제를 구독하여 가져오기
    const unsubscribe = subscribeToQuestions((allQuestions) => {
      console.log('🔄 실시간 데이터 업데이트 - 전체 문제 수:', allQuestions.length);
      
      // 이미지가 있는 문제 확인
      const questionsWithImages = allQuestions.filter(q => q.imageUrl);
      console.log('📷 이미지가 있는 문제:', questionsWithImages.length);
      questionsWithImages.forEach(q => {
        console.log(`문제 ${q.id}: ${q.imageUrl?.substring(0, 50)}...`);
      });
      
      // 문제 섞기 (매번 다른 순서로)
      const shuffledQuestions = [...allQuestions].sort(() => Math.random() - 0.5);
      setQuestions(shuffledQuestions);
    });

    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleShowAnswer = () => {
    if (selectedAnswer !== null) {
      setShowAnswer(true);
      setAnsweredQuestions(prev => new Set(Array.from(prev).concat([currentQuestionIndex])));
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    }
  };

  const handleStopStudy = () => {
    setShowStopDialog(true);
  };

  const handleConfirmStop = () => {
    setShowStopDialog(false);
    onBackToHome();
  };

  const getSubjectDisplayName = (subject: Subject): string => {
    const subjectNames: Record<Subject, string> = {
      '서비스경험디자인기획설계': '서비스경험디자인 기획설계',
      '사용자조사분석': '사용자조사분석',
      '사용자중심전략수립': '사용자중심전략수립',
      '서비스경험디자인개발및운영': '서비스경험디자인 개발및운영'
    };
    return subjectNames[subject];
  };

  const getSubjectColor = (subject: Subject): string => {
    const colors: Record<Subject, string> = {
      '서비스경험디자인기획설계': '#1976d2',
      '사용자조사분석': '#388e3c',
      '사용자중심전략수립': '#f57c00',
      '서비스경험디자인개발및운영': '#7b1fa2'
    };
    return colors[subject];
  };

  if (questions.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ minHeight: '100vh', py: 4 }}>
        <Box textAlign="center">
          <Typography variant="h6">문제를 불러오는 중...</Typography>
          <LinearProgress sx={{ mt: 2 }} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ minHeight: '100vh', py: 4 }}>
      {/* 헤더 */}
      <Box textAlign="center" mb={4}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            color: '#FF9800',
            mb: 2
          }}
        >
          📖 오늘의 공부
        </Typography>
        <Typography variant="h6" color="text.secondary">
          언제든 중단하고 다시 시작할 수 있어요
        </Typography>
      </Box>

      {/* 진행 상황 */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            문제 {currentQuestionIndex + 1} / {questions.length}
          </Typography>
          <Button
            variant="outlined"
            color="error"
            startIcon={<StopIcon />}
            onClick={handleStopStudy}
          >
            공부 중단
          </Button>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ 
            height: 8, 
            borderRadius: 4,
            backgroundColor: '#f0f0f0',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#FF9800'
            }
          }}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {Math.round(progress)}% 완료
        </Typography>
      </Paper>

      {/* 문제 카드 */}
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        {/* 과목 정보 */}
        <Box mb={3}>
          <Chip 
            label={getSubjectDisplayName(currentQuestion.subject)}
            sx={{ 
              backgroundColor: getSubjectColor(currentQuestion.subject),
              color: 'white',
              fontWeight: 'bold'
            }}
          />
        </Box>

        {/* 문제 */}
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          📝 문제
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
          {currentQuestion.question}
        </Typography>

        {/* 문제 이미지 */}
        {currentQuestion.imageUrl && (
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <img 
              src={currentQuestion.imageUrl} 
              alt="문제 이미지" 
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
              onError={(e) => {
                console.error('이미지 로드 실패:', currentQuestion.imageUrl);
                e.currentTarget.style.display = 'none';
              }}
              onLoad={() => {
                console.log('이미지 로드 성공:', currentQuestion.imageUrl?.substring(0, 50));
              }}
            />
          </Box>
        )}

        {/* 선택지 */}
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          📋 선택지
        </Typography>
        <FormControl component="fieldset" fullWidth>
          <RadioGroup
            value={selectedAnswer !== null ? selectedAnswer.toString() : ''}
            onChange={(e) => handleAnswerSelect(parseInt(e.target.value))}
          >
            {currentQuestion.options.map((option, index) => (
              <FormControlLabel
                key={index}
                value={index.toString()}
                control={<Radio />}
                label={
                  <Box sx={{ py: 1 }}>
                    <Typography variant="body1">
                      {index + 1}. {option}
                    </Typography>
                  </Box>
                }
                sx={{
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                  m: 0.5,
                  px: 2,
                  py: 1,
                  '&:hover': {
                    backgroundColor: '#f5f5f5'
                  },
                  ...(showAnswer && {
                    borderColor: index === currentQuestion.correctAnswer 
                      ? '#4CAF50' 
                      : index === selectedAnswer 
                        ? '#F44336' 
                        : '#e0e0e0',
                    backgroundColor: index === currentQuestion.correctAnswer 
                      ? '#E8F5E8' 
                      : index === selectedAnswer && index !== currentQuestion.correctAnswer
                        ? '#FFEBEE' 
                        : 'transparent'
                  })
                }}
              />
            ))}
          </RadioGroup>
        </FormControl>

        {/* 답안 확인 버튼 */}
        {!showAnswer && (
          <Box textAlign="center" mt={3}>
            <Button
              variant="contained"
              size="large"
              onClick={handleShowAnswer}
              disabled={selectedAnswer === null}
              sx={{
                backgroundColor: '#FF9800',
                '&:hover': { backgroundColor: '#F57C00' },
                px: 4,
                py: 1.5
              }}
            >
              답안 확인하기
            </Button>
          </Box>
        )}

        {/* 정답 및 해설 */}
        {showAnswer && (
          <Box mt={4}>
            <Divider sx={{ mb: 3 }} />
            
            {/* 정답 여부 */}
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              {selectedAnswer === currentQuestion.correctAnswer ? (
                <>
                  <CheckCircleIcon sx={{ color: '#4CAF50', fontSize: 32 }} />
                  <Typography variant="h6" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                    정답입니다! 🎉
                  </Typography>
                </>
              ) : (
                <>
                  <CancelIcon sx={{ color: '#F44336', fontSize: 32 }} />
                  <Typography variant="h6" sx={{ color: '#F44336', fontWeight: 'bold' }}>
                    틀렸습니다. 다시 한번 공부해보세요!
                  </Typography>
                </>
              )}
            </Box>

            {/* 정답 표시 */}
            <Typography variant="body1" sx={{ mb: 2, fontWeight: 'bold' }}>
              정답: {currentQuestion.correctAnswer + 1}번 - {currentQuestion.options[currentQuestion.correctAnswer]}
            </Typography>

            {/* 해설 */}
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              💡 해설
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
              {currentQuestion.explanation}
            </Typography>

            {/* 해설 이미지 */}
            {currentQuestion.explanationImageUrl && (
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <img 
                  src={currentQuestion.explanationImageUrl} 
                  alt="해설 이미지" 
                  style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
                  onError={(e) => {
                    console.error('해설 이미지 로드 실패:', currentQuestion.explanationImageUrl);
                    e.currentTarget.style.display = 'none';
                  }}
                  onLoad={() => {
                    console.log('해설 이미지 로드 성공:', currentQuestion.explanationImageUrl?.substring(0, 50));
                  }}
                />
              </Box>
            )}
          </Box>
        )}
      </Paper>

      {/* 네비게이션 버튼 */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Button
          variant="outlined"
          startIcon={<NavigateBeforeIcon />}
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          이전 문제
        </Button>

        <Typography variant="body2" color="text.secondary">
          공부한 문제: {answeredQuestions.size}개
        </Typography>

        <Button
          variant="contained"
          endIcon={<NavigateNextIcon />}
          onClick={handleNextQuestion}
          disabled={currentQuestionIndex === questions.length - 1}
          sx={{
            backgroundColor: '#1976d2',
            '&:hover': { backgroundColor: '#1565c0' }
          }}
        >
          다음 문제
        </Button>
      </Box>

      {/* 중단 확인 다이얼로그 */}
      <Dialog open={showStopDialog} onClose={() => setShowStopDialog(false)}>
        <DialogTitle>🛑 공부를 중단하시겠습니까?</DialogTitle>
        <DialogContent>
          <Typography>
            현재까지 {answeredQuestions.size}개의 문제를 공부했습니다.
            <br />
            중단하시면 홈으로 돌아갑니다.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowStopDialog(false)}>
            계속 공부하기
          </Button>
          <Button onClick={handleConfirmStop} color="error">
            중단하기
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StudyPage; 