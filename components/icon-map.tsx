import {
  Bot,
  Briefcase,
  Compass,
  ChartLine,
  Cloud,
  Cpu,
  GraduationCap,
  Landmark,
  Lightbulb,
  Link,
  House,
  Package,
  PenLine,
  Settings,
  Shield,
  Shirt,
  ShoppingBag,
  SquarePlay,
  Store,
  Target,
  TrendingUp,
  Wallet,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * String keys let seed data stay serialisable (it round-trips through
 * localStorage) while still resolving to real components at render time.
 * Note lucide v1 renamed `Home` to `House` and dropped brand marks such as
 * `Youtube`, hence `square-play` for the video stream.
 */
export const iconMap = {
  home: House,
  compass: Compass,
  target: Target,
  wallet: Wallet,
  lightbulb: Lightbulb,
  bot: Bot,
  "graduation-cap": GraduationCap,
  settings: Settings,
  package: Package,
  "shopping-bag": ShoppingBag,
  "square-play": SquarePlay,
  briefcase: Briefcase,
  store: Store,
  shirt: Shirt,
  zap: Zap,
  link: Link,
  cloud: Cloud,
  "chart-line": ChartLine,
  "trending-up": TrendingUp,
  shield: Shield,
  workflow: Workflow,
  "pen-line": PenLine,
  landmark: Landmark,
  cpu: Cpu,
} satisfies Record<string, LucideIcon>;

export type IconKey = keyof typeof iconMap;

export function resolveIcon(key: string): LucideIcon {
  return iconMap[key as IconKey] ?? Package;
}
