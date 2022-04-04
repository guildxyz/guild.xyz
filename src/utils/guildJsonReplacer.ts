const replacer = (key, value) => {
  if (value === null) return undefined
  if (key === "discord_invite") return undefined
  if (key === "decimals") return undefined
  if (key === "description" || key === "name") return value?.trim()
  return value
}

export default replacer
