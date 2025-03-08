import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./setupTests.js"],
    globals: true,
  },
  resolve: {
    extensions: [".js", ".jsx"], // ✅ Ensures `.js` files are treated like `.jsx`
  },
  esbuild: {
    loader: "tsx", // ✅ Forces JSX parsing for .js files
    jsxInject: `import React from 'react'`, // ✅ Ensures React is available
  },
});
