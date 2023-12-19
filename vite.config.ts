import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import pluginRewriteAll from "vite-plugin-rewrite-all";

// https://vitejs.dev/config/
export default defineConfig({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  plugins: [react(), pluginRewriteAll()],
  optimizeDeps: {
    exclude: ["@xmtp/user-preferences-bindings-wasm"],
  },
  // build: {
  //   target: "esnext",
  // },
});
