/**
 * Lets a deliberate hard navigation (the session-expired redirect to sign-in) skip the "leave site?" warning that
 * pages raise for unsent input. Module state on purpose: the page is unloading right after it is set.
 */
let bypassed = false;

export function bypassUnloadWarning() {
  bypassed = true;
}

export function isUnloadWarningBypassed() {
  return bypassed;
}
