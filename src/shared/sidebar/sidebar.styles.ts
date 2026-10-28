/** Clears every background shadcn gives a menu button (hover, pressed, open, active). */
const NO_BG_CLASS =
  "hover:bg-transparent active:bg-transparent data-open:hover:bg-transparent data-active:bg-transparent";

/**
 * Only hover gets the accent background. Text is base black (sidebar foreground) and turns primary
 * on hover; the current page is primary too. The active color is picked in code from `isActive`,
 * not via the data-active variant, so a row can never look active by accident.
 */
export const SIDEBAR_NAV_ITEM_CLASS = `h-9 ${NO_BG_CLASS} hover:bg-sidebar-accent data-active:hover:bg-sidebar-accent hover:text-sidebar-primary active:text-sidebar-primary`;
export const SIDEBAR_NAV_ITEM_IDLE_CLASS = "text-sidebar-foreground data-active:text-sidebar-foreground";
export const SIDEBAR_NAV_ITEM_ACTIVE_CLASS = "text-sidebar-primary data-active:text-sidebar-primary";

/** Sign out: red text, never a background. */
export const SIDEBAR_DANGER_ITEM_CLASS = `h-9 ${NO_BG_CLASS} text-destructive hover:text-destructive/80 active:text-destructive`;

/** Brand row: never a background. */
export const SIDEBAR_BRAND_CLASS = NO_BG_CLASS;
