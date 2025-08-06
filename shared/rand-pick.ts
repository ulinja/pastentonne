import randInt from "./rand-int";

/**
 * Picks and returns a random element from an Array.
 */
export default function <T>(array: T[]): T {
  if (array.length === 0) {
    throw new Error("Cannot pick from empty array");
  }
  return array[randInt(0, array.length - 1)]!;
}
