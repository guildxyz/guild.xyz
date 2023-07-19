import platforms from "platforms/platforms"
import { PlatformType } from "types"
import capitalize from "utils/capitalize"

const processConnectorError = (error: string): string | undefined => {
  if (
    typeof error !== "string" ||
    (!error.includes("connector error") && !error.includes("runner error"))
  )
    return undefined

  try {
    const matchedPlatformId = error.match(/^"\d" /g)
    const platformName = matchedPlatformId?.length
      ? platforms[
          PlatformType[parseInt(matchedPlatformId[0].replace('"', "").trim())]
        ].name
      : null
    const cleanError = error.replaceAll("\\", "")
    const matchedMsg = cleanError.match(/{"msg":"(.*)"}/gm)
    const matchedError = cleanError.match(/error: "(.*)"/gm)

    const parsedError = JSON.parse(
      matchedMsg?.[0] ??
        (matchedError?.[0]
          ? `{${matchedError[0].replace("error", '"msg"').trim()}}`
          : "")
    )
    return capitalize(
      parsedError?.msg ? `${parsedError.msg} (${platformName} error)` : ""
    )
  } catch {
    console.error("Unknown error:", error)
    return "Unknown error. Please check the console for more details."
  }
}

export default processConnectorError
