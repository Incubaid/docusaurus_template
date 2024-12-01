import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'ThreeFold Docs',
  tagline: 'Self-Healing Data & Cloud Network',
  favicon: 'img/favicon.png',

  // Set the production url of your site here
  url: 'https://docs.projectmycelium.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/testdocs/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'git.ourworld.tf/tfgrid', // Usually your GitHub org/user name.
  projectName: 'www_docs_threefold_io', // Usually your repo name.
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
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
          routeBasePath: '/',
        },
        blog: false,
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
      src: '/js/crisp.js',
      async: false,
    },
  ],

  // Add redirect from root to intro
  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {
            from: '/',
            to: '/intro',
          },
        ],
      },
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    image: 'img/favicon.png',
    navbar: {
      title: '',
      logo: {
        alt: 'ThreeFold Logo',
        src: 'img/logo.svg',
        srcDark: 'img/logo.svg', // Use same logo for dark mode
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/support',
          label: 'Support',
          position: 'left',
        },
        {
          href: 'https://threefold.io',
          label: 'ThreeFold.io',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Introduction',
              to: '/intro',
            },
            {
              label: 'Litepaper',
              to: '/litepaper',
            },
            {
              label: 'Roadmap',
              to: '/roadmap',
            },
            {
              label: 'Manual',
              to: 'https://manual.grid.tf/',
            },
          ],
        },
        {
          title: 'Features',
          items: [
            {
              label: 'Become a Farmer',
              to: '/category/become-a-farmer',
            },
            {
              label: 'Tech',
              to: '/tech',
            },
            {
              label: 'Tokenomics',
              to: '/tokenomics',
            },            
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Telegram',
              href: 'https://t.me/threefold',
            },
            {
              label: 'X',
              href: 'https://x.com/threefold_io',
            },
            {
              label: 'Forum',
              href: 'https://forum.threefold.io',
            },
            {
              label: 'Support',
              to: '/support',
            },
          ],
        },
        {
          title: 'Links',
          items: [
            {
              label: 'ThreeFold.io',
              href: 'https://threefold.io',
            },
            {
              label: 'Dashboard',
              href: 'https://dashboard.grid.tf',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/threefoldtech/home',
            },
            {
              label: 'Gitea',
              href: 'https://git.ourworld.tf',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} ThreeFold`,
    },
    prism: {
      theme: prismThemes.dracula,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
