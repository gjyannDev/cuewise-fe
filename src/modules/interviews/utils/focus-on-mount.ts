/**
 * Ref callback that focuses an element once, when it mounts. Module-level so its identity is stable: an inline
 * arrow would be called again on every render and keep stealing focus.
 */
export function focusOnMount(node: HTMLElement | null) {
  node?.focus();
}
