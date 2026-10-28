/** In-memory stand-in for `cookies()` from next/headers. Use with:
 *  vi.mock("next/headers", async () => (await import("@tests/helpers/cookie-jar")).nextHeadersMock)
 */

type StoredCookie = { value: string; options?: Record<string, unknown> };

export const cookieJar = {
  store: new Map<string, StoredCookie>(),
  deleted: [] as string[],
  reset() {
    this.store.clear();
    this.deleted = [];
  },
};

export const nextHeadersMock = {
  cookies: async () => ({
    get: (name: string) => {
      const cookie = cookieJar.store.get(name);
      return cookie ? { name, value: cookie.value } : undefined;
    },
    set: (name: string, value: string, options?: Record<string, unknown>) => {
      cookieJar.store.set(name, { value, options });
    },
    delete: (name: string) => {
      cookieJar.store.delete(name);
      cookieJar.deleted.push(name);
    },
  }),
};
