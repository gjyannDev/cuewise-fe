import { sessionParamSchema } from "../schemas/interviews.schema";
import type { SessionParam } from "../types/interviews.types";

/** Classifies `?session=`: absent or empty means the setup form; anything but a single UUID is invalid. */
export function parseSessionParam(raw: string | string[] | undefined): SessionParam {
  if (raw === undefined || raw === "") {
    return { kind: "none" };
  }
  const parsed = sessionParamSchema.safeParse(raw);
  return parsed.success ? { kind: "valid", id: parsed.data } : { kind: "invalid" };
}
