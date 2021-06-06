const shortenHex = (hex: string, length = 4): string =>
  `${hex.substring(0, length + 2)}…${hex.substring(hex.length - length)}`

export default shortenHex
