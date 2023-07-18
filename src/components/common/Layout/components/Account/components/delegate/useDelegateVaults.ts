import useUser from "components/[guild]/hooks/useUser"
import { getDelegateVaults } from "components/common/Layout/components/Account/components/delegate/getDelegateVaults"
import useSWRImmutable from "swr/immutable"

const useDelegateVaults = () => {
  const { id, addresses } = useUser()

  const shouldFetch = typeof id === "number" && Array.isArray(addresses)

  const { data } = useSWRImmutable(
    shouldFetch ? ["delegateCashVaults", id] : null,
    () =>
      getDelegateVaults(
        typeof addresses?.[0] === "string"
          ? (addresses as unknown as string[])
          : addresses?.map(({ address }) => address)
      ).then((vaults) => {
        const alreadyLinkedAddresses = new Set(addresses)

        const unlinked = vaults.filter((vault) => !alreadyLinkedAddresses.has(vault))

        return unlinked
      })
  )

  return data ?? []
}

export default useDelegateVaults
