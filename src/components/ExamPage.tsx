import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  RadioGroup,
  FormControlLabel,
  Radio,
  LinearProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper
} from '@mui/material';
import {
  Timer as TimerIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { Question, QuestionResult } from '../types/Question';

interface ExamPageProps {
  questions: Question[];
  onExamComplete: (results: QuestionResult[]) => void;
  onBackToHome: () => void;
}

const ExamPage: React.FC<ExamPageProps> = ({ questions, onExamComplete, onBackToHome }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<Date>(new Date());
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [timer, setTimer] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // 타이머 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(Math.floor((new Date().getTime() - questionStartTime.getTime()) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [questionStartTime]);

  // 새 문제 시작 시 타이머 초기화
  useEffect(() => {
    setQuestionStartTime(new Date());
    setTimer(0);
  }, [currentQuestionIndex]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAnswer(parseInt(event.target.value));
  };

  const handleConfirm = () => {
    if (selectedAnswer === null) return;

    const timeSpent = Math.floor((new Date().getTime() - questionStartTime.getTime()) / 1000);
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    const result: QuestionResult = {
      questionId: currentQuestion.id,
      userAnswer: selectedAnswer,
      isCorrect,
      timeSpent
    };

    setResults(prev => [...prev, result]);
    setShowResult(true);
  };

  const handleNext = () => {
    setShowResult(false);
    setSelectedAnswer(null);

    if (currentQuestionIndex + 1 >= questions.length) {
      // 시험 완료
      onExamComplete(results);
    } else {
      // 다음 문제로
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const getCurrentResult = (): QuestionResult | null => {
    return results[results.length - 1] || null;
  };

  if (!currentQuestion) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* 헤더 */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBackToHome}
          variant="outlined"
        >
          홈으로
        </Button>
        
        <Box display="flex" alignItems="center" gap={2}>
          <TimerIcon color="primary" />
          <Typography variant="h6" color="primary">
            {formatTime(timer)}
          </Typography>
        </Box>
      </Box>

      {/* 진행률 */}
      <Box mb={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="body2" color="text.secondary">
            문제 {currentQuestionIndex + 1} / {questions.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {progress.toFixed(1)}%
          </Typography>
        </Box>
        <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
      </Box>

      {/* 문제 카드 */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 4 }}>
          {/* 과목명 */}
          <Chip 
            label={currentQuestion.subject} 
            color="primary" 
            sx={{ mb: 3 }}
          />

          {/* 문제 */}
          <Typography variant="h6" component="h2" mb={4} lineHeight={1.6}>
            {currentQuestion.question}
          </Typography>

          {/* 문제 이미지 표시 */}
          {currentQuestion.imageUrl && (
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <img 
                src={currentQuestion.imageUrl} 
                alt="문제 이미지" 
                style={{ 
                  maxWidth: '100%', 
                  height: 'auto',
                  borderRadius: 8,
                  border: '1px solid #e0e0e0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              />
            </Box>
          )}

          {/* 보기 */}
          <RadioGroup
            value={selectedAnswer?.toString() || ''}
            onChange={handleAnswerChange}
          >
            {currentQuestion.options.map((option, index) => (
              <FormControlLabel
                key={index}
                value={index.toString()}
                control={<Radio />}
                label={
                  <Typography variant="body1" sx={{ py: 1 }}>
                    {index + 1}. {option}
                  </Typography>
                }
                sx={{
                  mb: 1,
                  p: 1,
                  borderRadius: 1,
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
              />
            ))}
          </RadioGroup>

          {/* 확인 버튼 */}
          <Box mt={4} textAlign="center">
            <Button
              variant="contained"
              size="large"
              onClick={handleConfirm}
              disabled={selectedAnswer === null || showResult}
              sx={{ minWidth: 120 }}
            >
              확인
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* 결과 표시 다이얼로그 */}
      <Dialog open={showResult} onClose={() => {}} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            {getCurrentResult()?.isCorrect ? (
              <>
                <CheckCircleIcon color="success" />
                <Typography variant="h6" color="success.main">정답입니다!</Typography>
              </>
            ) : (
              <>
                <CancelIcon color="error" />
                <Typography variant="h6" color="error.main">오답입니다.</Typography>
              </>
            )}
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {/* 문제 내용 다시 표시 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              문제:
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {currentQuestion.question}
            </Typography>
            
            {/* 결과 다이얼로그에서도 이미지 표시 */}
            {currentQuestion.imageUrl && (
              <Box sx={{ mb: 2, textAlign: 'center' }}>
                <img 
                  src={currentQuestion.imageUrl} 
                  alt="문제 이미지" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: 200,
                    borderRadius: 4,
                    border: '1px solid #e0e0e0'
                  }}
                />
              </Box>
            )}
          </Box>

          <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
            <Typography variant="subtitle2" gutterBottom>
              정답: {currentQuestion.correctAnswer + 1}번
            </Typography>
            <Typography variant="body2">
              {currentQuestion.options[currentQuestion.correctAnswer]}
            </Typography>
          </Paper>

          <Typography variant="subtitle2" gutterBottom>
            해설:
          </Typography>
          <Typography variant="body2" color="text.secondary" lineHeight={1.6} sx={{ mb: 2 }}>
            {currentQuestion.explanation}
          </Typography>

          {/* 해설 이미지 표시 */}
          {currentQuestion.explanationImageUrl && (
            <Box sx={{ mb: 2, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                해설 이미지
              </Typography>
              <img 
                src={currentQuestion.explanationImageUrl} 
                alt="해설 이미지" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: 200,
                  borderRadius: 4,
                  border: '1px solid #e0e0e0'
                }}
              />
            </Box>
          )}

          <Box mt={2} textAlign="center">
            <Typography variant="caption" color="text.secondary">
              소요 시간: {formatTime(getCurrentResult()?.timeSpent || 0)}
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleNext} variant="contained" fullWidth>
            {currentQuestionIndex + 1 >= questions.length ? '시험 완료' : '다음 문제'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ExamPage; 