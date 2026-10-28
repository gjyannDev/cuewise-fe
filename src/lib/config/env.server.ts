import "server-only";

import { z } from "zod";

const apiUrlSchema = z.url({
  protocol: /^https?$/,
  error: "API_URL must be an absolute http(s) URL including the version prefix, e.g. http://localhost:8000/api/v1",
});

/**
 * Base URL of cuewise-be, validated on use so a misconfigured env fails loudly instead of turning
 * every backend call into a generic 503. Read lazily: builds and tests don't need it set.
 */
export function getApiUrl() {
  return apiUrlSchema.parse(process.env.API_URL).replace(/\/+$/, "");
}
