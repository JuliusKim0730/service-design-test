import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Google as GoogleIcon,
  PersonOutline as GuestIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signInWithGoogle, signInAsGuest } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
    } catch (err: any) {
      console.error('로그인 에러:', err);
      setError('구글 로그인에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    try {
      setLoading(true);
      setError(null);
      signInAsGuest();
    } catch (err: any) {
      console.error('게스트 로그인 에러:', err);
      setError('게스트 로그인에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', py: 4 }}>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        {/* 헤더 섹션 */}
        <Box textAlign="center" mb={4}>
          <Typography 
            variant="h3" 
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
            variant="h6" 
            color="text.secondary" 
            sx={{ mb: 4, fontWeight: 300 }}
          >
            체계적인 문제 풀이로 자격증 취득을 준비하세요
          </Typography>
        </Box>

        {/* 로그인 카드 */}
        <Card sx={{ width: '100%', maxWidth: 400, p: 2 }}>
          <CardContent>
            <Typography variant="h5" component="h2" textAlign="center" gutterBottom>
              로그인
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
              서비스를 이용하려면 로그인이 필요합니다
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* 구글 로그인 버튼 */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <GoogleIcon />}
              onClick={handleGoogleLogin}
              disabled={loading}
              sx={{
                mb: 2,
                backgroundColor: '#4285f4',
                '&:hover': {
                  backgroundColor: '#3367d6'
                },
                py: 1.5,
                fontWeight: 'bold'
              }}
            >
              {loading ? '로그인 중...' : 'Google로 로그인'}
            </Button>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                또는
              </Typography>
            </Divider>

            {/* 게스트 로그인 버튼 */}
            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<GuestIcon />}
              onClick={handleGuestLogin}
              disabled={loading}
              sx={{
                py: 1.5,
                fontWeight: 'bold',
                borderColor: '#9e9e9e',
                color: '#424242',
                '&:hover': {
                  borderColor: '#757575',
                  backgroundColor: '#f5f5f5'
                }
              }}
            >
              게스트로 이용하기
            </Button>

            {/* 안내 텍스트 */}
            <Box mt={3} p={2} sx={{ backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                <strong>게스트 모드:</strong> 오늘의 공부 기능만 이용 가능
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 1 }}>
                <strong>Google 로그인:</strong> 모든 기능 이용 가능 (시험보기, 기출문제 확인 등)
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* 하단 정보 */}
        <Box textAlign="center" mt={4}>
          <Typography variant="body2" color="text.secondary">
            🔒 안전한 Google OAuth 인증을 사용합니다
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage; 