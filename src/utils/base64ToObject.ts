const base64ToObject = <T = Record<string, any>>(
  base64String: string
): T | undefined => {
  try {
    return JSON.parse(
      Buffer.from(
        base64String.replace("data:application/json;base64,", ""),
        "base64"
      ).toString("utf-8")
    )
  } catch {
    return undefined
  }
}

export default base64ToObject
