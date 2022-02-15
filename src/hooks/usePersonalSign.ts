import type { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import Cookies from "js-cookie"
import { useCallback, useState } from "react"
import useSWR, { mutate } from "swr"
import fetcher from "utils/fetcher"

const usePersonalSign = () => {
  const { library, account } = useWeb3React<Web3Provider>()
  const [error, setError] =
    useState<{ error: string; errorDescription: string }>(null)
  const [isSigning, setIsSigning] = useState<boolean>(false)

  const getSessionToken = useCallback(async (): Promise<void> => {
    if (!Cookies.get("sessionToken")) {
      const challange = await fetcher("/auth/challenge", {
        method: "POST",
        body: { address: account },
      })
        .catch((e) => {
          console.log(e)
          throw Error("Failed to request signature challenge")
        })
        .then((response) => response.challange)

      const addressSignedMessage = await library
        .getSigner(account)
        .signMessage(challange)

      await fetcher("/auth/session", {
        method: "POST",
        body: { address: account, addressSignedMessage },
      })
    }
    await mutate(`/user/${account}`)
  }, [account, library])

  // Just so we can call a mutate from fetcher if the response is 401
  const { mutate: fetchSessionToken } = useSWR(
    "fetchSessionToken",
    getSessionToken,
    {
      revalidateOnFocus: false,
      revalidateOnMount: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      shouldRetryOnError: false,
    }
  )

  const removeError = () => setError(null)

  const callbackWithSign = (callback) => async (props?) => {
    removeError()
    setIsSigning(true)
    await getSessionToken()
      .catch((e) => {
        setError(e)
        throw e
      })
      .finally(() => setIsSigning(false))
    return callback(props)
  }

  return {
    sign: fetchSessionToken,
    callbackWithSign,
    isSigning,
    // explicit undefined instead of just "&& error" so it doesn't change to false
    error: !isSigning ? error : undefined,
    removeError,
  }
}

export default usePersonalSign
