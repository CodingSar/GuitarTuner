import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        practice: fileURLToPath(new URL("./practice.html", import.meta.url)),
      },
    },
  },
});
