import pluralize from "./pluralize"

export const DAY_IN_MS = 86400000
export const MINUTE_IN_MS = 60000

const formatRelativeTimeFromNow = (since: number) => {
  if (!since) return undefined

  const sinceDays = since / DAY_IN_MS

  const sinceYears = sinceDays / 365
  if (sinceYears >= 1) return pluralize(Math.round(sinceYears), "year")

  const sinceMonths = sinceDays / 30
  if (sinceMonths >= 1) return pluralize(Math.round(sinceMonths), "month")

  if (sinceDays >= 1) return pluralize(Math.round(sinceDays), "day")

  const sinceMinutes = since / MINUTE_IN_MS

  const sinceHours = sinceMinutes / 60
  if (sinceHours >= 1) return pluralize(Math.round(sinceHours), "hour")

  return pluralize(Math.round(sinceMinutes), "minute")
}

export default formatRelativeTimeFromNow
