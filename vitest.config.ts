import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
  },
  resolve: {
    alias: {
      "@rewindverse/rvts": path.resolve(__dirname, "./packages/rvts/src/index.ts"),
      "@rewindverse/rewindml": path.resolve(__dirname, "./packages/rewindml/src/index.ts"),
      "@rewindverse/replay-engine": path.resolve(__dirname, "./packages/replay-engine/src/index.ts"),
      "@rewindverse/diagnostics": path.resolve(__dirname, "./packages/diagnostics/src/index.ts"),
    },
  },
});

