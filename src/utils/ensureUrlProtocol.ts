export const ensureUrlProtocol = (url: string): string => {
  url = encodeURI(url.trim())
  try {
    new URL(url)
    return url
  } catch {
    return `https://${url}`
  }
}
