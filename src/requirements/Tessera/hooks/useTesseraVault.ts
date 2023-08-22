import useSWRImmutable from "swr/immutable"
import { PartialTessaraVault } from "./useTesseraVaults"

const useTesseraVault = (
  slug: string
): { vault: PartialTessaraVault; isLoading: boolean } => {
  const { data: response, isLoading } = useSWRImmutable<{
    data: PartialTessaraVault
  }>(slug ? `https://api.tessera.co/vaults/${slug}` : null)

  return {
    vault: response?.data,
    isLoading,
  }
}

export default useTesseraVault
