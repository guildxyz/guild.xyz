import useSWRImmutable from "swr/immutable"
import { Poap } from "types"

const usePoapById = (
  poapId: string
): { poap: Poap; isPoapByIdLoading: boolean; error: any } => {
  const parsedPoapId = poapId?.replace("#", "")

  const { isValidating, data, error } = useSWRImmutable<Poap>(
    poapId ? `/v2/third-party/poaps/${parsedPoapId}` : null
  )

  return { isPoapByIdLoading: isValidating, poap: data, error }
}

export default usePoapById
