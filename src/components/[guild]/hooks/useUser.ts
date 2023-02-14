import { useWeb3React } from "@web3-react/core"
import { useIntercom } from "components/_app/IntercomProvider"
import useKeyPair from "hooks/useKeyPair"
import { useEffect } from "react"
import useSWRImmutable from "swr/immutable"
import { User } from "types"
import { useFetcherWithSign } from "utils/fetcher"

const useUser = () => {
  const { account } = useWeb3React()
  const { keyPair, ready, isValid } = useKeyPair()
  const fetcherWithSign = useFetcherWithSign()

  const { intercomSettings, defineIntercomSettingsValue } = useIntercom()

  const { isValidating, data, mutate } = useSWRImmutable<User>(
    account && ready && keyPair && isValid
      ? [`/user/details/${account}`, { method: "POST", body: {} }]
      : null,
    fetcherWithSign
  )

  useEffect(() => {
    if (!data) return
    if (intercomSettings?.userId !== data.id)
      defineIntercomSettingsValue("userId", data.id)

    const lowerCaseUserAddress = data.addresses[0].toLowerCase()

    if (intercomSettings?.address !== lowerCaseUserAddress)
      defineIntercomSettingsValue("address", lowerCaseUserAddress)

    const connectedPlatform = data.platformUsers.map((pu) => pu.platformName).join()

    if (intercomSettings?.connectedPlatforms !== connectedPlatform)
      defineIntercomSettingsValue("connectedPlatforms", connectedPlatform)
  }, [data])

  return {
    isLoading: !data && isValidating,
    ...data,
    mutate,
  }
}

export default useUser
