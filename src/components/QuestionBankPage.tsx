import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  Chip,
  Card,
  CardContent,
  InputAdornment,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Add,
  Delete,
  Image,
  Search,
  Sync,
  CloudOff,
  Refresh,
  Lightbulb as LightbulbIcon
} from '@mui/icons-material';
import { Question, Subject } from '../types/Question';
import { 
  addQuestion,
  updateQuestion,
  deleteQuestion,
  subscribeToQuestions,
  initializeFirestoreData,
  fullSync,
  clearAllCaches,
  forceRefreshFromFirebase
} from '../services/questionService';
import { useAuth } from '../contexts/AuthContext';

interface QuestionBankPageProps {
  onBack: () => void;
}

const QuestionBankPage: React.FC<QuestionBankPageProps> = ({ onBack }) => {
  const { isAdmin } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Partial<Question>>({});
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [explanationImageFile, setExplanationImageFile] = useState<File | null>(null);
  const [explanationImagePreview, setExplanationImagePreview] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hintImageFile, setHintImageFile] = useState<File | null>(null);
  const [hintImagePreview, setHintImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [snackbar, setSnackbar] = useState<{open: boolean; message: string; severity: 'success' | 'error' | 'warning'}>({
    open: false, message: '', severity: 'success'
  });

  const subjects: Subject[] = [
    '서비스경험디자인기획설계',
    '사용자조사분석',
    '사용자중심전략수립',
    '서비스경험디자인개발및운영'
  ];

  // 함수 선언
  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSync = useCallback(async () => {
    try {
      setSaving(true);
      await fullSync();
      showSnackbar('양방향 동기화가 성공적으로 완료되었습니다.', 'success');
    } catch (error) {
      console.error('동기화 실패:', error);
      showSnackbar('동기화에 실패했습니다.', 'error');
    } finally {
      setSaving(false);
    }
  }, []);

  const handleForceRefresh = useCallback(async () => {
    try {
      setSaving(true);
      const latestQuestions = await forceRefreshFromFirebase();
      setQuestions(latestQuestions);
      showSnackbar(`최신 데이터 ${latestQuestions.length}개 문제를 강제로 가져왔습니다.`, 'success');
    } catch (error) {
      console.error('강제 새로고침 실패:', error);
      showSnackbar('강제 새로고침에 실패했습니다.', 'error');
    } finally {
      setSaving(false);
    }
  }, []);

  const handleClearCache = useCallback(() => {
    if (window.confirm('모든 캐시를 지우고 페이지를 새로고침하시겠습니까?\n\n⚠️ 저장되지 않은 작업이 있다면 먼저 동기화를 해주세요.')) {
      clearAllCaches();
    }
  }, []);

  // 네트워크 상태 감지
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showSnackbar('네트워크가 연결되었습니다. 데이터를 동기화합니다.', 'success');
      handleSync();
    };

    const handleOffline = () => {
      setIsOnline(false);
      showSnackbar('네트워크 연결이 끊어졌습니다. 로컬에서 작업을 계속합니다.', 'warning');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleSync]);

  // 초기 데이터 로드 및 실시간 구독
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initializeData = async () => {
      try {
        setLoading(true);
        
        // Firebase 초기화
        await initializeFirestoreData();
        
        // 실시간 구독 설정
        unsubscribe = subscribeToQuestions((updatedQuestions) => {
          setQuestions(updatedQuestions);
          setLoading(false);
        });

      } catch (error) {
        console.error('데이터 초기화 실패:', error);
        showSnackbar('데이터 로드에 실패했습니다. 로컬 데이터를 사용합니다.', 'error');
        setLoading(false);
      }
    };

    initializeData();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const filteredQuestions = questions.filter(q => {
    const matchesSubject = selectedSubject === 'all' || q.subject === selectedSubject;
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setEditDialogOpen(true);
    
    // 기존 이미지가 base64 데이터인지 URL인지 확인
    if (question.imageUrl && question.imageUrl.startsWith('data:')) {
      setImagePreview(question.imageUrl);
      setImageFile(null);
    } else {
      setImagePreview('');
      setImageFile(null);
    }
    
    // 해설 이미지도 동일하게 처리
    if (question.explanationImageUrl && question.explanationImageUrl.startsWith('data:')) {
      setExplanationImagePreview(question.explanationImageUrl);
      setExplanationImageFile(null);
    } else {
      setExplanationImagePreview('');
      setExplanationImageFile(null);
    }
    
    // 힌트 이미지도 동일하게 처리
    if (question.hintImageUrl && question.hintImageUrl.startsWith('data:')) {
      setHintImagePreview(question.hintImageUrl);
      setHintImageFile(null);
    } else {
      setHintImagePreview('');
      setHintImageFile(null);
    }
  };

  const handleSaveQuestion = async () => {
    if (!editingQuestion.question || !editingQuestion.options?.every(opt => opt.trim()) || 
        editingQuestion.correctAnswer === undefined || !editingQuestion.explanation || 
        !editingQuestion.subject) {
      showSnackbar('모든 필수 필드를 입력해주세요.', 'error');
      return;
    }

    setSaving(true);
    
    try {
      if (editingQuestion.id) {
        // 수정
        await updateQuestion(editingQuestion as Question);
        showSnackbar('문제가 성공적으로 수정되었습니다.', 'success');
      } else {
        // 추가
        await addQuestion(editingQuestion as Omit<Question, 'id'>);
        showSnackbar('새 문제가 성공적으로 추가되었습니다.', 'success');
      }
      
      setEditDialogOpen(false);
      setEditingQuestion({});
      setImagePreview('');
      setImageFile(null);
      setExplanationImagePreview('');
      setExplanationImageFile(null);
      setHintImagePreview('');
      setHintImageFile(null);
    } catch (error) {
      console.error('문제 저장 실패:', error);
      showSnackbar(isOnline ? '저장에 실패했습니다.' : '오프라인 상태에서 로컬에 저장되었습니다.', 
                   isOnline ? 'error' : 'warning');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuestion = async (id: number) => {
    if (!window.confirm('정말 이 문제를 삭제하시겠습니까?')) return;

    try {
      await deleteQuestion(id);
      showSnackbar('문제가 성공적으로 삭제되었습니다.', 'success');
    } catch (error) {
      console.error('문제 삭제 실패:', error);
      showSnackbar(isOnline ? '삭제에 실패했습니다.' : '오프라인 상태에서 로컬에서 삭제되었습니다.', 
                   isOnline ? 'error' : 'warning');
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target?.result as string;
        setImagePreview(base64Data);
        setEditingQuestion({...editingQuestion, imageUrl: base64Data});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setImageFile(null);
    setImagePreview('');
    setEditingQuestion({...editingQuestion, imageUrl: ''});
  };

  const handleExplanationImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setExplanationImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target?.result as string;
        setExplanationImagePreview(base64Data);
        setEditingQuestion({...editingQuestion, explanationImageUrl: base64Data});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteExplanationImage = () => {
    setExplanationImageFile(null);
    setExplanationImagePreview('');
    setEditingQuestion({...editingQuestion, explanationImageUrl: ''});
  };

  const handleHintImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setHintImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target?.result as string;
        setHintImagePreview(base64Data);
        setEditingQuestion({...editingQuestion, hintImageUrl: base64Data});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteHintImage = () => {
    setHintImageFile(null);
    setHintImagePreview('');
    setEditingQuestion({...editingQuestion, hintImageUrl: ''});
  };

  const getSubjectColor = (subject: Subject) => {
    const colors = {
      '서비스경험디자인기획설계': '#1976d2',
      '사용자조사분석': '#388e3c',
      '사용자중심전략수립': '#f57c00',
      '서비스경험디자인개발및운영': '#7b1fa2'
    };
    return colors[subject];
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={50} sx={{ mb: 2 }} />
        <Typography variant="h6">데이터를 불러오는 중...</Typography>
        <Typography variant="body2" color="text.secondary">
          처음 실행 시 시간이 다소 걸릴 수 있습니다.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 네트워크 상태 표시 */}
      {!isOnline && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CloudOff />
            <Typography>오프라인 모드: 변경사항은 로컬에 저장되며, 온라인 시 자동 동기화됩니다.</Typography>
          </Box>
        </Alert>
      )}

      {/* 헤더 */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={onBack} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
            📚 기출문제 관리
          </Typography>
          
          {/* 동기화 버튼들 */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={saving ? <CircularProgress size={16} /> : <Sync />}
              onClick={handleSync}
              disabled={!isOnline || saving}
              size="small"
            >
              {saving ? '동기화 중...' : '동기화'}
            </Button>
            
            <Button
              variant="outlined"
              color="secondary"
              startIcon={saving ? <CircularProgress size={16} /> : <Refresh />}
              onClick={handleForceRefresh}
              disabled={!isOnline || saving}
              size="small"
            >
              강제 새로고침
            </Button>
            
            <Button
              variant="outlined"
              color="warning"
              startIcon={<Delete />}
              onClick={handleClearCache}
              size="small"
            >
              캐시 지우기
            </Button>
          </Box>
        </Box>
        
        {/* 필터 및 검색 */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>과목 필터</InputLabel>
            <Select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value as Subject | 'all')}
              label="과목 필터"
            >
              <MenuItem value="all">전체 과목</MenuItem>
              {subjects.map(subject => (
                <MenuItem key={subject} value={subject}>{subject}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            placeholder="문제 내용 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300 }}
          />
          
                    {isAdmin() && (
            <Button 
              variant="contained" 
              startIcon={<Add />}
              onClick={() => {
                setEditingQuestion({
                  question: '',
                  options: ['', '', '', ''],
                  correctAnswer: 0,
                  explanation: '',
                  subject: '서비스경험디자인기획설계'
                });
                setEditDialogOpen(true);
                setImagePreview('');
                setImageFile(null);
                setExplanationImagePreview('');
                setExplanationImageFile(null);
                setHintImagePreview('');
                setHintImageFile(null);
              }}
              sx={{ ml: 'auto' }}
            >
              새 문제 추가
            </Button>
          )}
        </Box>

        {/* 통계 카드 */}
        <Box 
          sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 2, 
            mb: 3 
          }}
        >
          {subjects.map(subject => {
            const count = questions.filter(q => q.subject === subject).length;
            return (
              <Box 
                key={subject} 
                sx={{ 
                  flex: '1 1 200px', 
                  minWidth: '200px',
                  maxWidth: '300px' 
                }}
              >
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="h4" sx={{ color: getSubjectColor(subject), fontWeight: 'bold' }}>
                      {count}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {subject.replace('서비스경험디자인', '').replace('사용자', '사용자 ')}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* 문제 목록 테이블 */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>번호</TableCell>
              <TableCell>과목</TableCell>
              <TableCell>문제 내용</TableCell>
              <TableCell align="center">작업</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredQuestions.map((question) => (
              <TableRow key={question.id} hover>
                <TableCell>{question.id}</TableCell>
                <TableCell>
                  <Chip 
                    label={question.subject.replace('서비스경험디자인', '').replace('사용자', '사용자 ')} 
                    size="small"
                    sx={{ 
                      backgroundColor: getSubjectColor(question.subject),
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </TableCell>
                <TableCell sx={{ maxWidth: 400 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        cursor: 'pointer',
                        flexGrow: 1,
                        '&:hover': { color: 'primary.main' }
                      }}
                      onClick={() => setSelectedQuestion(question)}
                    >
                      {question.question}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                      {question.imageUrl && (
                        <Image 
                          sx={{ 
                            color: 'primary.main', 
                            fontSize: '1.2rem'
                          }} 
                          titleAccess="문제 이미지 있음"
                        />
                      )}
                      {question.explanationImageUrl && (
                        <Image 
                          sx={{ 
                            color: 'success.main', 
                            fontSize: '1.2rem'
                          }} 
                          titleAccess="해설 이미지 있음"
                        />
                      )}
                      {(question.hintText || question.hintImageUrl) && (
                        <LightbulbIcon 
                          sx={{ 
                            color: '#FFC107', 
                            fontSize: '1.2rem'
                          }} 
                          titleAccess="힌트 있음"
                        />
                      )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  {isAdmin() ? (
                    <>
                      <IconButton 
                        size="small" 
                        onClick={() => handleEditQuestion(question)}
                        sx={{ mr: 1 }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteQuestion(question.id)}
                      >
                        <Delete />
                      </IconButton>
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      관리자 전용
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 문제 상세 보기 다이얼로그 */}
      <Dialog 
        open={!!selectedQuestion} 
        onClose={() => setSelectedQuestion(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedQuestion && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">문제 {selectedQuestion.id}</Typography>
                <Chip 
                  label={selectedQuestion.subject} 
                  sx={{ 
                    backgroundColor: getSubjectColor(selectedQuestion.subject),
                    color: 'white'
                  }}
                />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {selectedQuestion.question}
              </Typography>
              
              {/* 문제 이미지 표시 */}
              {selectedQuestion.imageUrl && (
                <Box sx={{ mb: 3, textAlign: 'center' }}>
                  <img 
                    src={selectedQuestion.imageUrl} 
                    alt="문제 이미지" 
                    style={{ 
                      maxWidth: '100%', 
                      height: 'auto',
                      borderRadius: 8,
                      border: '1px solid #e0e0e0'
                    }}
                  />
                </Box>
              )}
              
              <Box sx={{ mb: 3 }}>
                {selectedQuestion.options.map((option, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      p: 1, 
                      mb: 1, 
                      backgroundColor: index === selectedQuestion.correctAnswer ? '#e8f5e8' : '#f5f5f5',
                      borderRadius: 1,
                      border: index === selectedQuestion.correctAnswer ? '2px solid #4caf50' : '1px solid #ddd'
                    }}
                  >
                    <Typography variant="body1">
                      {index + 1}. {option}
                      {index === selectedQuestion.correctAnswer && (
                        <Chip label="정답" size="small" color="success" sx={{ ml: 1 }} />
                      )}
                    </Typography>
                  </Box>
                ))}
              </Box>
              
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                해설:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {selectedQuestion.explanation}
              </Typography>
              
              {/* 해설 이미지 표시 */}
              {selectedQuestion.explanationImageUrl && (
                <Box sx={{ mb: 2, textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                    해설 이미지
                  </Typography>
                  <img 
                    src={selectedQuestion.explanationImageUrl} 
                    alt="해설 이미지" 
                    style={{ 
                      maxWidth: '100%', 
                      height: 'auto',
                      borderRadius: 8,
                      border: '1px solid #e0e0e0'
                    }}
                  />
                </Box>
              )}

              {/* 힌트 정보 표시 */}
              {(selectedQuestion.hintText || selectedQuestion.hintImageUrl) && (
                <Box sx={{ 
                  mt: 3,
                  p: 2,
                  backgroundColor: '#FFFEF7',
                  border: '1px solid #FFC107',
                  borderRadius: 1
                }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: '#FF8F00' }}>
                    💡 힌트:
                  </Typography>
                  
                  {selectedQuestion.hintText && (
                    <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
                      {selectedQuestion.hintText}
                    </Typography>
                  )}
                  
                  {selectedQuestion.hintImageUrl && (
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                        힌트 이미지
                      </Typography>
                      <img 
                        src={selectedQuestion.hintImageUrl} 
                        alt="힌트 이미지" 
                        style={{ 
                          maxWidth: '100%', 
                          height: 'auto',
                          borderRadius: 8,
                          border: '1px solid #e0e0e0'
                        }}
                      />
                    </Box>
                  )}
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleEditQuestion(selectedQuestion)}>수정</Button>
              <Button onClick={() => setSelectedQuestion(null)}>닫기</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* 문제 편집 다이얼로그 */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingQuestion.id ? '문제 수정' : '새 문제 추가'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>과목</InputLabel>
              <Select
                value={editingQuestion.subject || ''}
                onChange={(e) => setEditingQuestion({...editingQuestion, subject: e.target.value as Subject})}
                label="과목"
              >
                {subjects.map(subject => (
                  <MenuItem key={subject} value={subject}>{subject}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="문제 내용"
              multiline
              rows={3}
              value={editingQuestion.question || ''}
              onChange={(e) => setEditingQuestion({...editingQuestion, question: e.target.value})}
              fullWidth
            />

            {/* 이미지 URL 입력 */}
            <TextField
              label="이미지 URL (선택사항)"
              value={editingQuestion.imageUrl?.startsWith('data:') ? '' : editingQuestion.imageUrl || ''}
              onChange={(e) => {
                const url = e.target.value;
                setEditingQuestion({...editingQuestion, imageUrl: url});
                if (url && !url.startsWith('data:')) {
                  setImagePreview('');
                  setImageFile(null);
                }
              }}
              fullWidth
              placeholder="https://example.com/image.jpg"
            />

            {/* 이미지 미리보기 */}
            {editingQuestion.imageUrl && !editingQuestion.imageUrl.startsWith('data:') && (
              <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2, textAlign: 'center' }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>이미지 미리보기 (URL)</Typography>
                <img 
                  src={editingQuestion.imageUrl} 
                  alt="이미지 미리보기" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: 200, 
                    borderRadius: 4 
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </Box>
            )}

            {/* 이미지 업로드 섹션 */}
            <Box sx={{ border: '1px dashed #ccc', borderRadius: 1, p: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>또는 파일 업로드</Typography>
              
              {(imagePreview || (editingQuestion.imageUrl && editingQuestion.imageUrl.startsWith('data:'))) ? (
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
                    업로드된 이미지
                  </Typography>
                  <img 
                    src={imagePreview || editingQuestion.imageUrl || ''} 
                    alt="업로드된 이미지" 
                    style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 4 }}
                  />
                  <IconButton
                    size="small"
                    color="error"
                    onClick={handleDeleteImage}
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      backgroundColor: 'rgba(255,255,255,0.8)'
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              ) : (
                <Button
                  variant="outlined"
                  startIcon={<Image />}
                  component="label"
                  fullWidth
                  sx={{ py: 2 }}
                >
                  이미지 파일 업로드
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </Button>
              )}
            </Box>

            <Typography variant="subtitle1" sx={{ mt: 2 }}>선택지</Typography>
            {(editingQuestion.options || ['', '', '', '']).map((option, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ minWidth: 20 }}>
                  {index + 1}.
                </Typography>
                <TextField
                  fullWidth
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...(editingQuestion.options || ['', '', '', ''])];
                    newOptions[index] = e.target.value;
                    setEditingQuestion({...editingQuestion, options: newOptions});
                  }}
                  placeholder={`선택지 ${index + 1}`}
                />
              </Box>
            ))}

            <FormControl>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>정답</Typography>
              <RadioGroup
                row
                value={editingQuestion.correctAnswer || 0}
                onChange={(e) => setEditingQuestion({...editingQuestion, correctAnswer: parseInt(e.target.value)})}
              >
                {[0, 1, 2, 3].map(index => (
                  <FormControlLabel
                    key={index}
                    value={index}
                    control={<Radio />}
                    label={`${index + 1}번`}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <TextField
              label="해설"
              multiline
              rows={3}
              value={editingQuestion.explanation || ''}
              onChange={(e) => setEditingQuestion({...editingQuestion, explanation: e.target.value})}
              fullWidth
            />

            {/* 해설 이미지 URL 입력 */}
            <TextField
              label="해설 이미지 URL (선택사항)"
              value={editingQuestion.explanationImageUrl?.startsWith('data:') ? '' : editingQuestion.explanationImageUrl || ''}
              onChange={(e) => {
                const url = e.target.value;
                setEditingQuestion({...editingQuestion, explanationImageUrl: url});
                if (url && !url.startsWith('data:')) {
                  setExplanationImagePreview('');
                  setExplanationImageFile(null);
                }
              }}
              fullWidth
              placeholder="https://example.com/explanation-image.jpg"
            />

            {/* 해설 이미지 미리보기 */}
            {editingQuestion.explanationImageUrl && !editingQuestion.explanationImageUrl.startsWith('data:') && (
              <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2, textAlign: 'center' }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>해설 이미지 미리보기 (URL)</Typography>
                <img 
                  src={editingQuestion.explanationImageUrl} 
                  alt="해설 이미지 미리보기" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: 200, 
                    borderRadius: 4 
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </Box>
            )}

            {/* 해설 이미지 업로드 섹션 */}
            <Box sx={{ border: '1px dashed #ccc', borderRadius: 1, p: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>또는 해설 이미지 파일 업로드</Typography>
              
              {(explanationImagePreview || (editingQuestion.explanationImageUrl && editingQuestion.explanationImageUrl.startsWith('data:'))) ? (
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
                    업로드된 해설 이미지
                  </Typography>
                  <img 
                    src={explanationImagePreview || editingQuestion.explanationImageUrl || ''} 
                    alt="업로드된 해설 이미지" 
                    style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 4 }}
                  />
                  <IconButton
                    size="small"
                    color="error"
                    onClick={handleDeleteExplanationImage}
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      backgroundColor: 'rgba(255,255,255,0.8)'
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              ) : (
                <Button
                  variant="outlined"
                  startIcon={<Image />}
                  component="label"
                  fullWidth
                  sx={{ py: 2 }}
                >
                  해설 이미지 파일 업로드
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleExplanationImageUpload}
                  />
                </Button>
              )}
            </Box>

            {/* 힌트 섹션 */}
            <Typography variant="h6" sx={{ mt: 3, mb: 2, color: '#FFC107', fontWeight: 'bold' }}>
              💡 힌트 (선택사항)
            </Typography>
            
            <TextField
              label="힌트 텍스트"
              multiline
              rows={2}
              value={editingQuestion.hintText || ''}
              onChange={(e) => setEditingQuestion({...editingQuestion, hintText: e.target.value})}
              fullWidth
              placeholder="학습자에게 도움이 될 힌트를 입력하세요"
            />

            {/* 힌트 이미지 URL 입력 */}
            <TextField
              label="힌트 이미지 URL (선택사항)"
              value={editingQuestion.hintImageUrl?.startsWith('data:') ? '' : editingQuestion.hintImageUrl || ''}
              onChange={(e) => {
                const url = e.target.value;
                setEditingQuestion({...editingQuestion, hintImageUrl: url});
                if (url && !url.startsWith('data:')) {
                  setHintImagePreview('');
                  setHintImageFile(null);
                }
              }}
              fullWidth
              placeholder="https://example.com/hint-image.jpg"
            />

            {/* 힌트 이미지 미리보기 */}
            {editingQuestion.hintImageUrl && !editingQuestion.hintImageUrl.startsWith('data:') && (
              <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2, textAlign: 'center' }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>힌트 이미지 미리보기 (URL)</Typography>
                <img 
                  src={editingQuestion.hintImageUrl} 
                  alt="힌트 이미지 미리보기" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: 200, 
                    borderRadius: 4 
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </Box>
            )}

            {/* 힌트 이미지 업로드 섹션 */}
            <Box sx={{ border: '1px dashed #FFC107', borderRadius: 1, p: 2, backgroundColor: '#FFFEF7' }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: '#FF8F00' }}>또는 힌트 이미지 파일 업로드</Typography>
              
              {(hintImagePreview || (editingQuestion.hintImageUrl && editingQuestion.hintImageUrl.startsWith('data:'))) ? (
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
                    업로드된 힌트 이미지
                  </Typography>
                  <img 
                    src={hintImagePreview || editingQuestion.hintImageUrl || ''} 
                    alt="업로드된 힌트 이미지" 
                    style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 4 }}
                  />
                  <IconButton
                    size="small"
                    color="error"
                    onClick={handleDeleteHintImage}
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      backgroundColor: 'rgba(255,255,255,0.8)'
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              ) : (
                <Button
                  variant="outlined"
                  startIcon={<Image />}
                  component="label"
                  fullWidth
                  sx={{ 
                    py: 2,
                    borderColor: '#FFC107',
                    color: '#FFC107',
                    '&:hover': {
                      borderColor: '#FFB300',
                      backgroundColor: 'rgba(255, 193, 7, 0.04)'
                    }
                  }}
                >
                  힌트 이미지 파일 업로드
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleHintImageUpload}
                  />
                </Button>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>취소</Button>
          <Button 
            onClick={handleSaveQuestion}
            variant="contained"
            disabled={
              !editingQuestion.question ||
              !editingQuestion.options?.every(opt => opt.trim()) ||
              editingQuestion.correctAnswer === undefined ||
              !editingQuestion.explanation ||
              !editingQuestion.subject ||
              saving
            }
            startIcon={saving ? <CircularProgress size={16} /> : null}
          >
            {saving ? '저장 중...' : '저장'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 스낵바 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({...snackbar, open: false})}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({...snackbar, open: false})} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default QuestionBankPage; 