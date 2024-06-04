export function callCssVariable(cssVariable: `--${string}`) {
    return `var(${cssVariable})`
}