const MINUTE_IN_MS = 60 * 1000
const HOUR_IN_MS = 60 * MINUTE_IN_MS
const DAY_IN_MS = 24 * HOUR_IN_MS
const UNIT_LABELS = ["day", "hour", "minute"]

const msToDayHourMinute = (ms: number) => {
  let msToWorkWith = ms
  const days = Math.floor(msToWorkWith / DAY_IN_MS)
  msToWorkWith -= days * DAY_IN_MS
  const hours = Math.floor(msToWorkWith / HOUR_IN_MS)
  msToWorkWith -= hours * HOUR_IN_MS
  const minutes = Math.ceil(msToWorkWith / MINUTE_IN_MS)

  return [days, hours, minutes]
}

export { UNIT_LABELS }
export default msToDayHourMinute
