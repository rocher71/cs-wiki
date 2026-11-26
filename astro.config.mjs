// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { existsSync, readdirSync } from 'node:fs';
import remarkGfm from 'remark-gfm';
import remarkCjkFriendly from 'remark-cjk-friendly';

// 폴더 = 사이드바 섹션. 글이 있는 폴더만 보여준다.
const SECTIONS = [
  ['java', 'Java'], ['oop', 'OOP·디자인 패턴'], ['spring', 'Spring·JPA'],
  ['db', 'DB 심화'], ['distributed', '분산·데이터'], ['redis', 'Redis'],
  ['web', '웹·네트워크'], ['infra', 'Docker·쿠버네티스'],
  ['architecture', '아키텍처·배포'], ['system-design', '대규모 시스템 설계'], ['practice', '실무 서술형'],
  ['exam', '전공 필기'], ['security', '보안·테스트'],
];
const has = (d) => {
  const p = `./src/content/docs/${d}`;
  return existsSync(p) && readdirSync(p, { recursive: true }).some((f) => /\.mdx?$/.test(f));
};
// 필기는 과목 폴더(exam/os 등)를 한글 이름 그룹으로 묶는다. 글이 있는 과목만.
const EXAM_SUBJECTS = [
  ['os', '운영체제'], ['ds', '자료구조'], ['db', '데이터베이스'],
  ['network', '네트워크·데이터통신'], ['se', '소프트웨어공학'], ['arch', '컴퓨터구조'],
];
const items = (d) => {
  if (d !== 'exam') return [{ autogenerate: { directory: d } }];
  const top = existsSync('./src/content/docs/exam/guide.mdx') ? ['exam/guide'] : [];
  return [
    ...top,
    ...EXAM_SUBJECTS.filter(([s]) => has(`exam/${s}`)).map(([s, label]) => ({
      label, collapsed: true, items: [{ autogenerate: { directory: `exam/${s}` } }],
    })),
  ];
};

export default defineConfig({
  site: 'https://rocher71.github.io',
  base: '/cs-wiki',
  // ponytail: 내장 gfm 대신 remark-gfm을 직접 넣는다. 이유 두 가지:
  // 1) Astro 6.4 + @astrojs/mdx 5 조합은 gfm을 명시 안 하면 .mdx 표가 깨짐(mdx가 이 플러그인 목록을 물려받음).
  // 2) 기본 singleTilde가 "3~5개 … 2~4" 같은 범위 표기를 취소선으로 만든다 → 끈다(~~취소선~~은 그대로 동작).
  // 3) 한국어는 `**용어(영문)**를`처럼 굵게 뒤에 조사가 붙으면 CommonMark 규칙상 굵게가 안 먹고 **가 그대로 보인다 → cjk-friendly.
  markdown: { gfm: false, remarkPlugins: [[remarkGfm, { singleTilde: false }], remarkCjkFriendly] },
  integrations: [
    starlight({
      title: '백엔드 CS 위키',
      defaultLocale: 'root',
      locales: { root: { label: '한국어', lang: 'ko' } },
      customCss: ['./src/styles/custom.css'],
      sidebar: SECTIONS.filter(([d]) => has(d)).map(([d, label]) => ({
        label,
        collapsed: true,
        items: items(d),
      })),
    }),
  ],
});
