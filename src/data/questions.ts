import { Question, Subject } from '../types/Question';

// 샘플 문제 데이터
export const sampleQuestions: Question[] = [
  // 서비스경험디자인기획설계 - 20문제
  {
    id: 1,
    subject: '서비스경험디자인기획설계',
    question: '다음 중 디자인의 개념에 대한 설명으로 옳지 않은 것은?',
    options: [
      '디자인은 심미적, 창조적 측면의 예술적 특성이 가장 중요하다.',
      '디자인은 디자인 방법론을 통해 문제를 해결하는 과정이다.',
      '디자인은 문제해결, 창조적, 체계적 활동이자 디자인적 사고로 접근하는 것이다.',
      '디자인은 다양한 분야와 디자이너 등이 참여하는 통합적 활동을 하는 것이다.'
    ],
    correctAnswer: 0,
    explanation: '심미적, 창조적 측면의 예술적 특성도 디자인 개념에 일부 속하지만 가장 중요하다고 할 수는 없습니다.',
    hintText: '디자인의 핵심은 무엇일까요? 예술적 특성보다 더 중요한 것을 생각해보세요. 디자인은 문제를 해결하는 과정이라는 점을 고려해보세요.'
  },
  {
    id: 2,
    subject: '서비스경험디자인기획설계',
    question: '다음 중 로널드 메이스(Ronald Mace)가 제시한 유니버셜 디자인의 7가지 원칙에 해당하지 않는 것은?',
    options: [
      '시스템 이미지(System Image)',
      '오류의 포용력(Tolerance for Error)',
      '인지하기 쉬운 정보(Perceptive Information)',
      '접근과 사용의 용이한 규격과 공간(Size and Space for Approach and Use)'
    ],
    correctAnswer: 0,
    explanation: '로널드 메이스가 제시한 유니버설 디자인의 일곱 가지 원칙은 공평성(Equitable), 사용상의 융통성(Flexibility in Use), 간결성과 직관성(Simple and Intuitive), 쉬운 정보(Perceptive Information), 오류의 포용력(Tolerance for Error), 적은 신체적 노력(Low Physical Effort), 접근과 사용을 용이한 규격과 공간(Size and Space for Approach and Use)입니다.'
  },
  {
    id: 3,
    subject: '서비스경험디자인기획설계',
    question: '다음 중 디자인씽킹에 대한 설명으로 옳지 않은 것은?',
    options: [
      '디자인씽킹은 디자이너처럼 사고하는 방법이다.',
      '디자인씽킹은 디자인 방법론을 통해 문제를 해결하도록 방향성을 제시한다.',
      '디자인씽킹은 사용자의 요구를 이해하고 발견하여 솔루션을 중심으로 문제를 해결하고자 노력한다.',
      '디자인씽킹은 인간의 감정과 디자이너를 출발점으로 디자인 과정을 구체적으로 실현하는데 초점을 둔다.'
    ],
    correctAnswer: 1,
    explanation: '솔루션 중심성 대한 설명은 감정적이다.',
    hintText: '디자인씽킹은 사용자 중심적 접근 방법입니다. 솔루션 중심이 아닌 무엇을 중심으로 하는지 생각해보세요.'
  },
  {
    id: 4,
    subject: '서비스경험디자인기획설계',
    question: '다음 설명에 해당하는 디자인씽킹 프로세스의 단계는?\n\n소비자, 고객에게 필요한 해결과제가 무엇인가를 찾아내기 위해서 활용하는 프로세스 또는 비즈니스의 목표를 수립하는 단계이다.',
    options: [
      '공감(Empathize) 단계',
      '문제 정의(Define) 단계',
      '아이디어 도출(Ideate) 단계',
      '테스트(Test) 단계'
    ],
    correctAnswer: 1,
    explanation: '문제 정의(Define) 단계는 공감 단계에서 소비자, 고객에 대한 이해를 바탕으로 인사이트를 도출하여 과연 어떤 문제를 해결해야 하고 목표를 수립하는 단계입니다.'
  },
  {
    id: 5,
    subject: '서비스경험디자인기획설계',
    question: '다음 중 디자인씽킹, 서비스디자인과 경험디자인의 공통으로 해당하는 특징으로 옳은 것을 <보기>에서 고른 것은?\n\n<보기>\nㄱ.통합성, ㄴ.객관적 공감, ㄷ.물리적 공간, ㄹ.특정적 공간, ㅁ.확산적 사고\n\n① ㄱ, ㄷ, ㅁ    ② ㄱ, ㄹ, ㅁ\n③ ㄴ, ㄷ, ㅁ, ㄹ   ④ ㄷ, ㅁ, ㄹ, ㅂ',
    options: [
      'ㄱ, ㄷ, ㅁ',
      'ㄱ, ㄹ, ㅁ',
      'ㄴ, ㄷ, ㅁ, ㄹ',
      'ㄷ, ㅁ, ㄹ, ㅂ'
    ],
    correctAnswer: 0,
    explanation: '디자인씽킹은 사용자와 수요자를 중심으로 통합적인 접근으로 예상적 중심의 해결책을 양으면서, 디자인씽킹, 서비스디자인, 경험디자인 3가지 모두 통합적 관점을 중시하며 디자인적 사고 능력을 통해 실험적인 분석과 특적 향상을 다루는는 설명적 해당되지 않는다.'
  },
  {
    id: 6,
    subject: '서비스경험디자인기획설계',
    question: '다음 중 서비스디자인에 대한 설명으로 옳지 않은 것은?',
    options: [
      '서비스디자인은 기업이 고객의 요구를 충족시키고 기업 외에 이해하기 쉬운 방법이다.',
      '서비스디자인은 서비스의 목적을 달성하고 다양한 방법적 도구를 결합한 학제간이다.',
      '서비스디자인은 사용자에게 총체적인 서비스를 제공하기 위한 시스템과 프로세스를 디자인한다.',
      '서비스디자인은 고객의 서비스 동향 경험하기 위한 모든 유·무형의 요소 정보에 대한 기업 축적의 맥락적(Contextual) 디자인 방법을 활용한다.'
    ],
    correctAnswer: 2,
    explanation: '서비스디자인은 고객의 서비스 동향 경험하기 위한 모든 유·무형의 요소 정보에 대한 고객 축적의 맥락적(Contextual) 디자인 방법을 활용한다.'
  },
  {
    id: 7,
    subject: '서비스경험디자인기획설계',
    question: '서비스 디자인의 핵심 원칙 중 하나인 사용자 중심 설계(UCD)의 가장 중요한 특징은 무엇인가?',
    options: [
      '기술적 완성도를 최우선으로 고려한다',
      '사용자의 요구사항과 행동을 깊이 이해하고 반영한다',
      '비용 절감을 최우선 목표로 한다',
      '빠른 개발 속도를 위해 단순화한다'
    ],
    correctAnswer: 1,
    explanation: '사용자 중심 설계(UCD)는 사용자의 요구사항, 행동 패턴, 목표를 깊이 이해하고 이를 설계에 반영하는 것이 핵심입니다.',
    hintText: 'UCD의 "U"는 무엇을 의미할까요? 사용자(User)를 중심으로 한다는 것이 핵심입니다.',
    hintImageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDIwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRkZGRUY3Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNGRjhGMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9ImJvbGQiPvCfkYUgVXNlcjwvdGV4dD4KPGNPCLE1cyBoZWlnaHQ9IjIwIiB3aWR0aD0iMjAiIGZpbGw9IiNGRkMxMDciIHJ4PSIxMCIvPgo8dGV4dCB4PSIxMDAiIHk9IjcwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjRkY4RjAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPkNlbnRlcmVkIERlc2lnbjwvdGV4dD4KPC9zdmc+'
  },
  {
    id: 8,
    subject: '서비스경험디자인기획설계',
    question: '서비스 블루프린트(Service Blueprint)에서 고객 여정선(Customer Journey Line) 위에 위치하는 요소는?',
    options: [
      '백스테이지 액션',
      '서포트 프로세스',
      '프론트스테이지 액션',
      '내부 인터랙션'
    ],
    correctAnswer: 2,
    explanation: '서비스 블루프린트에서 고객 여정선 위에는 고객이 직접 보고 경험할 수 있는 프론트스테이지 액션이 위치합니다.'
  },
  {
    id: 9,
    subject: '서비스경험디자인기획설계',
    question: '다음 <그림>은 스탠포드 대학의 D. School에서 개발한 디자인씽킹 프로세스이다. ①~⑤에 들어갈 알맞은 말을 쓰게 짝 지은 것은?',
    options: [
      '공감하기(Empathize) - 프로토타입 만들기(Prototype) - 평가하기(Test)',
      '관찰하기(Observation) - 상황화하기(Contextualization) - 발견하기(Invention)',
      '발견하기(Discover) - 개발하기(Develop) - 전달하기(Deliver)',
      '경험하기(Hear) - 창작하기(Create) - 전달하기(Deliver)'
    ],
    correctAnswer: 0,
    explanation: '스탠포드 대학의 D. School에서 개발한 디자인씽킹 프로세스는 공감하기(Empathize) - 정의하기(Define) - 아이디어 내기(Ideate) - 프로토타입 만들기(Prototype) - 평가하기(Test)입니다.'
  },
  {
    id: 10,
    subject: '서비스경험디자인기획설계',
    question: '다음 중 영국 디자인위원회(Design Council)의 더블 다이아몬드 모델에서 ①~⑧에 들어갈 알맞은 말을 쓰게 나열한 것은?',
    options: [
      '① 개발 - 발견 - 정의 - 전달',
      '② 발견 - 개발 - 정의 - 전달',
      '③ 발견 - 정의 - 개발 - 전달',
      '④ 정의 - 발견 - 개발 - 전달'
    ],
    correctAnswer: 2,
    explanation: '더블 다이아몬드 프로세스는 발견(Discover) - 정의(Define) - 개발(Develop) - 전달(Deliver)입니다.'
  },
  {
    id: 11,
    subject: '서비스경험디자인기획설계',
    question: '다음 중 서비스디자인의 질적 연구 방법론에 대한 설명으로 옳지 않은 것은?',
    options: [
      '데이터의 신뢰성을 검증하고 연구자의 해석을 개입하지 않는다.',
      '복잡 다맥락적 질적 연구에 해당하는 방법론을 접촉적으로 사용한다.',
      '사용자의 맥락과 환경에 몰입하여 공감하고 관찰하는 방법을 포함한다.',
      '질적 연구의 자료는 주로 시용적 가설인 언어로 도출한다.'
    ],
    correctAnswer: 0,
    explanation: '질적 연구에는 연구자의 프로그램을 통해서 데이터의 신뢰성을 검증하는 양적 연구와 달리 해석이 많이 개입됩니다.'
  },
  {
    id: 12,
    subject: '서비스경험디자인기획설계',
    question: '다음은 영국 디자인위원회(Design Council)가 제시한 더블 다이아몬드 모델(Double Diamond Model)에 관한 내용이다. 설명 내용에 해당하는 단계는?',
    options: [
      '① 개발하기',
      '② 발견하기',
      '③ 전달하기',
      '④ 정의하기'
    ],
    correctAnswer: 3,
    explanation: '정의하기 단계는 발견하기에서 나온 아이디어들을 분석하여 일정한 패턴이나 주제들로 나뉘어 어떤 문제에 집중해야 하고 어떤 방향으로 나아가야 할지 정하는 과정입니다.'
  },
  {
    id: 13,
    subject: '서비스경험디자인기획설계',
    question: '다음 <그림>의 확인 메시지의 사용성을 고려하여 디자인된 것이다. 이에 해당하는 사용성의 속성 중 옳은 것은?',
    options: [
      '① 개인화(Personalization)',
      '② 오류 예방(Error Prevention)',
      '③ 유연성(Flexibility)',
      '④ 일관성(Consistency)'
    ],
    correctAnswer: 1,
    explanation: '사용법의 오류를 줄일을 수 있는 사용자 입장에서 제기하거나 줄이 실수를 시스템이 방지하는 속성을 오류 예방(Error prevention)이라고 한다.'
  },
  {
    id: 14,
    subject: '서비스경험디자인기획설계',
    question: '다음 <그림>의 설명에 해당하는 용어는 옳은 것은?',
    options: [
      '① 넛지(Nudge)',
      '② 인지 부조화(Cognitive Dissonance)',
      '③ 조작 어포던스(Manual Affordance)',
      '④ 윤곽적 바이어스(Contour Bias)'
    ],
    correctAnswer: 2,
    explanation: '도돌등 노란은 질문듯한 보고 어떻게 조작해야 하는지 직관적으로 알 수 있는 것을 조작 어포던스(Manual Affordance)라고 정의하였다.'
  },
  {
    id: 15,
    subject: '서비스경험디자인기획설계',
    question: '다음에서 설명하는 서비스의 특성으로 옳은 것은?',
    options: [
      '① 불가분성(Inseparability)',
      '② 사용성(Usability)',
      '③ 소멸성(Perishability)',
      '④ 이질성(Heterogeneity)'
    ],
    correctAnswer: 0,
    explanation: '서비스의 제공자와 사용자는 분리될 수 없으며 서비스를 제공하면서 해결되는 서비스의 과정 시간에서 이루어져야 한다는 특성을 불가분성(Inseparability)이라고 한다.'
  },
  {
    id: 16,
    subject: '서비스경험디자인기획설계',
    question: '다음 설명에 해당하는 서비스디자인의 접근 방식은?',
    options: [
      '① 공동창작(Co-creation)',
      '② 맥락적 조사(Contextual Inquiry)',
      '③ 반복적 실행(Iterative Process)',
      '④ 빠른 시각화(Rapid Visualization)'
    ],
    correctAnswer: 1,
    explanation: '맥락적 조사는 사용자 중심의 디자인의 정보 조사 방법으로, 사용자가 사용하는 맥락에서 당사자 사용자의 행동을 관찰하고 대화로 인터뷰를 활용하여 사용자의 맥락적으로 이해하는 과정을 통해 숨겨진 요구사항을 파악하는 방법이다. 허용 압력은 사용자가 직접 참관 상황, 배경, 내외에 대한 이유나디어신을 위한 맥락 도구를 선택하는 심층 인터뷰를 시사는 시점의 맥락적 디자인이 필요한 상황이다.'
  },
  {
    id: 17,
    subject: '서비스경험디자인기획설계',
    question: '다음 중 서비스경험디자인 프로젝트의 연구사례를 파악하기 위한 내용으로 옳지 않은 것은?',
    options: [
      '① 제품 또는 서비스의 내부 목표와 외부 요구를 명시하여 한다.',
      '② 제품 또는 서비스의 내부 고객을 실질적 위해 사용자의 세부특성과 사용적 연구가 필요하다.',
      '③ 프로젝트 접태 분석은 내부 참여자 모두에 취합한다.',
      '④ 제품 또는 서비스의 브랜드 정체성을 시정하에서 지지스템과 한정되는 것이므로 사 단계에서 고려할 필요가 없다.'
    ],
    correctAnswer: 3,
    explanation: '제품 또는 서비스의 개념적인 아속하나 잘적이 반응을 예측할 때뿐안 지지계적 사용성을 결정하는 과정을 미리 고려해야 한다.'
  },
  {
    id: 18,
    subject: '서비스경험디자인기획설계',
    question: '서비스경험디자인 협업 단계에서 수비적인 고객의 니즈를 파악하기 위한 방법으로 옳은 것을 <보기>에서 모두 고른 것은?',
    options: [
      '① ㄱ, ㄴ',
      '② ㄱ, ㄴ, ㅁ',
      '③ ㄱ, ㄷ, ㅁ, ㅂ',
      '④ ㄱ, ㄷ, ㄹ, ㅁ, ㅂ, ㅅ'
    ],
    correctAnswer: 3,
    explanation: '서비스 경험자는 문제 발견과 솔루션 생성을 위해 각 상황에서, 이해관계자 지도는 정의 단계에서 해당 소비자와 고객의 연관된 다양한 이해관계를 분석하는 방법이다.'
  },
  {
    id: 19,
    subject: '서비스경험디자인기획설계',
    question: '다음 중 간트(Gantt) 차트에 대한 설명으로 옳지 않은 것은?',
    options: [
      '① 활동 간의 상호 연관성을 보여 주기 용이하므로 규모가 크고 복잡한 프로젝트에 적합하다.',
      '② 프로젝트를 범계의 활동으로 세분화하여 진리에 필요한 예측을 가능하게 하며 보고 이해하기 쉽다.',
      '③ 활동의 수행 시간이 시간관에 설정한 표시되어 프로젝트의 제일관과 상호 관련하는 데 유용하다.',
      '④ 프로젝트 관리가 차트를 작성하는 과정에서 활동 연관성을 정확 사정에 대해 세밀하게 생각할 수 있도록 도와준다.'
    ],
    correctAnswer: 0,
    explanation: '간트 차트는 활동 간의 상호 연관성에 대해 분명할 보여 주지 못하기 때문에 규모가 크고 복잡한 프로젝트에는 부적합하다.'
  },
  {
    id: 20,
    subject: '서비스경험디자인기획설계',
    question: '다음 중 디자인 리서치 수행 시 개인정보보호에 대한 설명으로 옳지 않은 것은?',
    options: [
      '① 개인정보의 이용 취지가 가능한 경우에는 이렇게 처리한다.',
      '② 리서치 담당자가 누구인지 추측할 수 있는 세부 데이터를 사용하지 않는다.',
      '③ 개인정보 처리 목적과 위해 요소는 보전을 명확하게 알릴 주저 없이도 된다.',
      '④ 개인정보 처리 목적에 부합하는 범위에서 최소한의 개인정보만을 처리하고 적잘하여 정당하게 수집해야 한다.'
    ],
    correctAnswer: 2,
    explanation: '개인정보 처리취는 개인정보의 처리 목적을 명확하게 하여야 하고, 해당 리서치의 주제와 목적, 이러한 위험 요소에 대해 설명해야 한다.'
  },
  {
    id: 21,
    subject: '사용자조사분석',
    question: '사용자 인터뷰에서 편향을 최소화하기 위한 가장 적절한 질문 방식은?',
    options: [
      '예/아니오로 답할 수 있는 폐쇄형 질문',
      '유도 질문을 통한 명확한 답변 도출',
      '개방형 질문을 통한 자유로운 의견 표현',
      '가설을 먼저 제시하고 확인하는 방식'
    ],
    correctAnswer: 2,
    explanation: '개방형 질문은 사용자가 자신의 경험과 생각을 자유롭게 표현할 수 있게 하여 편향을 최소화하고 예상치 못한 인사이트를 얻을 수 있습니다.'
  },
  {
    id: 22,
    subject: '사용자조사분석',
    question: '페르소나(Persona) 개발 시 가장 중요한 데이터 출처는?',
    options: [
      '마케팅팀의 타겟 고객 분석',
      '경쟁사 분석 자료',
      '실제 사용자 조사 데이터',
      '내부 직원들의 의견'
    ],
    correctAnswer: 2,
    explanation: '페르소나는 실제 사용자 조사를 통해 수집된 데이터를 바탕으로 만들어져야 실제 사용자를 대표할 수 있습니다.'
  },
  {
    id: 23,
    subject: '사용자조사분석',
    question: '다음 사례에서 A 기업이 실시한 조사분석 기법은?',
    options: [
      '① 4D',
      '② 4P',
      '③ IPO',
      '④ SWOT'
    ],
    correctAnswer: 3,
    explanation: 'SWOT 분석은 경쟁력(Strength), 약점(Weakness), 기회(Opportunity), 위험(Threat)의 마라금자를 모아 만든 단어로, 경영 전략을 수립하기 위한 분석 도구이다.'
  },
  {
    id: 24,
    subject: '사용자조사분석',
    question: '다음 중 데스크 리서치에 대한 설명으로 옳은 것은?',
    options: [
      '① 소셜 미디어를 통한 자료 수집은 정량적이고 신뢰할 만한 정보인 있는 정보로 수집하는 데 적절하다.',
      '② 데스크 리서치는 사용자의 잠재적인 가치와 의견, 명시적이지 않게 적이된 정보를 획득하는 데 적절하다.',
      '③ 데스크 리서치는 서비스의 이해관계자들의 현재 관계를 파악하고 이후 서비스의 소구 사항과 등기를 시각화하기 위한 방법이다.',
      '④ 데스크 리서치는 대상 서비스에 대한 문헌 조사를 바탕으로 대상 서비스가 놓여 있는 대략적 상황을 파악하는 것을 목표로 한다.'
    ],
    correctAnswer: 3,
    explanation: '정량적이고 신뢰할 수 있으며 정보인 있는 정보로 수집하는 데는 설문답을 통한 지표 수집이 적절하다.'
  },
  {
    id: 25,
    subject: '사용자조사분석',
    question: '다음에서 설명하는 조사 기법으로 옳은 것은?',
    options: [
      '① 맥락적 조사(Contextual Inquiry)',
      '② 심층 인터뷰(In-depth Interview)',
      '③ 전문가 인터뷰(Expert Interview)',
      '④ 휴리스틱 평가(Heuristic Evaluation)'
    ],
    correctAnswer: 3,
    explanation: '전문가 인터뷰(Expert Interview)는 기존, 비즈니스, 사용자, 문화, 정책 등 다양한 분야의 연구에서 활용할 수 있으며 과정에 전지식 서식팀 아니라 미비함이 예측되는 데도 연구된다.'
  },
  {
    id: 26,
    subject: '사용자조사분석',
    question: '다음 중 사용자 분류에 대한 설명으로 옳지 않은 것은?',
    options: [
      '① 사용자의 태도, 능력, 성호시, 만족도는 시립적 특성 취정에 해당한다.',
      '② 사용자의 유형을 해당 서비스 정향에 따라 세분화하는 것은 사용자의 행동 법수 기준에 따른 것이다.',
      '③ 대상 서비스의 사용자 유형 특성을 파악하려면 가장 중요하다고 판단되는 분류 기준 2개를 설정하여 이들 두 축으로 한 4사분면의 좌표 위에 대상자 그룹을 매핑 분류한다.',
      '④ 사용자 유형 분류는 서비스를 사용하는 사람은 누구이며, 이러한 요구 사항을 가지고 있고, 그들에게 어떠한 가치를 제공해야 하는가를 판단하는 기준을 마련하기 위해 사용한다.'
    ],
    correctAnswer: 1,
    explanation: '사용자의 유형을 이용 형태에 따라 세분화하는 것은 서비스 관련 법수 기준에 따른 것이다.'
  },
  {
    id: 27,
    subject: '사용자조사분석',
    question: '다음 중 상업 서비스에 관여하는 이해관계자(Stakeholder) 조사분석에 대한 설명으로 옳지 않은 것은?',
    options: [
      '① 현재 상황에서 가치를 만들어 내는 데 참여하고 있는 모든 주체가 포함된다.',
      '② 사용자(User)와 이해관계자(Stakeholder)의 역할 차이를 파악하는 단계에서 동기를 시각화한다.',
      '③ 서비스 주진 게임 수급자 협의 도출을 위해 이해관계자 간의 상호작용 내용 조사를 토대로 이해관계자 구조 및 관인을 분석한다.',
      '④ 이해관계자의 요구사항 분석을 수행하는 단계에 서비스 가치 효율성(Value Stream Map)이 어떤 계산(Money) 가치는 효과에 미치는 것이다.'
    ],
    correctAnswer: 1,
    explanation: '서비스 가치 효율도에 효과치는 계산(Money) 이외에도 해당 이해관계자가 가지 받다고 여기는 것을 함께 표시도록 한다.'
  },
  {
    id: 28,
    subject: '사용자조사분석',
    question: '다음 중 비디오 에스노그래피(Video Ethnography)의 진행 방식으로 옳지 않은 것은?',
    options: [
      '① 참가자가 스스로 녹화하는 방식으로 진행될 수도 있다는 것이다.',
      '② 시진에 각성한 내용에 따라 질문하고 인터뷰 중단할 내 용으로 내용정을 해한다.',
      '③ 비디오 에스노그래피는 영상 에스노그래피(Visual Ethnography) 분석에서 시용된 방법이다.',
      '④ 녹화를 위한 가이드라인을 만들어 허락을 받은 다음 비디오로 녹화하고 추후 분석에 활용한다.'
    ],
    correctAnswer: 1,
    explanation: '리서치의 목표를 설정하고 인터뷰가 출러지는 데로 응황을 적절히 조절해야 한다.'
  },
  {
    id: 29,
    subject: '사용자조사분석',
    question: '다음에서 가능한 관찰 방법에 대한 설명으로 옳은 것은?',
    options: [
      '① 섀도잉(Shadowing)',
      '② 사용자 다이어리(User Diary)',
      '③ 참여 관찰(Participant Observation)',
      '④ 탐문(Obtaining Information)'
    ],
    correctAnswer: 2,
    explanation: '참여 관찰은 사용들의 상황과 행동을 제대로 이해하기 위해 직접 던임 월들이나 환경, 문화 허락된 통일 앙의의 직와 참여에 모든, 참여자와 말적지적인 방법이다.'
  },
  {
    id: 30,
    subject: '사용자조사분석',
    question: '다음 <보기>의 온라인 에스노그래피 수행 과정을 순서대로 쓰게 나열한 것은?',
    options: [
      '① ㄴ → ㄱ → ㄷ → ㄹ → ㅁ',
      '② ㄴ → ㄷ → ㄱ → ㄹ → ㅁ',
      '③ ㄷ → ㄴ → ㄱ → ㄹ → ㅁ',
      '④ ㄷ → ㄱ → ㄴ → ㄹ → ㅁ'
    ],
    correctAnswer: 2,
    explanation: '온라인 에스노그래피의 수행 과정은 계획적이고, 참가자 모집, 데이터 수집, 분석이다.'
  },
  {
    id: 31,
    subject: '사용자조사분석',
    question: '다음은 지지체에서 수행할 서비스디자인 프로젝트 시례이다. 서비스디자인 탐이 선택할 수 있는 서적적 관찰 방법으로 옳은 것을 <보기>에서 고른 것은?',
    options: [
      '① ㄱ, ㄴ, ㄷ',
      '② ㄴ, ㄷ, ㄹ',
      '③ ㄷ, ㄹ, ㅁ',
      '④ ㄱ, ㄹ, ㅁ, ㅂ'
    ],
    correctAnswer: 3,
    explanation: '사용자가 직접 참여하는 관찰 조사는 다이어리 연구, 문화적 프로브, 크라우드 소싱이다.'
  },
  {
    id: 32,
    subject: '사용자조사분석',
    question: '다음 설명에 해당하는 모델은?',
    options: [
      '① 개념 모델(Conceptual Model)',
      '② 멘탈 모델(Mental Model)',
      '③ 페르소나 모델(Persona Model)',
      '④ 행동 모델(Behavior Model)'
    ],
    correctAnswer: 1,
    explanation: '사용자의 상호작용에 초전을 두어 의사결정에서 주요하게 활황하는 인지적 모델을 멘탈 모델이라고 한다.'
  },
  {
    id: 33,
    subject: '사용자조사분석',
    question: '다음 중 인터뷰의 질문 형식에 관한 설명으로 옳은 것은?',
    options: [
      '① 폐쇄형 질문은 연구자의 초기 단계에서 응답의 범위를 파악하는 데 도움이 되어 탐색적 연구나 예비 조사에 유용하다.',
      '② 폐쇄형 질문은 비교적 사용용을 얻는 수 있지만 가능하여, 예상치 못한 다양한 답변을 기대하기 힘고, 응답자의 제공하는 방향의 의지된 정점이 아닐 수 있다.',
      '③ 개방형 질문은 시간 단촌 응답작의 반응을 비교하기 힘고, 응답자의 제공하는 방향의 의지된 정점이 아닐 수 있다.',
      '④ 개방형 질문은 용답에 사례어지만 많은 정치 부담을 주요 용답의 최적에 연관 나경이 가설과 습욘재 수입의 크성이 좋고 어려운 이루지 나된 이해관계자와 추인 연관능 마질적 신인 어느 인터뷰를 이어나간다.'
    ],
    correctAnswer: 1,
    explanation: '폐쇄형 질문은 시간 나된 응답자의 반응을 비교하기 힘고, 응답자의 제공하는 방향의 의지된 정점이 아닐 수 있다.'
  },
  {
    id: 34,
    subject: '사용자조사분석',
    question: '다음 <보기>의 사용성 평가와 관련한 연구 및 조사 윤리에 대한 설명 중 옳은 것은?',
    options: [
      '① ㄱ',
      '② ㄱ, ㄴ',
      '③ ㄱ, ㄴ, ㄷ',
      '④ ㄱ, ㄴ, ㄷ, ㅁ'
    ],
    correctAnswer: 1,
    explanation: '인간 대상 연구나 허디아도 연구 대상자 및 중당에 따른는 위험이 미미하다고 값다되는 경우에도 속한 수소적 신도로서 정성 기존에 많는 연구는 의상신머심위원회 시정을 민간할 수 있다. 라디오 심각전원회 대상자 심위원회 식정(Institution Review Board: IRB)의 사전 심격을 거져야 한다.'
  },
  {
    id: 35,
    subject: '사용자조사분석',
    question: '다음 설명에 해당하는 인터뷰 방법론은?',
    options: [
      '① 구조적 인터뷰',
      '② 반구조적 인터뷰',
      '③ 비구조적 인터뷰',
      '④ 표준화 인터뷰'
    ],
    correctAnswer: 1,
    explanation: '반구조적 인터뷰(준표준화 면접, Semi-standardized interview)는 주제에 내용 등을 표준화하고 면접 지침을 작성하여 사용하되, 이 지침의 범위 아에서 대체로 질문 순서나 형식 등은 면접자가 재량을 가지고 상황에 따라 충동성 있게 조절할 수 있다.'
  },
  {
    id: 36,
    subject: '사용자조사분석',
    question: '다음 중 ⑤에 들어갈 용어로 옳은 것은?',
    options: [
      '① 로그(Log)',
      '② 프로토콜(Protocol)',
      '③ 추적(Tracking)',
      '④ 프로브(Probe)'
    ],
    correctAnswer: 3,
    explanation: '로그(Log) 역량은 IT에서 발생하는 모든 행위와 이번트 정보를 시간에 따라 남기는 기록 내역이라 의미한다. 개별 사용자의 행동을 프로그 동록하고 이 로그 분석을 통해 사용자의 행동 패턴 등을 분석할 수 있다.'
  },
  {
    id: 37,
    subject: '사용자조사분석',
    question: '다음은 사용자 조사 수행 시 방법론에 있는 설명 옳다 떩잔에 대한 사례이다. 사례에 공통적으로 해당하는 설명 옳다 평잔으로 옳은 것은?',
    options: [
      '① 통촌 면담',
      '② 사회적 선망 편향',
      '③ 유월성 편향',
      '④ 섣단 편향'
    ],
    correctAnswer: 1,
    explanation: '사회적 선망 편향(Social Desirability Bias)이란 사항들이 사회적 특성 가치를 묻는 질문에 시회규범상 바람직하다고 생각하는 가정에 맞게 대답을 왜곡하여 표현하는 경향을 말한다.'
  },
  {
    id: 38,
    subject: '사용자조사분석',
    question: '다음 중 사용성 평가 수행 후 이루어지는 통계분석에 대한 설명으로 옳지 않은 것은?',
    options: [
      '① 기술통계학은 자료를 요나 그래프로 나타내어 중심 경향단일 산포도와 같은 특성들을 위한 학문분야 수집한다.',
      '② 일원 반수 분산분석 시 나타 변수에 미치는 영향변의 그기를 수학적 곽례적으로 추정하고 붙석하는 방법을 회귀분석이라고 한다.',
      '③ 쌍체별 t-검정은 Pair-wise 의 두 변수 간에 서로 긍채가 됫든 수 있으면 심져쳐나구 두, 이에 가개링점수를 두 변수 사이의 관계가 높아진다.',
      '④ 대닶지세은 관계가지 모집단에 대해 앞고 있는 정보를 나타내 가설이며, 대닶지세은 별허된 포집단에 대해 추축할 정보를 나타난 가경을 의미한다.'
    ],
    correctAnswer: 1,
    explanation: '귀무가설은 관계가지 모집단에 대해 앞고 있는 정보를 나타내 가설이며, 대닶지세은 별허된 포집단에 대해 추축할 정보를 나타난 가경을 의미한다.'
  },
  {
    id: 39,
    subject: '사용자조사분석',
    question: '다음 중 FGI에 대한 설명으로 옳지 않은 것은?',
    options: [
      '① 단발을 분석하기 어렵고 우정항들이 능다.',
      '② 사간이 오래 걸리고 관료 능력이 부족한 응답자에게 적용하기 어렵다.',
      '③ 응답자에게 심리 부담을 주어 답변의 예지에 편견이 개립할 수지가 있다.',
      '④ 문제의 허용을 파악하고지 하는 연구의 비지백 단계에서 유용하며, 괴헵될 질컨 아제에 응답자의 발명을 정도 있게 파악하기 위해 사용하기도 한다.'
    ],
    correctAnswer: 2,
    explanation: '개방형 질문은 응답자가 표준에 대한 청발들 가지고 있시 얻기나 엿엇안 조정자에 초사 응력에 헵적적으로 과외치 하는 연구의 초기 단계에서 유용하며, 괴헵될 질컨 아제에 응답자의 발명을 집호 있게 파악하기 위해 사용하기도 한다.'
  },
  {
    id: 40,
    subject: '사용자조사분석',
    question: '다음을 실시간 화상회의를 포커스 그룹 인터뷰(FGI)를 진행할 때 퍼실리테이터(Facilitator)가 고려한 내용이다. ①~③ 중 옳지 않은 것은?',
    options: [
      '① ㄱ, ㄹ',
      '② ㄱ, ㄴ',
      '③ ㄴ, ㄷ',
      '④ ㄷ, ㄹ'
    ],
    correctAnswer: 1,
    explanation: '개인 적룩을 나 체력으로 패킷리데이터에게 점압하여 빈 마우스 사용자가 발미량을 능취히 켖으록 하고, 능취히 능용항 하거 위해서는 참여자를 의 사전 종러로 받아야 한다.'
  },
  {
    id: 41,
    subject: '사용자중심전략수립',
    question: '사용자 경험 전략 수립 시 가장 먼저 고려해야 할 요소는?',
    options: [
      '기술적 제약사항',
      '비즈니스 목표와 사용자 니즈의 균형',
      '개발 일정',
      '예산 한계'
    ],
    correctAnswer: 1,
    explanation: '사용자 경험 전략은 비즈니스 목표와 사용자 니즈 간의 균형을 찾는 것이 가장 중요하며, 이를 바탕으로 다른 제약사항들을 고려해야 합니다.'
  },
  {
    id: 42,
    subject: '사용자중심전략수립',
    question: 'UX 로드맵 작성 시 우선순위 결정에 가장 중요한 기준은?',
    options: [
      '개발 난이도',
      '사용자 임팩트와 비즈니스 가치',
      '개발팀 선호도',
      '최신 기술 트렌드'
    ],
    correctAnswer: 1,
    explanation: 'UX 로드맵의 우선순위는 사용자에게 미치는 영향과 비즈니스 가치를 종합적으로 고려하여 결정해야 합니다.'
  },
  {
    id: 43,
    subject: '사용자중심전략수립',
    question: '다음 중 서비스 환경 분석 방법과 그에 대한 설명으로 옳게 짝지어진 것은?',
    options: [
      '① 거시환경 - 사용자',
      '② 거시환경 - 미시환경 - 경쟁환경',
      '③ 미시환경 - 거시환경 - 경쟁환경',
      '④ 내부환경 - 외부환경 - 미시환경'
    ],
    correctAnswer: 2,
    explanation: '서비스 환경 분석은 거시환경 - 미시환경 - 경쟁환경 순서로 분석합니다.'
  },
  {
    id: 44,
    subject: '사용자중심전략수립',
    question: '다음에서 설명하는 SWOT 전략에 해당하는 것은?',
    options: [
      '① SO 전략',
      '② ST 전략',
      '③ SW 전략',
      '④ WO 전략'
    ],
    correctAnswer: 1,
    explanation: 'ST 전략은 강점을 활용해 위험을 최소화하는 전략이다.'
  },
  {
    id: 45,
    subject: '사용자중심전략수립',
    question: '다음 중 ⑤에 해당하는 내용으로 옳은 것은?',
    options: [
      '① Avatar',
      '② Blockchain',
      '③ DAO',
      '④ NFT'
    ],
    correctAnswer: 3,
    explanation: 'NFT는 블록체인 기술을 활용해 충복과 영상 등 특정 디지털 창작물의 소유권을 확인할 수 있는 고유한 인식 값을 부여하므로 위변조가 어렵다.'
  },
  {
    id: 46,
    subject: '사용자중심전략수립',
    question: '다음 <그림>에서 시장 세분화(market segments)와는 달리 페르소나만이 사용되는 ⑤의 영역에 해당하는 것은?',
    options: [
      '① 현재 모델',
      '② 멘탈 모델',
      '③ 업무 역할',
      '④ 필요 서비스'
    ],
    correctAnswer: 1,
    explanation: '멘탈 모델은 사용자가 특정을 달성하고 할 때 어떤한 방식으로 진행될 것이라 예상하는 인간의 사고 과정을 구조화한 것이다. 페르소나를 구성하는 주요한 요소인 하나로 사용객을 이해하고 사용할 수 있는 시스템을 디자인할 때 주요한 골격 단계이다.'
  },
  {
    id: 47,
    subject: '사용자중심전략수립',
    question: '다음 중 <보기>에서 디자인 프로세스에 따른 시나리오의 단계별 순서를 옳게 나열한 것은?',
    options: [
      '① ㄱ → ㄴ → ㄷ',
      '② ㄱ → ㄷ → ㄴ',
      '③ ㄷ → ㄱ → ㄴ',
      '④ ㄷ → ㄴ → ㄱ'
    ],
    correctAnswer: 1,
    explanation: '정답 시나리오는 사용자의 니즈를 만족시키는 과정을 낸은 시예에서 바뀌는 단 긴다달다. 주요 절차 시나리오는 사용자가 제품이나 서비스를 활용하여 목적을 달성하는 단계별 디지인 요구사항을 수적하한다.'
  },
  {
    id: 48,
    subject: '사용자중심전략수립',
    question: '다음 <보기>의 페르소나 제작 방법을 순서대로 올바르게 나열한 것은?',
    options: [
      '① ㄱ → ㄷ → ㄹ → ㄴ → ㅁ',
      '② ㄱ → ㄷ → ㄴ → ㄹ → ㅁ',
      '③ ㄷ → ㄱ → ㄴ → ㄹ → ㅁ',
      '④ ㄷ → ㄱ → ㄴ → ㄹ → ㅁ'
    ],
    correctAnswer: 2,
    explanation: '페르소나 제작 방법의 순서는 데이터 수집 → 데이터 분석 → 사용자 유형 분류 → 페르소나 프로필 작성 → 검증 및 수정입니다.'
  },
  {
    id: 49,
    subject: '사용자중심전략수립',
    question: '다음 <그림>은 서비스경험디자인 컨셉 여정을 자동적으로 설설해 주는 온라인 도구에서 제작된 고객 여정 지도이다. ①~⑤에 들어갈 내용을 올바르게 짝지은 것은?',
    options: [
      '① 스테이지 - 감정 곡선 - 커뮤니케이션 채널',
      '② 스테이지 - 터치포인트 - 서비스 스케치로',
      '③ 채널 - 터치포인트 - 커뮤니케이션 채널',
      '④ 채널 - 감정 곡선 - 터치포인트'
    ],
    correctAnswer: 2,
    explanation: '고객 여정 지도의 구성 요소는 스테이지, 터치포인트, 서비스 스케치로입니다.'
  },
  {
    id: 50,
    subject: '사용자중심전략수립',
    question: '다음 중 이해관계자 지도(Stakeholder Map)에 대한 설명으로 옳지 않은 것은?',
    options: [
      '① 페르소나(Persona)를 정의하고 확인할 수 있다.',
      '② 서비스에 대한 전과정을 가진 사람을 파악할 수 있다.',
      '③ 관련 서비스로 인해 이익과 피해를 보는 사람을 파악할 수 있다.',
      '④ 해당 서비스의 주요 의견림 특정에 따라 유용성을 분류할 수 있다.'
    ],
    correctAnswer: 0,
    explanation: '이해관계자 지도(Stakeholder Map)는 서비스와 관련된 다양한 사람들을 시각화하는 방법으로, 기성의 사용자인 페르소나(Persona)에 대한 구체적인 정보는 제공하지 않는다.'
  },
  {
    id: 51,
    subject: '사용자중심전략수립',
    question: '다음에서 설명한 서비스경험디자인 방법의 명칭으로 적합한 것은?',
    options: [
      '① 고객 여정 지도(Journey Map)',
      '② 마인드 매핑(Mind Mapping)',
      '③ 비즈니스 모델 캔버스(Business Model Canvas)',
      '④ 친화도 지도(Affinity Diagram)'
    ],
    correctAnswer: 3,
    explanation: '친화도 지도(Affinity Diagram)는 조사를 통해 수집된 정보로 연관성에 따라 분류하고, 유사성을 찾아내어 분석의 틀성을 이해하는 방법이다.'
  },
  {
    id: 52,
    subject: '사용자중심전략수립',
    question: '다음 <그림>의 온라인 공동창작(Co-creation) 활동의 특성으로 옳지 않은 것은?',
    options: [
      '① 이한한 활동을 바주인 여섬리테이션이라고 부르기도 한다.',
      '② 칙접적 내각나 투표하는 활동이 오프라인니다 협력되의 참여자들이 손누적으로 배능한다.',
      '③ 원활한 진행을 위해 위크룀 당편 예상되는 참여자들의 리스토에 대응할 수 있도록 기술 전반께를 둔다.',
      '④ 온라인 공동창작 참여자들의 역동성을 이포한나기 위해서는 다양한 툴을 활용해 잔성한 한기백에 한다.'
    ],
    correctAnswer: 1,
    explanation: '온라인의 특성이나 온라인에서 가능한 것들을 능해 오프라인에서는 구운되는 다목적 창작을 구축할 수 있다.'
  },
  {
    id: 53,
    subject: '사용자중심전략수립',
    question: '다음 중 온라인으로 이루어지는 공동창작(Co-creation) 워크숍에 대한 설명으로 옳지 않은 것은?',
    options: [
      '① 시의 지식, 피르간 등으로 인해 참가자의 집중도가 낮아질 수 있으므로 효율적인 워크숍 시간 관리 계획이 필요하다.',
      '② 디지털 환경에서 날끄고 세로운 도구로 인해 축감적인 적응을 수행하려는 요정차럼 느끼지 하는츠의 성취도 컨츄얼 수 있다.',
      '③ 워크숍 진행중의 창업 셜명, 나이, 리리 등의 개인적인 정제 널 프로필을 참여 인발례에게 서전에 층허하여 전김황을 드는도록 한다.',
      '④ 아이디어 발상을 위해 변가을 워크 활용하거나 효율적으로 참여 인발의 칠건 이극득 등독 빛 기능화여 양설을 적신애에 한다.'
    ],
    correctAnswer: 2,
    explanation: '진행자는 참여자가 주제에 대해 만족스럽 반응하도록 친밀 사직간적 촉진 출 수 어지만, 참여자의 개인적 프로탄아나 정신을 공유하려면 사간 등이 필요하다.'
  },
  {
    id: 54,
    subject: '사용자중심전략수립',
    question: '다음 <보기>에서 에드워드 드 보노(Edward de Bono)의 여섯 색깔 모자 (Six thinking Hats) 기법에 대한 정절을 고른 것은?',
    options: [
      '① ㄱ, ㄴ, ㄷ, ㅁ',
      '② ㄱ, ㄷ, ㄹ, ㅁ',
      '③ ㄴ, ㄷ, ㄹ, ㅂ',
      '④ ㄷ, ㄹ, ㅂ, ㅅ'
    ],
    correctAnswer: 1,
    explanation: '여섯 색깔 모자 기법은 창의적 사고를 촉진하기 위한 도구입니다.'
  },
  {
    id: 55,
    subject: '사용자중심전략수립',
    question: '다음 <그림>과 설명에 대한 이유으로 옳지 않은 것은?',
    options: [
      '① 정보 전달 연구 기법(Informance)의 방식을 취한다.',
      '② 이 방법은 역할 높이와 모의실험을 결합한 체험형 프로라인드정 방법이다.',
      '③ 이 방법을 실행하기 위한 준비물로는 정로과 소도구와 물러져 즈거출의 필요하다.',
      '④ 역작지으로 아이디어를 경우하고 곱생들을 도출하는 등 아이디어를 실현해 보는 것을 목표로 한다.'
    ],
    correctAnswer: 0,
    explanation: '그럼의 바디스토밍 기법으로 사용자의 정의을 프로토타입으로 만들어 보는 과정이다. 프로토타입이나 물리적 즈거를 정의화에 만들기보다는 살제 정의을 체험할 수 있도록 매드는 것이 주요한 목표이다.'
  },
  {
    id: 56,
    subject: '사용자중심전략수립',
    question: '다음 <표>는 스캠퍼(SCAMPER) 방법의 각 아이디어 발상법에 해당하는 내용이다. ①~⑤에 들어갈 알맞을 올바르게 짝지은 것은?',
    options: [
      '① 용도변경 - 제거 - 덜발기',
      '② 용도변경 - 생략 - 덜발기',
      '③ 제도변경 - 생략 - 위로 접히는 유산',
      '④ 제도변경 - 제거 - 위로 접히는 유산'
    ],
    correctAnswer: 2,
    explanation: 'SCAMPER 기법의 각 단계에 따른 적절한 용어들을 매칭한 것입니다.'
  },
  {
    id: 57,
    subject: '사용자중심전략수립',
    question: '다음 칸푸오루어 칸체에서 <표>의 카노 평가 테이블(Kano Evaluation Table)의 ⑤에 들어갈 알맞은 내용을 고른다?',
    options: [
      '① O',
      '② A',
      '③ M',
      '④ I'
    ],
    correctAnswer: 2,
    explanation: '카노 모델에서 M은 Must-have(당연품질)를 의미합니다.'
  },
  {
    id: 58,
    subject: '사용자중심전략수립',
    question: '다음 설명에 해당하는 용어와 구성 요소가 올바르게 결령된 것은?',
    options: [
      '① 감정 곡선(Emotional Curve)',
      '② 추레페어, 하드웨어, 소프트웨어',
      '③ 디자인 가치(Design Value)',
      '④ 서비스 접점(Service Touch Point)'
    ],
    correctAnswer: 3,
    explanation: '서비스 접점(Service Touch Point) - 사람, 제품, 프로세스, 장소'
  },
  {
    id: 59,
    subject: '사용자중심전략수립',
    question: '다음 중 프로토타입 모델을 설계하기 위해 <보기>의 작업을 순서대로 쓰게 나열한 것은?',
    options: [
      '① ㄱ → ㄷ → ㄹ → ㄴ → ㅁ → ㅂ',
      '② ㄴ → ㄷ → ㄱ → ㄹ → ㅁ → ㅂ',
      '③ ㄷ → ㄱ → ㄴ → ㄹ → ㅁ → ㅂ',
      '④ ㄹ → ㅁ → ㄴ → ㄹ → ㄴ → ㄱ'
    ],
    correctAnswer: 1,
    explanation: '프로토타입 모델 설계의 올바른 순서입니다.'
  },
  {
    id: 60,
    subject: '사용자중심전략수립',
    question: '다음 <그림>은 서비스경험디자인을 위한 디자원 도구이다. 이에 대한 설명으로 옳은 것은?',
    options: [
      '① 개별 작업하므로 온라인 협업이 가능하지 않다.',
      '② 이와 비슷한 도구로는 줌, 구글 매, 구로미 등이 있다.',
      '③ 그룬 스게치의 사용빈도 도구로 사용적 리서치 단계에서 활용한다.',
      '④ 나되든, 구현 능력, 사용성 평가 여각배 따라 도구 선택의 기준이 달라진다.'
    ],
    correctAnswer: 3,
    explanation: '그링의 디지털 도구는 그룬 스게치의 사용빈도 도구로, 온라인 협업이 가능하며 서비스 제안 단계에서 사용된다.'
  },
  {
    id: 61,
    subject: '사용자중심전략수립',
    question: '사용자 경험 전략 수립 시 가장 먼저 고려해야 할 요소는?',
    options: [
      '기술적 제약사항',
      '비즈니스 목표와 사용자 니즈의 균형',
      '개발 일정',
      '예산 한계'
    ],
    correctAnswer: 1,
    explanation: '사용자 경험 전략은 비즈니스 목표와 사용자 니즈 간의 균형을 찾는 것이 가장 중요하며, 이를 바탕으로 다른 제약사항들을 고려해야 합니다.'
  },
  {
    id: 62,
    subject: '사용자중심전략수립',
    question: 'UX 로드맵 작성 시 우선순위 결정에 가장 중요한 기준은?',
    options: [
      '개발 난이도',
      '사용자 임팩트와 비즈니스 가치',
      '개발팀 선호도',
      '최신 기술 트렌드'
    ],
    correctAnswer: 1,
    explanation: 'UX 로드맵의 우선순위는 사용자에게 미치는 영향과 비즈니스 가치를 종합적으로 고려하여 결정해야 합니다.'
  },
  {
    id: 63,
    subject: '서비스경험디자인개발및운영',
    question: '다음 업무 방법(Business Method) 특허에 대한 설명 중 옳은 것만을 <보기>에서 고른 것은?',
    options: [
      '① ㄱ, ㄴ, ㅁ',
      '② ㄴ, ㄷ, ㅂ',
      '③ ㄱ, ㄷ, ㅁ, ㅂ',
      '④ ㄱ, ㄴ, ㄷ, ㅂ'
    ],
    correctAnswer: 1,
    explanation: 'BM특허는 특허의 한 분야로 영업 방법을 특허 대상으로 한다는 점을 제외하고는 일반 특허와 차이가 없기 때문에 메타놀의 등정권이 인정된다. 순수 영업 방법 자체만으로는 BM특허의 대상이 되지 않으며, 우선 대상 요소를 구체하는 장치는 우선 설치를 요정할 수 있다.'
  },
  {
    id: 64,
    subject: '서비스경험디자인개발및운영',
    question: '다음 중 프로토타입 평가 과정에 대한 설명으로 옳지 않은 것은?',
    options: [
      '① 목적을 명확하게 정의하는 것이 필요하다.',
      '② 사용자가 이해관계자로부터 피드백을 얻기 위한 것이다.',
      '③ 실제 구현 단계에 들어가기 전 품질과 성능을 확인하는 과정이다.',
      '④ 제기 방법은 프로토타입의 형식, 완성과 예산, 목적, 디자인에 따라 달라질 수 있다.'
    ],
    correctAnswer: 1,
    explanation: '프로토타입 평가 과정은 사용자와 이해관계자로부터 피드백을 얻기 위한 것이다.'
  },
  {
    id: 65,
    subject: '서비스경험디자인개발및운영',
    question: '다음 중 ②에 ②에 들어갈 알맞은 말을 쓰게 짝지은 것은?',
    options: [
      '① 인지 특성 - 소비 지수',
      '② 선호도 - 만족',
      '③ 행동 - 맥락(Context)', 
      '④ 인구통계 - 표준편차'
    ],
    correctAnswer: 2,
    explanation: '정성적 평가는 태도, 언어, 문장, 행동 등의 주관적인 데이터를 다룬다.'
  },
  {
    id: 66,
    subject: '서비스경험디자인개발및운영',
    question: '다음 중 휴리스틱 평가(Heuristic Evaluation)에 대한 설명으로 옳지 않은 것은?',
    options: [
      '① 평가하는 대상의 전체적인 시스템 요소들을 완벽하게 검사한다.',
      '② 국제적이고 동기적인 평가 자료를 만들기 적합하다는 문제점이 있다.',
      '③ 소수의 전문가가 경기 대상이 휴리스틱을 얻만가 잘 준수하고 있는지 검사하는 방법이다.',
      '④ 사용자가 직접 시스템을 사용하지 않아도 평가 때문에 조기 개발 단계에서도 점찰을 진행할 수 있다.'
    ],
    correctAnswer: 0,
    explanation: '평가하는 특정 시스템의 모든 요소를 숨속들이 검사하보다는 소수의 중요한 휴리스틱에 따라 부분적으로만 검사한다.'
  },
  {
    id: 67,
    subject: '서비스경험디자인개발및운영',
    question: '다음 제이콥 닐슨(Jakob Nielsen)의 10가지 휴리스틱(Heuristics)에 해당하는 원칙은?',
    options: [
      '① 일관성과 표준성을 높인다. (Consistency and Standards)',
      '② 심미적이고 간결한 시스템 디자인을 제공한다. (Aesthetic and Minimalist Design)',
      '③ 현실 세계와 부합하도록 시스템을 설계한다. (Match Between System and the Real World)',
      '④ 사용자가 지은 인식의 느낌으로 시스템을 사용할 수 있게 한다. (Recognition Rather Than Recall)'
    ],
    correctAnswer: 0,
    explanation: '오독체, 행동, 휴먼 등을 명확하게 표시하여 사용자가 최소한의 인지적 노력으로 사용할 수 있게 해야 한다.'
  },
  {
    id: 68,
    subject: '서비스경험디자인개발및운영',
    question: '다음 중 <그림>의 빈칸에 들어갈 서비스 청사진(Service Blueprint)의 구성 요소를 쓰게 짝지은 것은?',
    options: [
      '① 상호작용선 - 가시선 - 내부 상호작용선 서명센 휴면',
      '② 시간의 흐름 - 상호작용선 - 내부 상호작용선 가시선',
      '③ 내부 상호작용선 가시선 - 시간의 흐름 - 상호작용선',
      '④ 시간의 흐름 - 상호작용선 가시선 - 내부 상호작용선'
    ],
    correctAnswer: 2,
    explanation: '서비스 청사진의 구성요소는 내부 상호작용선, 가시선, 상호작용선 순서입니다.',
    imageUrl: 'https://via.placeholder.com/700x400/7b1fa2/ffffff?text=Service+Blueprint+Diagram',
    explanationImageUrl: 'https://via.placeholder.com/600x350/FF9800/ffffff?text=Service+Blueprint+Solution'
  },
  {
    id: 69,
    subject: '서비스경험디자인개발및운영',
    question: '서비스 청사진(Service Blueprint)을 설계할 때 고려할 사항 중 옳은 것만을 <보기>에서 모두 고른 것은?',
    options: [
      '① ㄱ',
      '② ㄱ, ㄴ', 
      '③ ㄱ, ㄴ, ㄷ',
      '④ ㄱ, ㄴ, ㄷ, ㅁ'
    ],
    correctAnswer: 2,
    explanation: '사용자의 생활, 가치, 정서에 관한 데이터를 사용자가 직접 수집하도록 하는 것은 문화적 프로브에 대한 설명이다.'
  },
  {
    id: 70,
    subject: '서비스경험디자인개발및운영',
    question: '다음에서 설명하는 비즈니스 모델 캔버스(Business Model Canvas)의 요소에 해당하는 것은?',
    options: [
      '① 가치 제안(Value Proposition)',
      '② 고객 분제(Customer Relationship)',
      '③ 수익원(Revenue Streams)',
      '④ 채널(Channels)'
    ],
    correctAnswer: 0,
    explanation: '가치 제안은 고객에게 가치를 제공하기 위해서 의시소통하고 서비스를 전달하는 방법과, 목적에 따라 크게 커뮤니케이션 브로츄어 유통으로 구분된다.'
  },
  {
    id: 71,
    subject: '서비스경험디자인개발및운영',
    question: '다음 <그림>은 가전제품의 구매 과정에 대한 서비스 청사진(Service Blueprint)의 사례이다. ①~⑤에 들어갈 내용을 쓰게 연결한 것은?',
    options: [
      '① 온라인주시전원 배송센 고노동 휘커시석 액업자 설정',
      '② 배송센 고노동 온라인주시전원 휘커시석 설정',
      '③ 생활개선원 배송센 고노동 설계회 설정 고노동',
      '④ 생활개선원 배송시전원 휘커시석 생활주문입원'
    ],
    correctAnswer: 1,
    explanation: '서비스 청사진에서 각 단계별 구성요소들의 올바른 연결입니다.'
  },
  {
    id: 72,
    subject: '서비스경험디자인개발및운영',
    question: '다음 중 와이어프레임(Wireframe)에 대한 설명으로 옳지 않은 것은?',
    options: [
      '① 와이어프레임성의 모든 화 내용이나 기능에 대한 간단한 설명을 추가하라고 한다.',
      '② 낮은 충실도의 와이어프레임은 프로젝의 초기 단계, 높은 충실도의 와이어프레임은 설계가 정착하다.',
      '③ 와이어프레임의 주된 세 가지 요소는 페이지에 표시될 내용의 구분을(Contents), 컨트롤(Control), 내비게이션(Navigation)이다.',
      '④ 개별 와이어프레임은 해당 와이어프레임에 대한 버전 정보, 와이어프레임의 연동자간 브레시 내용 등의 정보를 기지고 작성된 이를 메타 데이터라고 한다.'
    ],
    correctAnswer: 0,
    explanation: '개별 와이어프레임에는 해당 와이어프레임에 대한 버전 정보, 와이어프레임의 연동자간 브레시나 내용 등의 정보를 기지고 표시하는 메타데이터라고 한다.'
  },
  {
    id: 73,
    subject: '서비스경험디자인개발및운영',
    question: '다음 중 인터넷에서 디자인에서 메타포에 대한 내용으로 옳은 것은?',
    options: [
      '① 메타포는 컨텐츠의 사용성을 높일 수 있는 도구이다.',
      '② 문화권이 다르도록 어떠한 상징에서도 메타포는 그 의미가 동일 플롯한다.',
      '③ 메타포는 학습을 통해서만 터득할 수 있고, 충분한 메타포는 단시에 익힐 수 있어야 한다.',
      '④ 메타포는 사용자로 활용할 수 있는 일부개 사용에서시 의시 생활에서의 익숙한 하디 여기자를 사용하기 때돕에 촛불내고 않아야 학습할 수 없다.'
    ],
    correctAnswer: 0,
    explanation: '인터럽에서 인터넷에서 디자인에서 메타포는 가능의 용도나 속성의 특정을 이미지로 표현한 것이다. 익숙한 이미지를 사용하기 때돕에 촛성에 촛불내고 헬아겠을 않해야 학습할 수 있다.'
  },
  {
    id: 74,
    subject: '서비스경험디자인개발및운영',
    question: '다음 등급 서비스 개선에 대한 프로젝트에서 실험된 프로토타입 방법으로 옳지 않은 것은?',
    options: [
      '① 데스크탑 워크스루(Desktop Walkthrough)',
      '② 서비스 시연(Service Staging)',
      '③ 시뮬레이션(Simulation)',
      '④ 역할 놀이(Role Playing)'
    ],
    correctAnswer: 0,
    explanation: '데스크탑 워크스루(Desktop Walkthrough)는 작은 모형을 활용해서 서비스 연구을 액상 위에 실제처럼 재현하고 서비스 상황을 원상과 원각 실라보는 방법이다.'
  },
  {
    id: 75,
    subject: '서비스경험디자인개발및운영',
    question: '다음 중 서비스경험디자인 결과물의 프레젠테이션(Presentation)에 대한 설명으로 옳지 않은 것은?',
    options: [
      '① 매출 증가시키거나 비용을 감소시키는 방향을 제안한다.',
      '② 사용자에게 전달할 핵심지식가 무엇인가를 명확히 제안한다.',
      '③ 자유료온 도출온 등에 가능한 해결책을 최대한 많이 제안한다.',
      '④ 다양한 이해관계자의 관점에서 서비스의 중계 이용의 목적을 설명한다.'
    ],
    correctAnswer: 2,
    explanation: `자유료온 도출온 등에 해결책 도출은 아이디어의심 워크숍(Facilitation Workshop)에 대한 설명이다. ①, ②, ④번은 서비스경험디자인 결과물의 프레젠테이션 내용 중 '서비스 제공 가치'에 해당한다.`
  },
  {
    id: 76,
    subject: '서비스경험디자인개발및운영',
    question: '다음은 100% 생분해 컵 서비스에 대한 비즈니스 모델 캔버스를 작성한 사례이다. ①~⑤에 들어갈 내용을 올바르게 짝지은 것은?',
    options: [
      '① 가치 제안 - 중네피 순위 사회적 가치 소비자',
      '② 가치 제안 - 편리성의 가능원 판매가 가치 소비자',
      '③ 가치 정응 - 환원 보 극욱 바이엘긴 여성 소비자',
      '④ 가치 정응 - 소비자의 가치 획실 요소 2015 가치 소비자'
    ],
    correctAnswer: 0,
    explanation: '100% 생분해 컵 서비스의 비즈니스 모델에서 가치 제안은 중네피 순위 사회적 가치로 표현됩니다.'
  },
  {
    id: 77,
    subject: '서비스경험디자인개발및운영',
    question: '다음 중 <보기>에서 데이터 시각화(Data Visualization)에 대한 내용으로 옳은 것을 모두 고른 것은?',
    options: [
      '① ㄱ, ㄴ, ㄷ',
      '② ㄴ, ㄷ, ㅁ',
      '③ ㄱ, ㄷ, ㅁ',
      '④ ㄱ, ㄷ, ㄹ, ㅁ'
    ],
    correctAnswer: 0,
    explanation: '다른 인포그래픽과 마찬가지로 점점 심사용된 시간들이 데이터를 이해하는 데 도움이 된다. 정의적이고 핵심적으로 데이터를 시각화하면 곧이어 작달라도 된 많은 데이터를 헤싱 중 수 있고 사람들에게 더 간혹 정철적 수 있다.'
  },
  {
    id: 78,
    subject: '서비스경험디자인개발및운영',
    question: '다음 중 <보기>의 ①에 해당하는 용어는?',
    options: [
      '① 감정 곡선(Emotional Curve)',
      '② 과업 분석(Task Analysis)',
      '③ 사용자 참여(User Participation)',
      '④ 진실의 순간(Moment of Truth)'
    ],
    correctAnswer: 3,
    explanation: '진실의 순간은 고객과 기업이 접촉하는 조건에서 조직의 서비스 품질에 관련된 것을 고객이 체험할 수 있다.'
  },
  {
    id: 79,
    subject: '서비스경험디자인개발및운영',
    question: '다음 중 A/B 테스트에 대한 설명으로 옳지 않은 것은?',
    options: [
      '① A/B 테스트는 둘 이상의 요소 간의 조합을 찾아 최상의 변인조츠 파악하기 위해 측정한다.',
      '② A/B 테스트를 진행하기 의해서는 먼저 정량적으로 축적 가능한 목표를 설정하는 것이 중요하다.',
      '③ A/B 테스트의 가장 큰 단점 중의 하나는 축정 결과의 명확한 원인을 파악하기 어렵다는 것이다.',
      '④ A/B 테스트의 결과에 대한 의향보고 그로부 테스트를 위해서는 1~2정도를 적용하여 유의성을 검증해야 한다.'
    ],
    correctAnswer: 0,
    explanation: 'A/B 테스트는 데이터을을 최적화하기 위한 목적으로 정된 단할 두 개의 페이지를 사용하여 테스트한다.'
  },
  {
    id: 80,
    subject: '서비스경험디자인개발및운영',
    question: '다음 중 <표>의 ①과 ②에 들어갈 용어를 쓰게 짝지은 것은?',
    options: [
      '① CSR - ESG',
      '② CSV - CSR',
      '③ ESG - CSR',
      '④ SDG - CSV'
    ],
    correctAnswer: 0,
    explanation: 'CSR은 기업의 사회적 책임을, ESG는 환경·사회·지배구조를 나타냅니다.'
  },
  {
    id: 81,
    subject: '서비스경험디자인개발및운영',
    question: '프로토타이핑에서 Low-fidelity 프로토타입의 주요 장점은?',
    options: [
      '실제 제품과 동일한 외관 제공',
      '빠른 아이디어 검증과 반복',
      '완벽한 기능 구현',
      '최종 결과물과 동일한 품질'
    ],
    correctAnswer: 1,
    explanation: 'Low-fidelity 프로토타입은 빠르고 저렴하게 만들 수 있어 초기 아이디어를 검증하고 빠른 반복을 통해 개선할 수 있는 것이 주요 장점입니다.'
  },
  {
    id: 82,
    subject: '서비스경험디자인개발및운영',
    question: '사용성 테스트에서 가장 중요한 원칙은?',
    options: [
      '많은 수의 참가자 확보',
      '실제 사용 환경과 유사한 조건 조성',
      '완벽한 프로토타입 준비',
      '개발팀 전원 참관'
    ],
    correctAnswer: 1,
    explanation: '사용성 테스트는 실제 사용자가 실제 환경에서 겪을 수 있는 상황과 최대한 유사한 조건에서 진행되어야 의미 있는 결과를 얻을 수 있습니다.'
  },
  {
    id: 61,
    subject: '서비스경험디자인개발및운영',
    question: '<그림>은 지식재산권의 종류를 나타낸 것이다. ①~⑤에 대응되는 내용이 알맞게 짝지어진 것은?',
    options: [
      '① 산업 재산권 - 실용신안권 - 디자인권',
      '② 산업 재산권 - 저작 재산권 - 디자인권', 
      '③ 저작권 - 실용신안권 - 디자인권',
      '④ 저작권 - 저작 재산권 - 영업 비밀 보호권'
    ],
    correctAnswer: 0,
    explanation: '지식재산권은 산업재산권(특허권, 실용신안권, 디자인권, 상표권)과 저작권으로 분류됩니다.'
  },
  {
    id: 62,
    subject: '서비스경험디자인개발및운영',
    question: '다음 설명에 해당하는 관리 보호 제도로 옳은 것은?',
    options: [
      '① 공지종료제도',
      '② 디자인권',
      '③ 저작 재산권', 
      '④ 창작권리보호제도'
    ],
    correctAnswer: 0,
    explanation: '타인이 창작을 모방하거나 모시모로 창작을 사조용을 극도 하는 과정을 조사하는 것으로 디자인산업 정체성 내용을 조사하고 디자인산업 정체성을 위한 제도입니다.'
  },
  {
    id: 63,
    subject: '서비스경험디자인개발및운영',
    question: '다음 업무 방법(Business Method) 특허에 대한 설명 중 옳은 것만을 <보기>에서 고른 것은?',
    options: [
      '① ㄱ, ㄴ, ㅁ',
      '② ㄴ, ㄷ, ㅂ',
      '③ ㄱ, ㄷ, ㅁ, ㅂ',
      '④ ㄱ, ㄴ, ㄷ, ㅂ'
    ],
    correctAnswer: 1,
    explanation: 'BM특허는 특허의 한 분야로 영업 방법을 특허 대상으로 한다는 점을 제외하고는 일반 특허와 차이가 없기 때문에 메타놀의 등정권이 인정된다. 순수 영업 방법 자체만으로는 BM특허의 대상이 되지 않으며, 우선 대상 요소를 구체하는 장치는 우선 설치를 요정할 수 있다.'
  }
];

// 과목별로 문제를 추출하는 함수
export const getQuestionsBySubject = (subject: Subject, count: number = 20): Question[] => {
  const subjectQuestions = sampleQuestions.filter(q => q.subject === subject);
  
  // 실제로는 더 많은 문제가 있을 것이므로, 랜덤하게 선택
  const shuffled = [...subjectQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// 모든 문제를 반환하는 함수
export const getAllQuestions = (): Question[] => {
  return [...sampleQuestions];
};

// 전체 시험 문제를 생성하는 함수 (각 과목당 20문제씩, 과목별 순서 유지)
export const generateExamQuestions = (): Question[] => {
  const subjects: Subject[] = [
    '서비스경험디자인기획설계',
    '사용자조사분석', 
    '사용자중심전략수립',
    '서비스경험디자인개발및운영'
  ];

  const examQuestions: Question[] = [];
  
  // 과목별로 순서대로 문제 추가, 각 과목 내에서만 랜덤화
  subjects.forEach(subject => {
    const subjectQuestions = getQuestionsBySubject(subject, 20);
    // 각 과목 내에서만 문제 순서 랜덤화
    const shuffledSubjectQuestions = subjectQuestions.sort(() => Math.random() - 0.5);
    examQuestions.push(...shuffledSubjectQuestions);
  });

  // 전체 문제 순서는 과목별 순서 유지 (랜덤화 하지 않음)
  return examQuestions;
}; 