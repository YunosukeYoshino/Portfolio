module.exports = {
  ci: {
    collect: {
      numberOfRuns: 1,
      staticDistDir: "./vercel",
      url: ["/"],
    },
    assert: {
      preset: "lighthouse:no-pwa",
      assertions: {
        "offscreen-images": "off",
        "uses-webp-images": "off",
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
