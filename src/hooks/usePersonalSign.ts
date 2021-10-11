import type { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import useSWRSubmit from "components/index/hooks/useSWRSubmit"
import useToast from "./useToast"

const sign = async (_, library, account): Promise<string> =>
  library
    .getSigner(account)
    .signMessage("Please sign this message to verify your address")

const usePersonalSign = (shouldShowErrorToast = false) => {
  const { library, account } = useWeb3React<Web3Provider>()
  const toast = useToast()

  const { data, isLoading, error, removeError, onSubmit } = useSWRSubmit(
    ["sign", library, account],
    sign
  )

  const handleError = shouldShowErrorToast
    ? () =>
        toast({
          title: "Request rejected",
          description: "Please try again and confirm the request in your wallet",
          status: "error",
          duration: 4000,
        })
    : undefined

  const callbackWithSign = (callback: Function) => async () =>
    onSubmit(callback, handleError)()

  return {
    addressSignedMessage: data,
    isSigning: isLoading,
    error,
    removeError,
    callbackWithSign,
  }
}

export default usePersonalSign
