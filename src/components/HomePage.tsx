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
  CardActions,
  Avatar,
  IconButton
} from '@mui/material';
import {
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface HomePageProps {
  onStartExam: () => void;
  onGoToQuestionBank: () => void;
  onGoToStudy: () => void;
  onGoToExamHistory: () => void;
  savedExamSession?: any;
  onContinueExam: () => void;
  onDiscardSavedExam: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ 
  onStartExam, 
  onGoToQuestionBank, 
  onGoToStudy, 
  onGoToExamHistory,
  savedExamSession,
  onContinueExam,
  onDiscardSavedExam
}) => {
  const [showComingSoon, setShowComingSoon] = useState(false);
  const { authState, signOut } = useAuth();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleComingSoon = () => {
    setShowComingSoon(true);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  const isGuest = authState.status === 'guest';
  const isAuthenticated = authState.status === 'authenticated';

  return (
    <Container maxWidth="lg" sx={{ minHeight: '100vh', py: 4 }}>
      {/* 상단 사용자 정보 */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box />
        <Box display="flex" alignItems="center" gap={2}>
          {isAuthenticated && authState.user && (
            <>
              <Avatar src={authState.user.photoURL} sx={{ width: 32, height: 32 }}>
                {authState.user.displayName?.[0]}
              </Avatar>
              <Typography variant="body2" color="text.secondary">
                {authState.user.displayName}
              </Typography>
            </>
          )}
          {isGuest && (
            <Typography variant="body2" color="text.secondary">
              게스트 모드
            </Typography>
          )}
          <IconButton onClick={handleSignOut} color="primary" title="로그아웃">
            <LogoutIcon />
          </IconButton>
        </Box>
      </Box>

      {/* 헤더 섹션 */}
      <Box textAlign="center" mb={6}>
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            mb: 2
          }}
        >
          🎯 서비스디자인 자격증 시험
        </Typography>
        <Typography 
          variant="h5" 
          color="text.secondary" 
          sx={{ mb: 4, fontWeight: 300 }}
        >
          체계적인 문제 풀이로 자격증 취득을 준비하세요
        </Typography>
        {isGuest && (
          <Typography 
            variant="body1" 
            color="warning.main" 
            sx={{ mb: 2, fontWeight: 'bold' }}
          >
            🔍 게스트 모드에서는 오늘의 공부 기능만 이용 가능합니다
          </Typography>
        )}
      </Box>

      {/* 중간 저장된 시험 알림 */}
      {savedExamSession && isAuthenticated && (
        <Box sx={{ mb: 4 }}>
          <Card sx={{ 
            backgroundColor: '#fff3e0', 
            border: '2px solid #ff9800',
            borderRadius: 2
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#f57c00' }}>
                  ⏸️ 중단된 시험이 있습니다
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                이전에 진행하던 시험이 저장되어 있습니다. 이어서 시험을 보시거나 새로 시작하실 수 있습니다.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                진행률: {Math.round((savedExamSession.currentQuestionIndex / savedExamSession.questions.length) * 100)}% 
                ({savedExamSession.currentQuestionIndex + 1}/{savedExamSession.questions.length}문제)
              </Typography>
              <Box display="flex" gap={2} flexWrap="wrap">
                <Button 
                  variant="contained" 
                  onClick={onContinueExam}
                  sx={{ 
                    backgroundColor: '#4CAF50', 
                    '&:hover': { backgroundColor: '#45a049' }
                  }}
                >
                  이어서 시험보기
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={onDiscardSavedExam}
                  color="warning"
                >
                  저장된 시험 삭제
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* 메인 카드 섹션 */}
      <Box 
        sx={{ 
          display: 'flex',
          justifyContent: 'center',
          gap: 4,
          flexWrap: 'wrap',
          mb: 6
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 4, 
            justifyContent: 'center',
            width: '100%'
          }}
        >
          {/* 오늘의 공부 카드 */}
          <Box sx={{ flex: '1 1 300px', maxWidth: '400px' }}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h3" gutterBottom sx={{ color: '#FF9800', fontWeight: 'bold' }}>
                  📖 오늘의 공부
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  언제든 중단할 수 있고, 문제를 풀고 답을 확인하면서 공부할 수 있는 영역입니다. 자유롭게 학습하세요.
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  fullWidth 
                  variant="contained" 
                  onClick={onGoToStudy}
                  sx={{ 
                    backgroundColor: '#FF9800', 
                    '&:hover': { backgroundColor: '#F57C00' },
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                >
                  공부 시작
                </Button>
              </CardActions>
            </Card>
          </Box>

          {/* 시험보기 카드 - 인증된 사용자만 */}
          {isAuthenticated && (
            <Box sx={{ flex: '1 1 300px', maxWidth: '400px' }}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="h3" gutterBottom sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                    🎯 시험보기
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    실제 시험과 동일한 환경에서 문제를 풀어보세요. 4개 과목별로 20문제씩 총 80문제가 출제되며, 마지막에 결과를 확인할 수 있습니다.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    onClick={onStartExam}
                    sx={{ 
                      backgroundColor: '#4CAF50', 
                      '&:hover': { backgroundColor: '#45a049' },
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  >
                    시험 시작
                  </Button>
                </CardActions>
              </Card>
            </Box>
          )}

          {/* 기출문제 확인하기 카드 - 인증된 사용자만 */}
          {isAuthenticated && (
            <Box sx={{ flex: '1 1 300px', maxWidth: '400px' }}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="h3" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                    📚 기출문제 확인하기
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    지난 기출문제들을 확인하고 관리할 수 있습니다. 문제를 수정하거나 새로운 문제를 추가할 수도 있습니다.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    onClick={onGoToQuestionBank}
                    sx={{ 
                      backgroundColor: '#1976d2', 
                      '&:hover': { backgroundColor: '#1565c0' },
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  >
                    기출문제 확인
                  </Button>
                </CardActions>
              </Card>
            </Box>
          )}

          {/* 시험 결과 히스토리 카드 - 인증된 사용자만 */}
          {isAuthenticated && (
            <Box sx={{ flex: '1 1 300px', maxWidth: '400px' }}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="h3" gutterBottom sx={{ color: '#9C27B0', fontWeight: 'bold' }}>
                    📊 시험 결과 히스토리
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    지금까지 본 시험들의 결과를 확인하고 관리할 수 있습니다. PDF로 다운로드하거나 상세 분석을 볼 수 있습니다.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    onClick={onGoToExamHistory}
                    sx={{ 
                      backgroundColor: '#9C27B0', 
                      '&:hover': { backgroundColor: '#7B1FA2' },
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  >
                    결과 확인하기
                  </Button>
                </CardActions>
              </Card>
            </Box>
          )}


        </Box>
      </Box>

      {/* 하단 정보 섹션 */}
      <Box textAlign="center">
        <Typography variant="h6" gutterBottom>
          📋 시험 정보
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 4, 
          flexWrap: 'wrap',
          mt: 3
        }}>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              총 문항 수
            </Typography>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
              80문제
            </Typography>
          </Box>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              시험 시간
            </Typography>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
              100분
            </Typography>
          </Box>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              과목 수
            </Typography>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
              4과목
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Coming Soon 다이얼로그 */}
      <Dialog open={showComingSoon} onClose={() => setShowComingSoon(false)}>
        <DialogTitle>🚧 준비 중입니다</DialogTitle>
        <DialogContent>
          <Typography>
            해당 기능은 현재 개발 중입니다. 곧 만나보실 수 있습니다!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowComingSoon(false)}>확인</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HomePage; 