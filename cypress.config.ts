/* eslint-disable no-param-reassign */
import { defineConfig } from "cypress";
import vitePreprocessor from "cypress-vite";
import path from "node:path";

export default defineConfig({
  env: {
    server_url: "http://localhost:5178",
  },

  e2e: {
    setupNodeEvents(on, config) {
      on(
        "file:preprocessor",
        vitePreprocessor({
          configFile: path.resolve(__dirname, "./vite.config.ts"),
        }),
      );
      config.screenshotOnRunFailure = false;
      config.video = false;
      return config;
    },
  },
  component: {
    video: false,
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
