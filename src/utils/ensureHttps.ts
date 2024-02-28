export const ensureHttps = (url: string): string => {
  url = url.trim()
  if (/^http:\/\//i.test(url)) return url.replace(/^http:\/\//i, "https://")
  if (!/^https?:\/\//i.test(url)) return `https://${url}`
  return url
}
