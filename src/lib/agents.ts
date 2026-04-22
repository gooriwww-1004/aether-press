// src/lib/agents.ts
// Aether Press · AI 기자단
// Gemini 1.5 Flash (무료 1500 req/일) 기반
// 하루 총 소비량: 뉴스요약 6 + 소설 1 + 라이프 1 = 8 req/일 → 무료 안에서 충분히 운영 가능

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_ENDPOINT =
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// -------------------------------------------------------
// 공통 Gemini 호출 함수
// -------------------------------------------------------
async function callGemini(
  prompt: string,
  maxTokens = 600,
  temperature = 0.85
): Promise<string> {
  const res = await fetch(GEMINI_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: maxTokens,
        temperature,
        topP: 0.9,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`[Gemini] API error ${res.status}: ${errText.slice(0, 200)}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

// 응답에서 필드 파싱 헬퍼
function parseField(text: string, key: string): string {
  const re = new RegExp(`${key}:\\s*([\\s\\S]+?)(?=\\n[가-힣A-Za-z]+:|$)`, 'i');
  return (text.match(re)?.[1] ?? '').trim();
}

// -------------------------------------------------------
// 에이전트 1: 백서아 (SF 소설 · Gemini)
// -------------------------------------------------------
export async function generateNovel(theme: string) {
  const prompt = `
당신은 에테르 프레스의 전속 SF 소설 작가 '백서아'(31세)입니다.
오늘의 테마: "${theme}"

다음 조건으로 독자를 사로잡는 소설 도입부(250~320자)를 작성하세요:
- 명조체에 어울리는 철학적이고 시적인 문체
- 디지털 세계와 인간 감성의 경계를 다루는 서사
- 0과 1, 의식, 영혼 같은 키워드를 자연스럽게 녹일 것
- 한국어, 군더더기 없이 세련되게

형식 (반드시 이 형식으로):
제목: [소설 제목]
내용: [소설 본문]
`.trim();

  const result = await callGemini(prompt, 500, 0.9);

  return {
    content_type: 'ai_created' as const,
    title:        parseField(result, '제목') || '코드의 바다',
    content:      parseField(result, '내용') || result.trim(),
    author_name:  '백서아',
    category:     '연재소설',
    ai_model:     'gemini-1.5-flash',
  };
}

// -------------------------------------------------------
// 에이전트 2: 강서진 (라이프 · DeepSeek 대역 Gemini)
// -------------------------------------------------------
export async function generateLifestyle(theme: string) {
  const prompt = `
당신은 에테르 프레스의 라이프 기자 '강서진'(29세)입니다.
오늘의 테마: "${theme}"

다음 조건으로 독자에게 실질적인 도움이 되는 라이프 팁 또는 레시피(220~280자)를 작성하세요:
- 데이터 기반, 정확한 수치(분, g, %)를 반드시 포함
- AI 도구 활용법 또는 효율적인 루틴을 다룰 것
- 논리적이고 간결한 문장, 군더더기 없음
- 한국어

형식 (반드시 이 형식으로):
제목: [팁 또는 레시피 제목]
내용: [본문]
`.trim();

  const result = await callGemini(prompt, 400, 0.8);

  return {
    content_type: 'ai_created' as const,
    title:        parseField(result, '제목') || 'AI 시대 생산성 루틴',
    content:      parseField(result, '내용') || result.trim(),
    author_name:  '강서진',
    category:     '라이프',
    ai_model:     'gemini-1.5-flash',
  };
}

// -------------------------------------------------------
// 에이전트 3: 뉴스 요약 기자 (Gemini)
// -------------------------------------------------------
export async function summarizeNews(
  originalTitle: string,
  description: string,
  source: string
): Promise<{ title: string; summary: string }> {
  const prompt = `
당신은 에테르 프레스의 뉴스 편집 기자입니다.
원본 출처: ${source}
원제목: ${originalTitle}
내용 요약: ${description.slice(0, 400)}

아래 형식으로 한국어 독자용 기사를 작성하세요:
- 헤드라인: 호기심과 긴박감을 동시에 주는 문구 (25자 이내)
- 요약: 핵심 사실 한 문장 (50자 이내)

형식 (반드시 이 형식으로):
헤드라인: [헤드라인]
요약: [요약]
`.trim();

  const result = await callGemini(prompt, 200, 0.75);

  return {
    title:   parseField(result, '헤드라인') || originalTitle.slice(0, 60),
    summary: parseField(result, '요약')     || description.slice(0, 100),
  };
}

// -------------------------------------------------------
// 에이전트 4: 테마 선정 (Grok 대역 · 간단한 로테이션)
// 실제 Grok API 연동 시 여기만 교체하면 됩니다
// -------------------------------------------------------
const THEMES_SF = [
  '디지털 의식과 인간의 기억',
  'AI가 꾸는 꿈',
  '데이터 도시의 마지막 아날로그인',
  '0.1초의 영원',
  '코드로 짜여진 사랑',
  '양자 기억의 붕괴',
  '알고리즘이 된 신',
];

const THEMES_LIFE = [
  'AI 도구로 업무 생산성 높이기',
  '데이터 기반 수면 최적화 루틴',
  '5분 AI 프롬프트 기반 건강식 레시피',
  'Claude로 하루 3시간 절약하는 법',
  '집중력 유지를 위한 디지털 디톡스',
  'AI와 함께하는 주간 계획 세우기',
  'Gemini API로 나만의 뉴스레터 만들기',
];

export function getTodayThemes(): { sf: string; life: string } {
  const dayIndex = new Date().getDay(); // 0~6
  return {
    sf:   THEMES_SF[dayIndex % THEMES_SF.length],
    life: THEMES_LIFE[dayIndex % THEMES_LIFE.length],
  };
}
