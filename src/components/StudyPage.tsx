import React, { useState, useEffect, useCallback } from 'react';
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
  Divider,
  Collapse,
  Card,
  CardContent,
  Alert
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Stop as StopIcon,
  Lightbulb as LightbulbIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  PlayArrow as PlayArrowIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { Question, Subject } from '../types/Question';
import { subscribeToQuestions } from '../services/questionService';
import { 
  saveStudySession, 
  getStudySession, 
  clearStudySession, 
  updateStudySessionActivity 
} from '../services/examHistoryService';

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
  const [showHint, setShowHint] = useState(false);
  const [isSessionRecovered, setIsSessionRecovered] = useState(false);
  const [showContinueDialog, setShowContinueDialog] = useState(false);
  const [savedSession, setSavedSession] = useState<any>(null);

  // 공부 세션 저장
  const saveCurrentStudySession = useCallback(() => {
    if (questions.length === 0) return;

    const session = {
      questions,
      currentQuestionIndex,
      answeredQuestions: Array.from(answeredQuestions),
      startTime: new Date(),
      lastActiveTime: new Date()
    };
    saveStudySession(session);
  }, [questions, currentQuestionIndex, answeredQuestions]);

  // 정기적으로 세션 저장 (30초마다)
  useEffect(() => {
    if (questions.length === 0 || !isSessionRecovered) return;

    const autoSaveInterval = setInterval(() => {
      saveCurrentStudySession();
      updateStudySessionActivity();
    }, 30000); // 30초마다

    return () => clearInterval(autoSaveInterval);
  }, [saveCurrentStudySession, isSessionRecovered, questions.length]);

  // 페이지 나가기 전 저장
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (questions.length > 0) {
        saveCurrentStudySession();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveCurrentStudySession]);

  useEffect(() => {
    // Firebase에서 실시간으로 모든 문제를 구독하여 가져오기
    const unsubscribe = subscribeToQuestions(async (allQuestions) => {
      console.log('🔄 실시간 데이터 업데이트 - 전체 문제 수:', allQuestions.length);
      
      // 이미지가 있는 문제 확인
      const questionsWithImages = allQuestions.filter(q => q.imageUrl);
      console.log('📷 이미지가 있는 문제:', questionsWithImages.length);
      questionsWithImages.forEach(q => {
        console.log(`문제 ${q.id}: ${q.imageUrl?.substring(0, 50)}...`);
      });
      
      // 저장된 세션이 있는지 확인
      const savedStudySession = await getStudySession();
      
      if (savedStudySession && savedStudySession.questions.length > 0) {
        console.log('📖 저장된 공부 세션 발견!');
        setSavedSession(savedStudySession);
        setShowContinueDialog(true);
        
        // 임시로 새 문제들 설정 (사용자가 선택할 때까지)
        const shuffledQuestions = [...allQuestions].sort(() => Math.random() - 0.5);
        setQuestions(shuffledQuestions);
      } else {
        // 저장된 세션이 없으면 새로 시작
        const shuffledQuestions = [...allQuestions].sort(() => Math.random() - 0.5);
        setQuestions(shuffledQuestions);
        setIsSessionRecovered(true);
      }
    });

    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // 저장된 세션 이어서 하기
  const handleContinueStudy = () => {
    if (savedSession) {
      setQuestions(savedSession.questions);
      setCurrentQuestionIndex(savedSession.currentQuestionIndex);
      setAnsweredQuestions(new Set(savedSession.answeredQuestions));
      setShowContinueDialog(false);
      setIsSessionRecovered(true);
      console.log('📖 공부 세션 복구 완료!');
    }
  };

  // 새로 시작하기
  const handleStartNewStudy = () => {
    clearStudySession();
    setShowContinueDialog(false);
    setIsSessionRecovered(true);
    console.log('🆕 새로운 공부 시작!');
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  // 디버깅: 현재 문제의 힌트 데이터 확인
  React.useEffect(() => {
    if (currentQuestion) {
      console.log('🔍 현재 문제 데이터:', {
        id: currentQuestion.id,
        subject: currentQuestion.subject,
        hintText: currentQuestion.hintText || '(없음)',
        hintImageUrl: currentQuestion.hintImageUrl || '(없음)',
        hasHint: !!(currentQuestion.hintText || currentQuestion.hintImageUrl)
      });
    }
  }, [currentQuestion]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleShowAnswer = () => {
    if (selectedAnswer !== null) {
      setShowAnswer(true);
      const newAnsweredQuestions = new Set(Array.from(answeredQuestions).concat([currentQuestionIndex]));
      setAnsweredQuestions(newAnsweredQuestions);
      
      // 답안 확인 후 세션 저장
      setTimeout(() => {
        saveCurrentStudySession();
      }, 100);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
      setShowHint(false);
      
      // 다음 문제로 이동 후 세션 저장
      setTimeout(() => {
        saveCurrentStudySession();
      }, 100);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
      setShowHint(false);
      
      // 이전 문제로 이동 후 세션 저장
      setTimeout(() => {
        saveCurrentStudySession();
      }, 100);
    }
  };

  const handleToggleHint = () => {
    setShowHint(prev => !prev);
  };

  const handleStopStudy = () => {
    setShowStopDialog(true);
  };

  const handleConfirmStop = () => {
    // 공부 중단 시 현재 진행 상황 저장
    saveCurrentStudySession();
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

        {/* 힌트 버튼과 답안 확인 버튼 */}
        {!showAnswer && (
          <Box display="flex" justifyContent="center" alignItems="center" gap={2} mt={3}>
            {/* 힌트 버튼 */}
            <Button
              variant="outlined"
              startIcon={<LightbulbIcon />}
              endIcon={showHint ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              onClick={handleToggleHint}
              disabled={!(currentQuestion.hintText || currentQuestion.hintImageUrl)}
              sx={{
                borderColor: (currentQuestion.hintText || currentQuestion.hintImageUrl) ? '#FFC107' : '#E0E0E0',
                color: (currentQuestion.hintText || currentQuestion.hintImageUrl) ? '#FFC107' : '#9E9E9E',
                px: 3,
                py: 1.5,
                '&:hover': {
                  borderColor: (currentQuestion.hintText || currentQuestion.hintImageUrl) ? '#FFB300' : '#E0E0E0',
                  backgroundColor: (currentQuestion.hintText || currentQuestion.hintImageUrl) ? 'rgba(255, 193, 7, 0.04)' : 'transparent'
                }
              }}
            >
              힌트 {showHint ? '숨기기' : '보기'}
              {!(currentQuestion.hintText || currentQuestion.hintImageUrl) && ' (없음)'}
            </Button>
            
            {/* 답안 확인 버튼 */}
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

        {/* 힌트 영역 */}
        <Collapse in={showHint}>
          <Card sx={{ mt: 3, backgroundColor: '#FFFEF7', border: '1px solid #FFC107' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <LightbulbIcon sx={{ color: '#FFC107' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FF8F00' }}>
                  💡 힌트
                </Typography>
              </Box>
              
              {currentQuestion.hintText ? (
                <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                  {currentQuestion.hintText}
                </Typography>
              ) : (
                <Typography variant="body2" sx={{ mb: 2, color: '#9E9E9E', fontStyle: 'italic' }}>
                  이 문제에는 텍스트 힌트가 없습니다.
                </Typography>
              )}
              
              {currentQuestion.hintImageUrl ? (
                <Box sx={{ textAlign: 'center' }}>
                  <img 
                    src={currentQuestion.hintImageUrl} 
                    alt="힌트 이미지" 
                    style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
                    onError={(e) => {
                      console.error('힌트 이미지 로드 실패:', currentQuestion.hintImageUrl);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </Box>
              ) : (
                <Typography variant="body2" sx={{ color: '#9E9E9E', fontStyle: 'italic', textAlign: 'center' }}>
                  이 문제에는 이미지 힌트가 없습니다.
                </Typography>
              )}
              
              {!(currentQuestion.hintText || currentQuestion.hintImageUrl) && (
                <Typography variant="body1" sx={{ textAlign: 'center', color: '#FF8F00', fontWeight: 'bold' }}>
                  이 문제에는 아직 힌트가 등록되지 않았습니다.<br />
                  문제은행에서 힌트를 추가할 수 있습니다.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Collapse>

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

      {/* 세션 복구 다이얼로그 */}
      <Dialog open={showContinueDialog} onClose={() => {}} disableEscapeKeyDown>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <PlayArrowIcon color="primary" />
            📖 이전 공부 이어서 하기
          </Box>
        </DialogTitle>
        <DialogContent>
          {savedSession && (
            <>
              <Alert severity="info" sx={{ mb: 2 }}>
                저장된 공부 세션이 있습니다!
              </Alert>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>진행 상황:</strong> {savedSession.currentQuestionIndex + 1} / {savedSession.questions.length} 문제
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>답안 확인한 문제:</strong> {savedSession.answeredQuestions.length}개
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                마지막 활동: {new Date(savedSession.lastActiveTime).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • 이어서 하기: {savedSession.answeredQuestions.includes(savedSession.currentQuestionIndex) ? 
                  `${savedSession.currentQuestionIndex + 2}번` : `${savedSession.currentQuestionIndex + 1}번`} 문제부터 시작
                <br />
                • 새로 시작: 문제를 다시 섞어서 1번부터 시작
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleStartNewStudy} 
            startIcon={<RefreshIcon />}
            variant="outlined"
          >
            새로 시작하기
          </Button>
          <Button 
            onClick={handleContinueStudy} 
            startIcon={<PlayArrowIcon />}
            variant="contained"
            sx={{ backgroundColor: '#FF9800', '&:hover': { backgroundColor: '#F57C00' } }}
          >
            이어서 하기
          </Button>
        </DialogActions>
      </Dialog>

      {/* 중단 확인 다이얼로그 */}
      <Dialog open={showStopDialog} onClose={() => setShowStopDialog(false)}>
        <DialogTitle>🛑 공부를 중단하시겠습니까?</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            현재까지 {answeredQuestions.size}개의 문제를 공부했습니다.
          </Typography>
          <Alert severity="info">
            진행 상황이 자동으로 저장되어, 다음에 이어서 공부할 수 있습니다.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowStopDialog(false)}>
            계속 공부하기
          </Button>
          <Button onClick={handleConfirmStop} color="error">
            저장하고 중단하기
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StudyPage; 