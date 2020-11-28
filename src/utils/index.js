export const reduceMeta = (...keys) =>
  keys.reduce((acc, key) => acc + (key ? key + ` | ` : ``), ``).slice(0, -3)
