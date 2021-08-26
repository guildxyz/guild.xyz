// Helper method for converting ms to month(s)
const convertMsToMonths = (ms: number) => {
  if (!ms) return undefined

  return Math.round(ms * 3.8026486208174e-10)
}

export default convertMsToMonths
