import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import navbar from './cfg/navbar.json';
import footer from './cfg/footer.json';
import main from './cfg/main.json';

const config: Config = {
  title: main.title,
  tagline: main.tagline,
  favicon: main.favicon,

  url: main.url,
  baseUrl: main.baseUrl,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

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
  },
  themes: ['@docusaurus/theme-mermaid'],

  scripts: [
    
    {
      src:
        '/js/crisp.js',
      async: false,
    },
  ],

  themeConfig: {
    colorMode: 
      {
        "defaultMode": "dark",
        "disableSwitch": true,
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
      copyright: `Copyright © ${new Date().getFullYear()} Kristof OurWorld.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },
};

export default config;
