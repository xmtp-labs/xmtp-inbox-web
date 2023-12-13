import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import pluginRewriteAll from "vite-plugin-rewrite-all";
import wasm from "vite-plugin-wasm";

// https://vitejs.dev/config/
export default defineConfig({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  plugins: [react(), pluginRewriteAll(), wasm()],
  build: {
    target: "esnext",
  },
});
