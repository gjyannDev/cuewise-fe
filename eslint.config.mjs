import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // The media kit (devices, recording, playback) is feature-agnostic: it may never depend on a feature module, so any
  // feature can reuse it and features stay the only place that knows about interviews (interview-room spec, AC17).
  {
    files: ["src/hooks/media/**/*.{ts,tsx}", "src/lib/media.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/modules/*", "@/modules/**"],
              message: "The media kit is feature-agnostic: it must not import from a feature module.",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
