// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { existsSync, readdirSync } from 'node:fs';
import remarkGfm from 'remark-gfm';

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
  return existsSync(p) && readdirSync(p).some((f) => /\.mdx?$/.test(f));
};

export default defineConfig({
  site: 'https://rocher71.github.io',
  base: '/cs-wiki',
  // ponytail: 내장 gfm 대신 remark-gfm을 직접 넣는다. 이유 두 가지:
  // 1) Astro 6.4 + @astrojs/mdx 5 조합은 gfm을 명시 안 하면 .mdx 표가 깨짐(mdx가 이 플러그인 목록을 물려받음).
  // 2) 기본 singleTilde가 "3~5개 … 2~4" 같은 범위 표기를 취소선으로 만든다 → 끈다(~~취소선~~은 그대로 동작).
  markdown: { gfm: false, remarkPlugins: [[remarkGfm, { singleTilde: false }]] },
  integrations: [
    starlight({
      title: '백엔드 CS 위키',
      defaultLocale: 'root',
      locales: { root: { label: '한국어', lang: 'ko' } },
      customCss: ['./src/styles/custom.css'],
      sidebar: SECTIONS.filter(([d]) => has(d)).map(([d, label]) => ({
        label,
        collapsed: true,
        items: [{ autogenerate: { directory: d } }],
      })),
    }),
  ],
});
