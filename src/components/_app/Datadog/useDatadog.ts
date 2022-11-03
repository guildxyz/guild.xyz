import { useRumAction, useRumError } from "@datadog/rum-react-integration"
import { useWeb3React } from "@web3-react/core"
import useUser from "components/[guild]/hooks/useUser"

const useDatadog = () => {
  const defaultAddDatadogAction = useRumAction("trackingAppAction")
  const defaultAddDatadogError = useRumError()

  const { id: userId } = useUser()
  const { account } = useWeb3React()

  const defaultCustomAttributes = {
    userId,
    userAddress: account?.toLowerCase(),
  }

  const addDatadogAction = (
    name: string,
    customAttributes?: Record<string, unknown>
  ) =>
    defaultAddDatadogAction(
      name,
      customAttributes
        ? { ...defaultCustomAttributes, ...customAttributes }
        : defaultCustomAttributes
    )

  const addDatadogError = (
    error: unknown,
    customAttributes: Record<string, unknown>
  ) =>
    defaultAddDatadogError(
      error,
      { ...defaultCustomAttributes, ...customAttributes },
      "custom"
    )

  return { addDatadogAction, addDatadogError }
}

export default useDatadog
