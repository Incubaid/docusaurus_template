import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Docs',
  tagline: 'Lets build the future together.',
  favicon: 'img/favicon.png',

  // Set the production url of your site here
  url: 'https://www.ourworld.tf',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/testdocs/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'github.com/incubaid', // Usually your GitHub org/user name.
  projectName: 'www_testdocs', // Usually your repo name.
  trailingSlash: false,

  onBrokenLinks: 'warn',
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
            to: 'https://info.ourworld.tf/testdocs/intro',
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
        alt: 'Logo',
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
          href: 'https://www.mbweniruinsandgardens.com/',
          label: 'mbweniruinsandgardens',
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
          ],
        },
        {
          title: 'More Info',
          items: [
            {
              label: 'Budget',
              to: '/budget',
            },          
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Home',
              to: '/intro',
            },
            {
              label: 'Budget',
              to: '/budget',
            },            
          ],
        },
        {
          title: 'Links',
          items: [
            {
              label: 'mbweniruinsandgardens',
              href: 'https://www.mbweniruinsandgardens.com/',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/incubaid/',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Incubaid`,
    },
    prism: {
      theme: prismThemes.dracula,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
