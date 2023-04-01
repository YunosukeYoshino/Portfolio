// https://astro.build/config
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import compress from "astro-compress";
import purgecss from "astro-purgecss";

export default defineConfig({
  // Your final, deployed URL
  site: "https://www.my-site.dev",
  // The base path to deploy to
  base: "/",
  server: {
    host: true,
  },
  integrations: [
    sitemap(),
    purgecss({
      safelist: [/is-active/, /p-safari/],
    }),
    compress(),
    tailwind({ config: { applyBaseStyles: false } }),
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
