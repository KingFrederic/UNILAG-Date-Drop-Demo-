import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/** Percentage of `current` against `goal`, clamped to 0–100 and safe at goal = 0. */
export function progressOf(current: number, goal: number) {
  if (goal <= 0) return 0;
  return clamp((current / goal) * 100, 0, 100);
}

export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}
