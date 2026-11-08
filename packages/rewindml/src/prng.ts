/**
 * Seeded 32-bit PRNG (Mulberry32).
 * Yields uniform pseudo-random floats in [0, 1) deterministically across all environments.
 */
export function createPrng(seed: number = 42): () => number {
  let s = Math.floor(seed) >>> 0;
  return function next(): number {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Standard normal distribution generator using Box-Muller transform.
 */
export function createGaussianGenerator(seed: number = 42): () => number {
  const prng = createPrng(seed);
  let useLast = false;
  let y2 = 0;

  return function nextGaussian(): number {
    if (useLast) {
      useLast = false;
      return y2;
    }
    let x1 = 0;
    let x2 = 0;
    let w = 0;
    do {
      x1 = 2.0 * prng() - 1.0;
      x2 = 2.0 * prng() - 1.0;
      w = x1 * x1 + x2 * x2;
    } while (w >= 1.0 || w === 0);

    const mult = Math.sqrt((-2.0 * Math.log(w)) / w);
    y2 = x2 * mult;
    useLast = true;
    return x1 * mult;
  };
}

