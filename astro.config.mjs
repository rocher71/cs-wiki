// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { existsSync, readdirSync } from 'node:fs';

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
  // ponytail: Astro 6.4는 gfm을 비워 두는데 @astrojs/mdx 5는 그 값을 보고 표 문법을 켠다 → 명시 안 하면 .mdx 표가 깨짐.
  // mdx가 새 processor 방식을 따라오면 지워도 됨.
  markdown: { gfm: true },
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
