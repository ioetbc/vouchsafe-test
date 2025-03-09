export function clamp(
  value: number,
  min: number = 0,
  max: number = 100
): number {
  return Math.max(min, Math.min(max, value));
}
