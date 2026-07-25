import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names with Tailwind CSS conflict resolution.
 *
 * Combines `clsx` (conditional class joining) with `tailwind-merge`
 * (deduplicates conflicting Tailwind utilities). Use this for all
 * dynamic className composition.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
