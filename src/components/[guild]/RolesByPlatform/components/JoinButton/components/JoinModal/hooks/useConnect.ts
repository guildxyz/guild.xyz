import { useRumAction, useRumError } from "@datadog/rum-react-integration"
import { useWeb3React } from "@web3-react/core"
import { useSubmitWithSign, WithValidation } from "hooks/useSubmit"
import { mutate } from "swr"
import { PlatformName } from "types"
import fetcher from "utils/fetcher"

const useConnect = () => {
  const { account } = useWeb3React()
  const addDatadogAction = useRumAction("trackingAppAction")
  const addDatadogError = useRumError()

  const submit = ({ data, validation }: WithValidation<unknown>) =>
    fetcher("/user/connect", {
      body: data,
      validation,
    }).then((body) => {
      if (body === "rejected") {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw "Something went wrong, connect request rejected."
      }

      if (typeof body === "string") {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw body
      }

      return body
    })

  // TODO: replace "any" types
  const useSubmitResponse = useSubmitWithSign<
    { platformName: PlatformName; authData: any },
    any
  >(submit, {
    onSuccess: () => {
      addDatadogAction("Successfully connected 3rd party account")
      mutate(`/user/${account}`)
    },
    onError: (err) => {
      addDatadogError("3rd party account connection error", { error: err }, "custom")
    },
  })

  return useSubmitResponse
}

export default useConnect
