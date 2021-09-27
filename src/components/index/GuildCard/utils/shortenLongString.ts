const shortenLongString = (string: string): string => {
  if (!string) return ""
  return string.length > 10 ? `${string.substring(0, 8)}...` : string
}

export default shortenLongString
