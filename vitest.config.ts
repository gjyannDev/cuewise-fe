import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@tests": fileURLToPath(new URL("./tests", import.meta.url)),
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // Next resolves `server-only` internally; tests run outside Next, so point it at Next's no-op module.
      "server-only": "next/dist/compiled/server-only/empty.js",
    },
  },
  test: {
    environment: "node",
    // Tests live in tests/, mirroring src/ (see CLAUDE.md > Testing).
    include: ["tests/**/*.test.ts"],
    clearMocks: true,
  },
});
