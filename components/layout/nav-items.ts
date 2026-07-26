export interface NavItem {
  name: string;
  href: string;
  icon: string;
  /** Second key of the `g`-prefixed navigation shortcut, e.g. g then d. */
  shortcut: string;
}

export const navItems: NavItem[] = [
  { name: "Dashboard", href: "/", icon: "home", shortcut: "d" },
  { name: "Blueprint", href: "/blueprint", icon: "compass", shortcut: "b" },
  { name: "Goals", href: "/goals", icon: "target", shortcut: "g" },
  { name: "Income", href: "/income", icon: "wallet", shortcut: "i" },
  { name: "Ideas", href: "/ideas", icon: "lightbulb", shortcut: "n" },
  { name: "AI Agents", href: "/agents", icon: "bot", shortcut: "a" },
  { name: "Learning", href: "/learning", icon: "graduation-cap", shortcut: "l" },
  { name: "Settings", href: "/settings", icon: "settings", shortcut: "s" },
];
