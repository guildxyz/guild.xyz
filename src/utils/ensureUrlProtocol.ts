export const ensureUrlProtocol = (url: string): string => {
  url = url.trim()
  try {
    new URL(url)
    return url
  } catch {
    return `https://${url}`
  }
}
