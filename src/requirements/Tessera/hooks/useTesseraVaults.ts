import useSWRImmutable from "swr/immutable"
import { Rest } from "types"

type PartialTessaraVault = {
  slug: string
  name: string
  imageUrl: string
} & Rest

const useTesseraVaults = () => {
  const { data: response, isValidating: isLoading } = useSWRImmutable<{
    data: PartialTessaraVault[]
  }>("https://api.tessera.co/vaults")

  return {
    data: response?.data,
    isLoading,
  }
}

export default useTesseraVaults
export type { PartialTessaraVault }
