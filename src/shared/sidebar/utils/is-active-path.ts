function trimTrailingSlash(path: string) {
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

/**
 * Whether a nav item's `href` is the current page. Nested pages keep their section active
 * (`/admin/users/1` -> `/admin/users`), unless the item is `exact` (landing pages such as `/admin`).
 * `/` is always exact, since every path starts with it.
 */
export function isActivePath(pathname: string, href: string, { exact = false } = {}) {
  const path = trimTrailingSlash(pathname);
  const target = trimTrailingSlash(href);

  if (exact || target === "/") {
    return path === target;
  }
  return path === target || path.startsWith(`${target}/`);
}
