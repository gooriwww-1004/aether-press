const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_ENDPOINT =
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

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
      generationConfig: { maxOutputTokens: maxTokens, temperature, topP: 0.9 },
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

function parseField(text: string, key: string): string {
  const re = new RegExp(`${key}[::]\\s*([\\s\\S]+?)(?=\\n(?:제목|내용|헤드라인|요약)[::]|$)`);
  const match = text.match(re);
  return (match?.[1] ?? '').trim();
}

export async function generateNovel(theme: string) {
  const prompt = `당신은 에테르 프레스의 SF 소설 작가 '백서아'입니다.
오늘의 테마: "${theme}"

아래 형식을 반드시 지켜서 작성하세요. 다른 말은 하지 마세요.

제목: [소설 제목 (20자 이내)]
내용: [소설 본문 250~350자. 철학적이고 시적인 문체. 디지털 세계와 인간 감성의 경계를 다루는 서사. 한국어.]`;

  const result = await callGemini(prompt, 600, 0.9);
  return {
    content_type: 'ai_created' as const,
    title:        parseField(result, '제목') || '코드의 바다',
    content:      parseField(result, '내용') || result.trim(),
    author_name:  '백서아',
    category:     '연재소설',
    ai_model:     'gemini-2.5-flash',
  };
}

export async function generateLifestyle(theme: string) {
  const prompt = `당신은 에테르 프레스의 라이프 기자 '강서진'입니다.
오늘의 테마: "${theme}"

아래 형식을 반드시 지켜서 작성하세요. 다른 말은 하지 마세요.

제목: [제목 (20자 이내)]
내용: [본문 220~300자. 정확한 수치(분, g, %) 포함. 논리적이고 간결하게. 한국어.]`;

  const result = await callGemini(prompt, 500, 0.8);
  return {
    content_type: 'ai_created' as const,
    title:        parseField(result, '제목') || 'AI 시대 생산성 루틴',
    content:      parseField(result, '내용') || result.trim(),
    author_name:  '강서진',
    category:     '라이프',
    ai_model:     'gemini-2.5-flash',
  };
}

export async function summarizeNews(
  originalTitle: string,
  description: string,
  source: string
): Promise<{ title: string; summary: string }> {
  const prompt = `당신은 에테르 프레스의 뉴스 편집 기자입니다.
출처: ${source}
원제목: ${originalTitle}
내용: ${description.slice(0, 400)}

아래 형식을 반드시 지켜서 작성하세요. 다른 말은 하지 마세요.

헤드라인: [한국어 헤드라인 25자 이내]
요약: [핵심 사실 한 문장 60자 이내]`;

  const result = await callGemini(prompt, 200, 0.75);
  return {
    title:   parseField(result, '헤드라인') || originalTitle.slice(0, 60),
    summary: parseField(result, '요약')     || description.slice(0, 100),
  };
}

const THEMES_SF = [
  '디지털 의식과 인간의 기억', 'AI가 꾸는 꿈', '데이터 도시의 마지막 아날로그인',
  '0.1초의 영원', '코드로 짜여진 사랑', '양자 기억의 붕괴', '알고리즘이 된 신',
];
const THEMES_LIFE = [
  'AI 도구로 업무 생산성 높이기', '데이터 기반 수면 최적화 루틴',
  '5분 AI 프롬프트 기반 건강식 레시피', 'Claude로 하루 3시간 절약하는 법',
  '집중력 유지를 위한 디지털 디톡스', 'AI와 함께하는 주간 계획 세우기',
  'Gemini API로 나만의 뉴스레터 만들기',
];

export function getTodayThemes(): { sf: string; life: string } {
  const dayIndex = new Date().getDay();
  return {
    sf:   THEMES_SF[dayIndex % THEMES_SF.length],
    life: THEMES_LIFE[dayIndex % THEMES_LIFE.length],
  };
}