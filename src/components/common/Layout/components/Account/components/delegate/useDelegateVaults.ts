import { getDelegateVaults } from "components/common/Layout/components/Account/components/delegate/getDelegateVaults"
import useUser from "components/[guild]/hooks/useUser"
import useSWRImmutable from "swr/immutable"

const useDelegateVaults = () => {
  const { id, addresses, addressProviders } = useUser()

  const shouldFetch = typeof id === "number" && Array.isArray(addresses)

  const { data } = useSWRImmutable(
    shouldFetch ? ["delegateCashVaults", id] : null,
    () =>
      getDelegateVaults(addresses).then((vaults) => {
        const alreadyLinkedDelegateAddresses = new Set(
          Object.entries(addressProviders)
            .filter(([, prov]) => prov === "DELEGATE")
            .map(([addr]) => addr.toLowerCase())
        )

        const unlinked = vaults.filter(
          (vault) => !alreadyLinkedDelegateAddresses.has(vault)
        )

        return unlinked
      })
  )

  return data ?? []
}

export default useDelegateVaults
