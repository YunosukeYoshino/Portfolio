module.exports = {
  ci: {
    collect: {
      startServerCommand: 'bun run preview',
      url: [
        'http://localhost:4321/',
        'http://localhost:4321/about',
        'http://localhost:4321/contact',
        'http://localhost:4321/article/page/1',
      ],
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --headless',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 1.0 }],
        'categories:best-practices': ['error', { minScore: 1.0 }],
        'categories:seo': ['error', { minScore: 1.0 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
