import React, { useState, useEffect } from 'react';
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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Grid,
  Paper,
  Divider,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
  FileDownload as FileDownloadIcon,
  Visibility as VisibilityIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { ExamHistory, SubjectScore, Question, QuestionResult } from '../types/Question';
import { getExamHistory, deleteExamHistory } from '../services/examHistoryService';
import { generateExamResultPDF } from '../utils/pdfUtils';

interface ExamHistoryPageProps {
  onBack: () => void;
}

const ExamHistoryPage: React.FC<ExamHistoryPageProps> = ({ onBack }) => {
  const [examHistory, setExamHistory] = useState<ExamHistory[]>([]);
  const [selectedExam, setSelectedExam] = useState<ExamHistory | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    loadExamHistory();
  }, []);

  const loadExamHistory = () => {
    const history = getExamHistory();
    // 최신 순으로 정렬
    const sortedHistory = history.sort((a, b) => new Date(b.examDate).getTime() - new Date(a.examDate).getTime());
    setExamHistory(sortedHistory);
  };

  const handleDeleteExam = (examId: string) => {
    deleteExamHistory(examId);
    loadExamHistory();
    setShowDeleteDialog(null);
  };

  const handleViewExam = (exam: ExamHistory) => {
    setSelectedExam(exam);
  };

  const handleDownloadPDF = async (exam: ExamHistory) => {
    setIsGeneratingPdf(true);
    try {
      await generateExamResultPDF(
        exam.questions,
        exam.results,
        exam.subjectScores,
        exam.totalScore,
        exam.totalQuestions,
        exam.examDate
      );
    } catch (error) {
      console.error('PDF 생성 실패:', error);
      alert('PDF 다운로드에 실패했습니다.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const getScoreColor = (percentage: number): string => {
    if (percentage >= 80) return '#4CAF50';
    if (percentage >= 60) return '#FF9800';
    return '#F44336';
  };

  const getSubjectDisplayName = (subject: string): string => {
    const subjectNames: Record<string, string> = {
      '서비스경험디자인기획설계': '서비스경험디자인 기획설계',
      '사용자조사분석': '사용자조사분석',
      '사용자중심전략수립': '사용자중심전략수립',
      '서비스경험디자인개발및운영': '서비스경험디자인 개발및운영'
    };
    return subjectNames[subject] || subject;
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}시간 ${minutes}분 ${secs}초`;
    } else if (minutes > 0) {
      return `${minutes}분 ${secs}초`;
    } else {
      return `${secs}초`;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ minHeight: '100vh', py: 4 }}>
      {/* 헤더 */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          variant="outlined"
        >
          홈으로
        </Button>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          <AssessmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          시험 결과 히스토리
        </Typography>
        <Box />
      </Box>

      {/* 통계 요약 */}
      {examHistory.length > 0 && (
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  {examHistory.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  총 시험 횟수
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
                  {Math.round(examHistory.reduce((sum, exam) => sum + exam.totalScore, 0) / examHistory.length)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  평균 점수
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#FF9800' }}>
                  {Math.max(...examHistory.map(exam => exam.totalScore))}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  최고 점수
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2196F3' }}>
                  {formatTime(Math.round(examHistory.reduce((sum, exam) => sum + exam.timeSpent, 0) / examHistory.length))}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  평균 소요 시간
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* 시험 히스토리 목록 */}
      {examHistory.length === 0 ? (
        <Alert severity="info" sx={{ textAlign: 'center' }}>
          <Typography variant="body1">
            아직 시험 기록이 없습니다. 시험을 완료하시면 결과가 여기에 저장됩니다.
          </Typography>
        </Alert>
      ) : (
        <List>
          {examHistory.map((exam, index) => (
            <Paper key={exam.id} elevation={2} sx={{ mb: 2 }}>
              <ListItem sx={{ p: 3 }}>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        시험 #{examHistory.length - index}
                      </Typography>
                      <Chip 
                        label={`${exam.totalScore}점`} 
                        color={exam.totalScore >= 80 ? 'success' : exam.totalScore >= 60 ? 'warning' : 'error'}
                        sx={{ fontWeight: 'bold' }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(exam.examDate)}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Typography variant="body2">
                          총 {exam.totalQuestions}문제 중 {exam.results.filter(r => r.isCorrect).length}문제 정답
                        </Typography>
                        <Typography variant="body2">
                          소요시간: {formatTime(exam.timeSpent)}
                        </Typography>
                      </Box>
                      <Grid container spacing={1}>
                        {exam.subjectScores.map((score, idx) => (
                          <Grid item key={idx}>
                            <Chip
                              size="small"
                              label={`${getSubjectDisplayName(score.subject).substring(0, 8)}... ${score.percentage}%`}
                              sx={{ 
                                backgroundColor: getScoreColor(score.percentage),
                                color: 'white',
                                fontSize: '0.75rem'
                              }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <Box display="flex" gap={1}>
                    <IconButton
                      edge="end"
                      onClick={() => handleViewExam(exam)}
                      color="primary"
                      title="상세 보기"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleDownloadPDF(exam)}
                      color="success"
                      title="PDF 다운로드"
                      disabled={isGeneratingPdf}
                    >
                      <FileDownloadIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => setShowDeleteDialog(exam.id)}
                      color="error"
                      title="삭제"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
            </Paper>
          ))}
        </List>
      )}

      {/* PDF 생성 로딩 */}
      {isGeneratingPdf && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }}>
          <LinearProgress />
          <Alert severity="info" sx={{ borderRadius: 0 }}>
            PDF를 생성하고 있습니다...
          </Alert>
        </Box>
      )}

      {/* 상세 보기 다이얼로그 */}
      <Dialog 
        open={!!selectedExam} 
        onClose={() => setSelectedExam(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedExam && (
          <>
            <DialogTitle>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">
                  시험 결과 상세 - {formatDate(selectedExam.examDate)}
                </Typography>
                <Chip 
                  label={`${selectedExam.totalScore}점`} 
                  color={selectedExam.totalScore >= 80 ? 'success' : selectedExam.totalScore >= 60 ? 'warning' : 'error'}
                  sx={{ fontWeight: 'bold' }}
                />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box mb={3}>
                <Typography variant="h6" gutterBottom>과목별 점수</Typography>
                <Grid container spacing={2}>
                  {selectedExam.subjectScores.map((score, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Card sx={{ 
                        border: `2px solid ${getScoreColor(score.percentage)}`,
                        borderRadius: 2
                      }}>
                        <CardContent sx={{ textAlign: 'center', py: 2 }}>
                          <Typography variant="h5" sx={{ 
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
                            lineHeight: 1.2
                          }}>
                            {getSubjectDisplayName(score.subject)}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box>
                <Typography variant="h6" gutterBottom>
                  틀린 문제 ({selectedExam.questions.filter((_, index) => !selectedExam.results[index]?.isCorrect).length}개)
                </Typography>
                {selectedExam.questions
                  .filter((_, index) => !selectedExam.results[index]?.isCorrect)
                  .slice(0, 3)
                  .map((question, index) => (
                    <Card key={question.id} sx={{ mb: 2, p: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        [{getSubjectDisplayName(question.subject)}]
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        {question.question.length > 100 ? `${question.question.substring(0, 100)}...` : question.question}
                      </Typography>
                    </Card>
                  ))}
                {selectedExam.questions.filter((_, index) => !selectedExam.results[index]?.isCorrect).length > 3 && (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
                    PDF 다운로드로 전체 틀린 문제를 확인하세요
                  </Typography>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleDownloadPDF(selectedExam)} color="primary" variant="contained">
                PDF 다운로드
              </Button>
              <Button onClick={() => setSelectedExam(null)}>닫기</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={!!showDeleteDialog} onClose={() => setShowDeleteDialog(null)}>
        <DialogTitle>시험 결과 삭제</DialogTitle>
        <DialogContent>
          <Typography>이 시험 결과를 삭제하시겠습니까? 삭제된 데이터는 복구할 수 없습니다.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(null)}>취소</Button>
          <Button 
            onClick={() => showDeleteDialog && handleDeleteExam(showDeleteDialog)} 
            color="error"
            variant="contained"
          >
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ExamHistoryPage; 