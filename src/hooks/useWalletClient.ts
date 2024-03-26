/**
 * This is a patched version of the original useWalletClient hook, because it caused
 * too many re-renders.
 *
 * We can delete it and use the one from wagmi when our PR will be merged:
 * https://github.com/wevm/wagmi/pull/3740
 */
import { useQuery as tanstack_useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useRef } from "react"

import {
  UseAccountReturnType,
  UseWalletClientParameters,
  UseWalletClientReturnType,
  useAccount,
  useChainId,
  useConfig,
} from "wagmi"
import { getWalletClientQueryOptions, hashFn } from "wagmi/query"

/** https://wagmi.sh/react/api/hooks/useWalletClient */
export function useWalletClient(
  parameters: UseWalletClientParameters = {}
): UseWalletClientReturnType {
  const { query = {}, ...rest } = parameters

  const config = useConfig(rest)
  const queryClient = useQueryClient()
  const { address, connector, status } = useAccount()
  const chainId = useChainId()

  const { queryKey, ...options } = getWalletClientQueryOptions(config, {
    ...parameters,
    chainId: parameters.chainId ?? chainId,
    connector: parameters.connector ?? connector,
  })
  const enabled = Boolean(status !== "disconnected" && (query.enabled ?? true))

  const addressRef = useRef<UseAccountReturnType["address"]>(address)

  // biome-ignore lint/nursery/useExhaustiveDependencies: `queryKey` not required
  useEffect(() => {
    if (!address) {
      // remove when account is disconnected
      queryClient.removeQueries({ queryKey })

      if (addressRef.current) {
        addressRef.current = undefined
      }
    } else if (address !== addressRef.current) {
      // invalidate when address changes
      queryClient.invalidateQueries({ queryKey })
      addressRef.current = address
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, queryClient])

  return useQuery({
    ...query,
    ...options,
    queryKey,
    enabled,
    staleTime: Infinity,
  } as any) as UseWalletClientReturnType
}

export function useQuery(parameters: any) {
  const result = tanstack_useQuery({
    ...(parameters as any),
    queryKeyHashFn: hashFn, // for bigint support
  })
  ;(result as any).queryKey = parameters.queryKey
  return result
}
