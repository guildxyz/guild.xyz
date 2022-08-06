import { ErrorInfo } from "components/common/Error"
import { DiscordError } from "types"

const processDiscordError = (error: DiscordError): ErrorInfo => ({
  title: error.error[0].toUpperCase() + error.error.replaceAll("_", " ").slice(1),
  description: error.errorDescription,
})

export default processDiscordError
