const replacer = (key, value) => {
  if (value === null) return undefined
  if (key === "description") return value?.trim()
  return value
}

export default replacer
