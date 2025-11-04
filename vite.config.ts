import { telefunc } from "telefunc/vite";
import react from "@vitejs/plugin-react";
import devServer from "@hono/vite-dev-server";
import { defineConfig } from "vite";
import vike from "vike/plugin";
import { fileURLToPath } from "node:url";

export default defineConfig({
  build: {
    rollupOptions: {
      external: ["@ai-sdk/react"],
    }
  },
  plugins: [
    vike({}),
    devServer({
      entry: "hono-entry.ts",

      exclude: [
        /^\/@.+$/,
        /.*\.(ts|tsx|vue)($|\?)/,
        /.*\.(s?css|less)($|\?)/,
        /^\/favicon\.ico$/,
        /.*\.(svg|png)($|\?)/,
        /^\/(public|assets|static)\/.+/,
        /^\/node_modules\/.*/,
      ],

      injectClientScript: false,
    }),
    react({}),
    telefunc(),
  ],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./", import.meta.url)),
      },
    ],
  },
});
