import useSWRImmutable from "swr/immutable"
import { SelectOption } from "types"

type PartialTessaraVault = {
  slug: string
  name: string
  imageUrl: string
}

const useTesseraVaults = (): { vaults: SelectOption[]; isLoading: boolean } => {
  const { data: response, isValidating: isLoading } = useSWRImmutable<{
    data: PartialTessaraVault[]
  }>("https://api-develop.fractional.xyz/vaults")

  return {
    vaults:
      response?.data?.map((vault) => ({
        label: vault.name,
        value: vault.slug,
        img: vault.imageUrl,
      })) ?? [],
    isLoading,
  }
}

export default useTesseraVaults
export type { PartialTessaraVault }
