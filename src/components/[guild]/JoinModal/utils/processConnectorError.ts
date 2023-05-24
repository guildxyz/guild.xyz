import capitalize from "utils/capitalize"

const processConnectorError = (error: string): string | undefined => {
  if (
    typeof error !== "string" ||
    (!error.includes("connector error") && !error.includes("runner error"))
  )
    return undefined

  try {
    const matchedError = error.replaceAll("\\", "").match(/{"msg":"(.*)"}/gm)
    const parsedError = JSON.parse(matchedError?.[0])
    return capitalize(parsedError?.msg ?? "")
  } catch {
    console.error("Unknown error:", error)
    return "Unknown error. Please check the console for more details."
  }
}

export default processConnectorError
