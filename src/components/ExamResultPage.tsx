import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Paper
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { Question, QuestionResult, Subject } from '../types/Question';

interface ExamResultPageProps {
  questions: Question[];
  results: QuestionResult[];
  onBackToHome: () => void;
}

interface SubjectScore {
  subject: Subject;
  correct: number;
  total: number;
  percentage: number;
}

const ExamResultPage: React.FC<ExamResultPageProps> = ({ 
  questions, 
  results, 
  onBackToHome 
}) => {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [selectedResult, setSelectedResult] = useState<QuestionResult | null>(null);

  // 과목별 점수 계산
  const calculateSubjectScores = (): SubjectScore[] => {
    const subjectMap = new Map<Subject, { correct: number; total: number }>();
    
    questions.forEach((question, index) => {
      const result = results[index];
      const current = subjectMap.get(question.subject) || { correct: 0, total: 0 };
      
      subjectMap.set(question.subject, {
        correct: current.correct + (result?.isCorrect ? 1 : 0),
        total: current.total + 1
      });
    });

    return Array.from(subjectMap.entries()).map(([subject, data]) => ({
      subject,
      correct: data.correct,
      total: data.total,
      percentage: Math.round((data.correct / data.total) * 100)
    }));
  };

  const subjectScores = calculateSubjectScores();
  const totalCorrect = results.filter(r => r.isCorrect).length;
  const totalQuestions = questions.length;
  const totalPercentage = Math.round((totalCorrect / totalQuestions) * 100);
  const wrongQuestions = questions.filter((_, index) => !results[index]?.isCorrect);

  const handleQuestionClick = (question: Question, result: QuestionResult) => {
    setSelectedQuestion(question);
    setSelectedResult(result);
  };

  const handleCloseDialog = () => {
    setSelectedQuestion(null);
    setSelectedResult(null);
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

  const getScoreColor = (percentage: number): string => {
    if (percentage >= 80) return '#4CAF50';
    if (percentage >= 60) return '#FF9800';
    return '#F44336';
  };

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
            color: '#1976d2',
            mb: 2
          }}
        >
          🎯 시험 결과
        </Typography>
        <Typography variant="h6" color="text.secondary">
          시험이 완료되었습니다
        </Typography>
      </Box>

      {/* 총 점수 */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box textAlign="center">
          <Typography variant="h3" sx={{ 
            fontWeight: 'bold', 
            color: getScoreColor(totalPercentage),
            mb: 2
          }}>
            {totalPercentage}점
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            {totalCorrect}/{totalQuestions}문제 정답
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={totalPercentage} 
            sx={{ 
              height: 10, 
              borderRadius: 5,
              backgroundColor: '#f0f0f0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: getScoreColor(totalPercentage)
              }
            }}
          />
        </Box>
      </Paper>

      {/* 과목별 점수 */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          📊 과목별 점수
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={2}>
          {subjectScores.map((score, index) => (
            <Box key={index} sx={{ flex: '1 1 200px', minWidth: '200px' }}>
              <Card sx={{ 
                height: '100%',
                border: `2px solid ${getScoreColor(score.percentage)}`,
                borderRadius: 2
              }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 'bold', 
                    color: getScoreColor(score.percentage),
                    mb: 1
                  }}>
                    {score.percentage}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {score.correct}/{score.total}문제
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    fontSize: '0.75rem',
                    lineHeight: 1.2,
                    display: 'block'
                  }}>
                    {getSubjectDisplayName(score.subject)}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* 틀린 문제 */}
      {wrongQuestions.length > 0 && (
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            ❌ 틀린 문제 ({wrongQuestions.length}개)
          </Typography>
          <List>
            {wrongQuestions.map((question, index) => {
              const questionIndex = questions.findIndex(q => q.id === question.id);
              const result = results[questionIndex];
              return (
                <React.Fragment key={question.id}>
                  <ListItem 
                    onClick={() => handleQuestionClick(question, result)}
                    sx={{ 
                      border: '1px solid #f0f0f0',
                      borderRadius: 2,
                      mb: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '#f5f5f5'
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#F44336' }}>
                        {questionIndex + 1}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {getSubjectDisplayName(question.subject)}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {question.question.substring(0, 100)}...
                        </Typography>
                      }
                    />
                    <Chip 
                      label="상세보기" 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  </ListItem>
                  {index < wrongQuestions.length - 1 && <Divider />}
                </React.Fragment>
              );
            })}
          </List>
        </Paper>
      )}

      {/* 액션 버튼 */}
      <Box textAlign="center">
        <Button
          variant="contained"
          size="large"
          onClick={onBackToHome}
          startIcon={<HomeIcon />}
          sx={{
            backgroundColor: '#1976d2',
            '&:hover': { backgroundColor: '#1565c0' },
            px: 4,
            py: 1.5
          }}
        >
          홈으로 돌아가기
        </Button>
      </Box>

      {/* 문제 상세 다이얼로그 */}
      <Dialog 
        open={Boolean(selectedQuestion)} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedQuestion && selectedResult && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
                  문제 {questions.findIndex(q => q.id === selectedQuestion.id) + 1}번
                </Typography>
                <Chip 
                  icon={<CancelIcon />}
                  label="오답" 
                  color="error" 
                  variant="outlined"
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {getSubjectDisplayName(selectedQuestion.subject)}
              </Typography>
            </DialogTitle>
            <DialogContent>
              {/* 문제 */}
              <Box mb={3}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  📝 문제
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                  {selectedQuestion.question}
                </Typography>
                {selectedQuestion.imageUrl && (
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <img 
                      src={selectedQuestion.imageUrl} 
                      alt="문제 이미지" 
                      style={{ maxWidth: '100%', height: 'auto' }}
                    />
                  </Box>
                )}
              </Box>

              {/* 선택지 */}
              <Box mb={3}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  📋 선택지
                </Typography>
                {selectedQuestion.options.map((option, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      p: 1.5,
                      mb: 1,
                      border: '1px solid',
                      borderRadius: 1,
                      borderColor: index === selectedQuestion.correctAnswer 
                        ? '#4CAF50' 
                        : index === selectedResult.userAnswer 
                          ? '#F44336' 
                          : '#e0e0e0',
                      backgroundColor: index === selectedQuestion.correctAnswer 
                        ? '#E8F5E8' 
                        : index === selectedResult.userAnswer 
                          ? '#FFEBEE' 
                          : 'transparent'
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {index + 1}.
                      </Typography>
                      <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        {option}
                      </Typography>
                      {index === selectedQuestion.correctAnswer && (
                        <Chip icon={<CheckCircleIcon />} label="정답" size="small" color="success" />
                      )}
                      {index === selectedResult.userAnswer && index !== selectedQuestion.correctAnswer && (
                        <Chip icon={<CancelIcon />} label="선택" size="small" color="error" />
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>

              {/* 해설 */}
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  💡 해설
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                  {selectedQuestion.explanation}
                </Typography>
                {selectedQuestion.explanationImageUrl && (
                  <Box sx={{ textAlign: 'center' }}>
                    <img 
                      src={selectedQuestion.explanationImageUrl} 
                      alt="해설 이미지" 
                      style={{ maxWidth: '100%', height: 'auto' }}
                    />
                  </Box>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                닫기
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default ExamResultPage; 