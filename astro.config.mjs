// https://astro.build/config
import prefetch from "@astrojs/prefetch";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/static";
import { defineConfig } from "astro/config";
import compress from "astro-compress";
import purgecss from "astro-purgecss";

export default defineConfig({
  // Your final, deployed URL
  site: "https://www.yunosukeyoshino.com",
  // The base path to deploy to
  base: "/",
  server: {
    host: true,
  },
  experimental: {
    router: "spa",
  },
  adapter: vercel({
    analytics: true,
  }),
  integrations: [
    sitemap(),
    purgecss({
      safelist: [/is-active/, /p-safari/],
    }),
    compress(),
    tailwind({ config: { applyBaseStyles: false } }),
    prefetch({ selector: "a[href^='/article/']" }),
  ],
  vite: {
    build: {
      minify: false,
      assetsInlineLimit: 0,
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            let extType = assetInfo.name.split(".").at(1);
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              extType = "img";
            } else if (/woff|woff2/.test(extType)) {
              extType = "css";
            }
            return `assets/${extType}/[name]-[hash][extname]`;
          },
          entryFileNames: "assets/js/main.js",
        },
      },
    },
  },
});
