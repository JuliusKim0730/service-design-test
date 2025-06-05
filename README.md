# Service Design Test

서비스디자인 자격증 시험 대비를 위한 문제풀이 애플리케이션입니다.

## 🎯 주요 기능

### 🔐 인증 시스템
- **Google OAuth 로그인**: 모든 기능 이용 가능
- **게스트 모드**: 오늘의 공부 기능만 이용 가능

### 📖 오늘의 공부 (모든 사용자)
- 언제든 중단하고 재시작 가능
- 문제를 풀고 즉시 답안과 해설 확인
- 자유로운 학습 진도 관리
- 이전/다음 문제 네비게이션

### 🎯 시험보기 (Google 로그인 사용자만)
- 실제 시험과 동일한 환경
- 4개 과목별로 20문제씩 총 80문제
- 답 선택 후 바로 다음 문제로 진행
- 시험 완료 후 상세한 결과 분석

### 📚 기출문제 확인하기 (Google 로그인 사용자만)
- 전체 문제 검색 및 필터링
- 문제 수정 및 새 문제 추가
- 과목별 문제 관리

### 📊 시험 결과 분석
- 총 점수 및 과목별 점수 표시
- 틀린 문제 목록과 상세 해설
- 각 문제별 정답/오답 분석
- 점수에 따른 색상 구분 (80% 이상: 초록, 60% 이상: 주황, 미만: 빨강)

## 🛠 기술 스택

- **Frontend**: React 19.1.0 + TypeScript
- **UI Framework**: Material-UI (MUI) 7.1.0
- **인증**: Firebase Authentication (Google OAuth)
- **상태관리**: React Context API
- **데이터 저장**: 로컬 스토리지 + Firebase (예정)
- **배포**: Vercel

## 🚀 시작하기

### 필수 조건
- Node.js 16.0.0 이상
- Firebase 프로젝트 (Google OAuth용)

### 로컬 개발 환경 설정

1. **저장소 클론**
```bash
git clone [repository-url]
cd service_design_test
```

2. **의존성 설치**
```bash
npm install
```

3. **Firebase 설정**
   - [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트 생성
   - Authentication > Sign-in method에서 Google 로그인 활성화
   - 프로젝트 설정에서 웹 앱 추가 후 config 정보 확인

4. **환경 변수 설정**
   - `.env` 파일을 프로젝트 루트에 생성:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

5. **개발 서버 실행**
```bash
npm start
```

6. **브라우저에서 `http://localhost:3000` 접속**

## 🌐 Vercel 배포

### 1. Vercel 계정 준비
- [Vercel](https://vercel.com/)에 GitHub 계정으로 가입

### 2. GitHub 저장소 연결
- Vercel 대시보드에서 "New Project" 클릭
- GitHub 저장소 선택 및 Import

### 3. 환경 변수 설정
Vercel 프로젝트 설정에서 다음 환경 변수들을 추가:
```
REACT_APP_FIREBASE_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID
```

### 4. Firebase 도메인 설정
- Firebase Console > Authentication > Settings > Authorized domains에 Vercel 도메인 추가
- 예: `your-project.vercel.app`

### 5. 배포
- Vercel에서 자동으로 빌드 및 배포 진행
- 배포 완료 후 제공되는 URL로 접속 가능

## 📁 프로젝트 구조

```
src/
├── components/             # React 컴포넌트
│   ├── HomePage.tsx        # 메인 페이지
│   ├── LoginPage.tsx       # 로그인 페이지
│   ├── StudyPage.tsx       # 오늘의 공부 페이지
│   ├── ExamPage.tsx        # 시험보기 페이지
│   ├── ExamResultPage.tsx  # 시험 결과 페이지
│   └── QuestionBankPage.tsx # 기출문제 확인 페이지
├── contexts/               # React Context
│   └── AuthContext.tsx     # 인증 상태 관리
├── types/                  # TypeScript 타입 정의
│   ├── Question.ts         # 문제 관련 타입
│   └── Auth.ts            # 인증 관련 타입
├── data/                   # 문제 데이터
│   └── questions.ts        # 샘플 문제 데이터
├── config/                 # 설정 파일
│   └── firebase.ts         # Firebase 설정
└── services/               # 비즈니스 로직
    └── questionService.ts  # 문제 관련 서비스
```

## 📝 사용 가이드

### 게스트 모드
1. "게스트로 이용하기" 클릭
2. 오늘의 공부 기능만 이용 가능
3. 문제를 풀고 즉시 답안 확인 가능
4. 언제든 중단하고 홈으로 돌아가기 가능

### Google 로그인 모드
1. "Google로 로그인" 클릭하여 인증
2. 모든 기능 이용 가능:
   - 오늘의 공부
   - 시험보기 (80문제 실전 모드)
   - 기출문제 확인하기

### 시험보기 이용법
1. 홈에서 "시험 시작" 클릭
2. 80문제를 순서대로 풀이
3. 각 문제당 답 선택 후 "다음 문제" 클릭
4. 모든 문제 완료 후 상세한 결과 확인
5. 틀린 문제를 클릭하여 해설 확인

## 🔧 개발자 가이드

### Firebase 설정 방법

1. **Firebase 프로젝트 생성**
   - [Firebase Console](https://console.firebase.google.com/) 접속
   - "프로젝트 추가" 클릭
   - 프로젝트 이름 입력 및 생성

2. **Authentication 설정**
   - Authentication > Sign-in method 탭
   - Google 로그인 활성화
   - 승인된 도메인에 배포 도메인 추가

3. **웹 앱 등록**
   - 프로젝트 설정 > 일반 탭
   - "앱 추가" > 웹 선택
   - 앱 등록 후 config 정보 복사

### 환경별 설정

- **개발 환경**: `.env` 파일 사용
- **프로덕션**: Vercel 환경 변수 설정

## 📚 과목 정보

### 시험 구성
- **총 문항**: 80문제 (각 과목당 20문제)
- **시험 시간**: 100분
- **과목 구성**:
  1. 서비스경험디자인기획설계
  2. 사용자조사분석  
  3. 사용자중심전략수립
  4. 서비스경험디자인개발및운영

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 교육 목적으로 제작되었습니다.

## 🆘 문제 해결

### 로그인이 안 될 때
- Firebase 설정이 올바른지 확인
- 환경 변수가 제대로 설정되었는지 확인
- 브라우저에서 팝업이 차단되지 않았는지 확인

### 배포 시 오류가 날 때
- Vercel 환경 변수 설정 확인
- Firebase Authorized domains에 배포 도메인 추가 확인
- 빌드 로그에서 오류 메시지 확인

## 📞 지원

문제가 있거나 개선 사항이 있다면 Issue를 생성해 주세요.

---

## 🎉 구글 로그인 및 버셀 배포 가이드

### 구글 로그인 설정을 위해 필요한 것

1. **Firebase 프로젝트 정보**
   - API Key
   - Auth Domain
   - Project ID
   - Storage Bucket
   - Messaging Sender ID
   - App ID

2. **Google Cloud Console 설정** (Firebase에서 자동 처리됨)
   - OAuth 2.0 클라이언트 ID
   - 승인된 리디렉션 URI

### 버셀 배포를 위해 필요한 것

1. **GitHub 계정 및 저장소**
2. **Vercel 계정** (GitHub으로 가입 권장)
3. **환경 변수** (Firebase 설정 정보)
4. **도메인 설정** (Firebase Authorized domains)

위 정보들을 준비해서 제공해주시면 단계별로 설정을 도와드리겠습니다!
