const replacer = (key, value) => {
  if (value === null) return undefined
  if (key === "discord_invite") return undefined
  if (key === "decimals") return undefined
  if (key === "description" || key === "name") return value?.trim()
  if (key === "grantAccessToExistingUsers" && !!value) return value === "true"
  return value
}

export default replacer
