// app.config.ts
import { defineConfig } from "@tanstack/start/config";
import viteTsConfigPaths from "vite-tsconfig-paths";
var app_config_default = defineConfig({
  vite: {
    plugins: () => [
      viteTsConfigPaths({
        projects: ["./tsconfig.json"]
      })
    ]
  },
  server: {
    preset: "cloudflare-pages"
  },
  routers: {
    client: {
      entry: "./app/client.tsx"
    },
    ssr: {
      entry: "./app/ssr.tsx"
    }
  }
});
export {
  app_config_default as default
};
