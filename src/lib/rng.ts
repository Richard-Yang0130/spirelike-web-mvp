export function normalizeSeed(seed: number): number {
  return seed >>> 0 || 1;
}

export function nextRandom(state: number): [number, number] {
  const next = (1664525 * normalizeSeed(state) + 1013904223) >>> 0;
  return [next / 0x100000000, next];
}

export function randomInt(state: number, min: number, max: number): [number, number] {
  const [value, next] = nextRandom(state);
  return [Math.floor(value * (max - min + 1)) + min, next];
}

export function pickWeighted<T extends { weight: number }>(items: T[], state: number): [T, number] {
  const total = items.reduce((sum, item) => sum + Math.max(0, item.weight), 0);
  const [roll, next] = nextRandom(state);
  let cursor = roll * total;
  for (const item of items) {
    cursor -= Math.max(0, item.weight);
    if (cursor <= 0) return [item, next];
  }
  return [items[items.length - 1], next];
}

export function shuffle<T>(items: T[], seed: number): [T[], number] {
  const result = [...items];
  let state = normalizeSeed(seed);
  for (let index = result.length - 1; index > 0; index -= 1) {
    const [swapIndex, next] = randomInt(state, 0, index);
    state = next;
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return [result, state];
}
