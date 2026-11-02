import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { errorBody } from "@tests/helpers/axios";

const clear = vi.fn();
const bypass = vi.fn();
vi.mock("@/lib/config/query-client", () => ({ getQueryClient: () => ({ clear }) }));
vi.mock("@/lib/unload-guard", () => ({ bypassUnloadWarning: () => bypass() }));

const { redirectIfSessionEnded } = await import("@/lib/config/session-redirect");

const assign = vi.fn();
const at = (pathname: string, search = "") => vi.stubGlobal("window", { location: { pathname, search, assign } });

describe("redirectIfSessionEnded", () => {
  beforeEach(() => at("/interviews", "?session=x"));
  afterEach(() => vi.unstubAllGlobals());

  it("clears the cache, skips the unload warning and goes to sign-in on a session-ending 401 (EC1, AC9)", () => {
    redirectIfSessionEnded(401, errorBody("TOKEN_EXPIRED", "Expired"));

    expect(clear).toHaveBeenCalledOnce();
    expect(bypass).toHaveBeenCalledOnce();
    expect(assign).toHaveBeenCalledWith("/signin?next=%2Finterviews%3Fsession%3Dx&expired=1");
  });

  it.each([
    [401, errorBody("INVALID_CREDENTIALS", "Wrong password")],
    [401, "not json"],
    [409, errorBody("TOKEN_EXPIRED", "Expired")],
  ])("does nothing for %s %j", (status, body) => {
    redirectIfSessionEnded(status, body);

    expect(assign).not.toHaveBeenCalled();
    expect(clear).not.toHaveBeenCalled();
  });

  it("does nothing on a public auth route", () => {
    at("/signin");

    redirectIfSessionEnded(401, errorBody("TOKEN_EXPIRED", "Expired"));

    expect(assign).not.toHaveBeenCalled();
  });

  it("does nothing on the server", () => {
    vi.unstubAllGlobals();

    expect(() => redirectIfSessionEnded(401, errorBody("TOKEN_EXPIRED", "Expired"))).not.toThrow();
  });
});
