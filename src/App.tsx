import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, CircularProgress, Box, Typography } from '@mui/material';
import HomePage from './components/HomePage';
import ExamPage from './components/ExamPage';
import QuestionBankPage from './components/QuestionBankPage';
import StudyPage from './components/StudyPage';
import ExamResultPage from './components/ExamResultPage';
import LoginPage from './components/LoginPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Question, QuestionResult } from './types/Question';
import { generateExamQuestions } from './data/questions';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    success: {
      main: '#2e7d32',
    },
    warning: {
      main: '#ed6c02',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

// 로딩 컴포넌트
const LoadingScreen: React.FC = () => (
  <Box
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
    gap={2}
  >
    <CircularProgress size={50} />
    <Typography variant="h6" color="text.secondary">
      로딩 중...
    </Typography>
  </Box>
);

type Page = 'home' | 'exam' | 'questionBank' | 'study' | 'results';

// 메인 앱 컴포넌트 (인증된 상태에서만 렌더링)
const AuthenticatedApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [examResults, setExamResults] = useState<QuestionResult[]>([]);
  const { authState } = useAuth();

  const handleStartExam = () => {
    const questions = generateExamQuestions();
    setExamQuestions(questions);
    setCurrentPage('exam');
  };

  const handleExamComplete = (results: QuestionResult[]) => {
    setExamResults(results);
    setCurrentPage('results');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setExamQuestions([]);
    setExamResults([]);
  };

  const handleGoToStudy = () => {
    setCurrentPage('study');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'exam':
        // 게스트는 시험보기 불가
        if (authState.status === 'guest') {
          return (
            <HomePage 
              onStartExam={handleStartExam} 
              onGoToQuestionBank={() => setCurrentPage('questionBank')}
              onGoToStudy={handleGoToStudy}
            />
          );
        }
        return (
          <ExamPage
            questions={examQuestions}
            onExamComplete={handleExamComplete}
            onBackToHome={handleBackToHome}
          />
        );
      case 'questionBank':
        // 게스트는 기출문제 확인 불가
        if (authState.status === 'guest') {
          return (
            <HomePage 
              onStartExam={handleStartExam} 
              onGoToQuestionBank={() => setCurrentPage('questionBank')}
              onGoToStudy={handleGoToStudy}
            />
          );
        }
        return <QuestionBankPage onBack={() => setCurrentPage('home')} />;
      case 'study':
        return <StudyPage onBackToHome={handleBackToHome} />;
      case 'results':
        return (
          <ExamResultPage 
            questions={examQuestions}
            results={examResults}
            onBackToHome={handleBackToHome}
          />
        );
      default:
        return (
          <HomePage 
            onStartExam={handleStartExam} 
            onGoToQuestionBank={() => setCurrentPage('questionBank')}
            onGoToStudy={handleGoToStudy}
          />
        );
    }
  };

  return renderPage();
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

// 인증 상태에 따라 다른 컴포넌트를 렌더링하는 컴포넌트
const AppContent: React.FC = () => {
  const { authState } = useAuth();

  if (authState.status === 'loading') {
    return <LoadingScreen />;
  }

  if (authState.status === 'unauthenticated') {
    return <LoginPage />;
  }

  return <AuthenticatedApp />;
};

export default App;
