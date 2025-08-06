/**
 * Returns a random integer between min and max (inclusive).
 *
 * @param min - Minimum value (inclusive), defaults to 0
 * @param max - Maximum value (inclusive), defaults to 1
 * @returns Random integer in the range [min, max]
 */
export default function(min: number = 0, max: number = 1): number {
  if (!Number.isInteger(min) || !Number.isInteger(max)) {
    throw new Error('Both min and max must be integers')
  }

  if (min > max) {
    [min, max] = [max, min]
  }

  return Math.floor(Math.random() * (max - min + 1)) + min
}
