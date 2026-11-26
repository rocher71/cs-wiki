import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    // tags: 면접빈출 | 서술형 | 필기
    schema: docsSchema({ extend: z.object({ tags: z.array(z.string()).optional() }) }),
  }),
};
