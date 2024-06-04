export function wrapInCssVar(cssVariable: `--${string}`) {
  return `var(${cssVariable})`
}
