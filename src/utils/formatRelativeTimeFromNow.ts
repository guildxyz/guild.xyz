import pluralize from "./pluralize"

export const SECOND_IN_MS = 1000
export const MINUTE_IN_MS = 60000
export const HOUR_IN_MS = 3600000
export const DAY_IN_MS = 86400000

const formatRelativeTimeFromNow = (
  since?: number
): string | undefined => {
  if (!since) return undefined

  const sinceDays = since / DAY_IN_MS

  const sinceYears = sinceDays / 365
  if (sinceYears >= 1)
    return pluralize(Math.round(sinceYears), "year")

  const sinceMonths = sinceDays / 30
  if (sinceMonths >= 1)
    return pluralize(Math.round(sinceMonths), "month")

  if (sinceDays >= 1)
    return pluralize(Math.round(sinceDays), "day")

  const sinceHours = since / HOUR_IN_MS
  if (sinceHours >= 1)
    return pluralize(Math.round(sinceHours), "hour")

  const sinceMinutes = since / MINUTE_IN_MS

  return pluralize(Math.round(sinceMinutes), "minute")
}

export default formatRelativeTimeFromNow

