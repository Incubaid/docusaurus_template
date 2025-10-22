import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import navbar from './cfg/navbar.json';
import footer from './cfg/footer.json';
import main from './cfg/main.json';
import { remarkKroki } from 'remark-kroki';
import { readFileSync, existsSync } from 'fs';

// Try to load announcement.json if it exists
let announcement: any = { content: '' };
try {
  if (existsSync('./cfg/announcement.json')) {
    const announcementData = readFileSync('./cfg/announcement.json', 'utf-8');
    announcement = JSON.parse(announcementData);
  }
} catch (e) {
  // Announcement file doesn't exist, use default empty content
}

// Mermaid theme support
const mermaidTheme = {
  theme: {
    light: 'default',
    dark: 'dark',
  },
};

const config: Config = {
  title: main.title,
  tagline: main.tagline,
  favicon: main.favicon,

  url: main.url,
  baseUrl: main.baseUrl,
  trailingSlash: true,

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          remarkPlugins: [
            [
              remarkKroki,
              {
                alias: ['plantuml'],
                target: 'mdx3',
                server: 'https://kroki.io'
              }
            ]
          ],
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  themes: ['@docusaurus/theme-mermaid'],

  scripts: [
    {
      src:
        'https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js',
      async: false,
    },
  ],

  themeConfig: {
    colorMode:
    {
      "defaultMode": "dark",
      "disableSwitch": false,
      "respectPrefersColorScheme": false
    },
    image: main.image,
    metadata: [
      { name: 'description', content: main.metadata.description },
      { property: 'og:image', content: main.metadata.image },
      { property: 'og:description', content: main.metadata.description },
      { property: 'og:title', content: main.metadata.title },
    ],
    navbar: navbar,
    footer: {
      ...footer,
      copyright: `Copyright © ${new Date().getFullYear()} ${main.copyright}`,
    },
    // Only include announcementBar if content is not empty
    ...(announcement.content && {
      announcementBar: {
        id: announcement.id,
        content: announcement.content,
        backgroundColor: announcement.backgroundColor,
        textColor: announcement.textColor,
        isCloseable: announcement.isCloseable,
      },
    }),
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    mermaid: mermaidTheme,
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 3,
    },
  },
};

export default config;
