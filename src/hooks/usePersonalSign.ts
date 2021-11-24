import type { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import useSWRImmtable from "swr/immutable"

const sign = async (_, library, account): Promise<string> =>
  library
    .getSigner(account)
    .signMessage("Please sign this message to verify your address")

const usePersonalSign = () => {
  const { library, account } = useWeb3React<Web3Provider>()

  const { data, mutate, isValidating, error } = useSWRImmtable(
    ["sign", library, account],
    sign,
    {
      revalidateOnMount: false,
      shouldRetryOnError: false,
    }
  )

  const removeError = () => mutate((_) => _, false)

  const callbackWithSign = (callback) => async (props?) => {
    removeError()
    if (!data) {
      const newData = await mutate()
      if (!newData) throw new Error("Sign request rejected")

      return callback({ ...props, addressSignedMessage: newData })
    }
    return callback({ ...props, addressSignedMessage: data })
  }

  return {
    addressSignedMessage: data,
    sign: mutate,
    callbackWithSign,
    isSigning: isValidating,
    // explicit undefined instead of just "&& error" so it doesn't change to false
    error: !data && !isValidating ? error : undefined,
    removeError,
  }
}

export default usePersonalSign
