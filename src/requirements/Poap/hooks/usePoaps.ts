import { KeyedMutator } from "swr"
import useSWRImmutable from "swr/immutable"
import { Poap } from "types"

export const usePoaps = (
  search = ""
): { poaps: Array<Poap>; isLoading: boolean } => {
  const { isLoading, data } = useSWRImmutable(
    search.length > 0 ? `/v2/third-party/poaps?search=${search}` : null
  )

  return {
    isLoading,
    poaps: data
      ? data.map((poap) => ({ ...poap, image_url: `${poap.image_url}?size=small` }))
      : undefined,
  }
}

export const usePoap = (
  fancyId: string
): { poap: Poap; isLoading: boolean; mutatePoap: KeyedMutator<any>; error: any } => {
  const { isLoading, data, mutate, error } = useSWRImmutable<Poap>(
    fancyId ? `/v2/third-party/poaps/${fancyId}` : null
  )

  return {
    isLoading,
    poap: data ? { ...data, image_url: `${data.image_url}?size=small` } : undefined,
    mutatePoap: mutate,
    error,
  }
}
