const kebabToCamelCase = (str: string): string =>
  str.replace(/-./g, (match) => match[1].toUpperCase())

export default kebabToCamelCase
