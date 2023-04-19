import pluralize from "./pluralize"

const formatRelativeTimeFromNow = (since: number) => {
  if (!since) return undefined

  const dayInMs = 86400000
  const sinceDays = since / dayInMs
  const sinceMonths = since / dayInMs / 30
  const sinceYears = since / dayInMs / 365
  const formatted =
    sinceYears >= 1
      ? pluralize(Math.round(sinceYears), "year")
      : sinceMonths >= 1
      ? pluralize(Math.round(sinceMonths), "month")
      : pluralize(Math.round(sinceDays), "day")

  return formatted
}

export default formatRelativeTimeFromNow
