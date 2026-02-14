const replacer = (key: string, value: unknown): unknown => {
  if (
    value === null &&
    key !== "visibilityRoleId" &&
    key !== "groupId"
  )
    return undefined
  if (key === "discord_invite") return undefined
  if (key === "balancyDecimals") return undefined
  if (key === "description" || key === "name")
    return (value as string)?.trim()
  return value
}

export default replacer
