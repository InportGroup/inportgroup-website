// Interpolación y curvas para animar las escenas.

export const lerp = (a, b, t) => a + (b - a) * t
export const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v))
export const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
