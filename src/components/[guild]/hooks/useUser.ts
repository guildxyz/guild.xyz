import { useWeb3React } from "@web3-react/core"
import { useSubmitWithSign } from "hooks/useSubmit/useSubmit"
import { useEffect } from "react"
import useSWR from "swr"
import { User } from "types"

const getlinkedAddressesCount = (addresses: string[] | number) => {
  if (!addresses) return
  if (Array.isArray(addresses)) return addresses.length > 1 && addresses.length - 1
  return addresses > 1 && addresses - 1
}

const useUser = () => {
  const { account } = useWeb3React()

  const { isSigning, onSubmit, response } = useSubmitWithSign(
    async ({ validation }) => ({
      method: "POST",
      validation,
      timestamp: Date.now(),
      body: {},
    })
  )

  const { data: validation, mutate: mutateValidation } = useSWR(
    "userValidation",
    () => undefined,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      refreshInterval: 0,
      revalidateOnMount: false,
      revalidateOnReconnect: false,
    }
  )

  useEffect(() => {
    if (response) mutateValidation(response, { revalidate: false })
  }, [response, mutateValidation])

  const endpoint = validation ? `/user/details/${account}` : `/user/${account}`

  const { isValidating, data, mutate } = useSWR<User>(
    account ? [endpoint, validation] : null,
    null,
    validation
      ? {
          refreshInterval: 0,
          revalidateOnFocus: false,
          revalidateOnReconnect: false,
          revalidateIfStale: false,
        }
      : {}
  )

  return {
    isSigning,
    isLoading: !data && isValidating,
    ...data,
    linkedAddressesCount: getlinkedAddressesCount(data?.addresses),
    verifyAddress: () => onSubmit(),
    mutate,
  }
}

export default useUser
