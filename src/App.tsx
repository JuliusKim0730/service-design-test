import React, { useState, useEffect } from 'react';
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
import { subscribeToQuestions } from './services/questionService';
import { Subject } from './types/Question';

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
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const { authState } = useAuth();

  // Firebase에서 실시간으로 모든 문제 구독
  useEffect(() => {
    const unsubscribe = subscribeToQuestions((questions) => {
      console.log('🔄 App에서 실시간 데이터 업데이트 - 전체 문제 수:', questions.length);
      setAllQuestions(questions);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const handleStartExam = () => {
    console.log('🎯 시험 시작 - 사용 가능한 문제 수:', allQuestions.length);
    
    if (allQuestions.length === 0) {
      console.warn('⚠️ 문제가 로드되지 않았습니다. 잠시 후 다시 시도해주세요.');
      return;
    }
      
    // 과목별로 문제 분류 및 시험 문제 생성
    const subjects: Subject[] = [
      '서비스경험디자인기획설계',
      '사용자조사분석', 
      '사용자중심전략수립',
      '서비스경험디자인개발및운영'
    ];

    const examQuestions: Question[] = [];
    
    // 과목별로 순서대로 문제 추가, 각 과목 내에서만 랜덤화
    subjects.forEach(subject => {
      const subjectQuestions = allQuestions.filter(q => q.subject === subject);
      console.log(`📚 ${subject}: ${subjectQuestions.length}개 문제`);
      
      // 각 과목 내에서만 문제 순서 랜덤화 (최대 20문제)
      const shuffledSubjectQuestions = subjectQuestions
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(20, subjectQuestions.length));
      examQuestions.push(...shuffledSubjectQuestions);
    });

    console.log('📝 생성된 시험 문제 수:', examQuestions.length);
    setExamQuestions(examQuestions);
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
