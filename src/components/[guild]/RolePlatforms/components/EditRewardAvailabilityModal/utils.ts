export const getShortDate = (isoDate: string): string | undefined => {
  if (!isoDate) return undefined
  return isoDate.split("T")[0]
}

export const datetimeLocalToIsoString = (datetimeLocal: string): string | null => {
  if (!datetimeLocal) return null

  try {
    return new Date(datetimeLocal).toISOString()
  } catch {
    return null
  }
}
