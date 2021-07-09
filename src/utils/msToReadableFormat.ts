const msToReadableFormat = (ms: number): string => {
  if (Number.isNaN(ms)) return "NaN"
  const seconds = +(ms / 1000).toFixed(1)
  const minutes = +(ms / (1000 * 60)).toFixed(1)
  const hours = +(ms / (1000 * 60 * 60)).toFixed(1)
  const days = +(ms / (1000 * 60 * 60 * 24)).toFixed(1)
  if (seconds < 60) return `${seconds} seconds`
  if (minutes < 60) return `${minutes} minutes`
  if (hours < 24) return `${hours} hours`
  return `${days} days`
}

export default msToReadableFormat
