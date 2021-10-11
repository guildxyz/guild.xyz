import type { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import useSWRImmtable from "swr/immutable"
import useToast from "./useToast"

const sign = async (_, library, account): Promise<string> =>
  library
    .getSigner(account)
    .signMessage("Please sign this message to verify your address")

const usePersonalSign = (shouldShowErrorToast = false) => {
  const { library, account } = useWeb3React<Web3Provider>()
  const toast = useToast()

  const { data, mutate, isValidating, error } = useSWRImmtable(
    ["sign", library, account],
    sign,
    {
      revalidateOnMount: false,
      shouldRetryOnError: false,
    }
  )

  const callbackWithSign = (callback: Function) => async () => {
    if (!data) {
      const newData = await mutate()
      if (newData) callback()
      else if (shouldShowErrorToast)
        toast({
          title: "Request rejected",
          description: "Please try again and confirm the request in your wallet",
          status: "error",
          duration: 4000,
        })
    } else {
      callback()
    }
  }

  const removeError = () => mutate((_) => _, false)

  return {
    addressSignedMessage: data,
    sign: () => mutate(),
    isSigning: isValidating,
    // explicit undefined instead of just "&& error" so it doesn't change to false
    error: !data && !isValidating ? error : undefined,
    removeError,
    callbackWithSign,
  }
}

export default usePersonalSign
