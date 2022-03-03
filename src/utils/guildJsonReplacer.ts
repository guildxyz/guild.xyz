const replacer = (key, value) => {
  if (value === null) return undefined
  if (key === "discord_invite") return undefined
  if (key === "description" || key === "name") return value?.trim()
  if (
    key === "attribute" &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    value !== null &&
    Object.keys(value)?.length === 0
  )
    return undefined
  return value
}

export default replacer
