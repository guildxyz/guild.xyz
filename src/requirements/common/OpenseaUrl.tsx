import { openseaChains } from "pages/api/opensea-asset-data/[chain]/[address]/[[...tokenId]]"
import useSWRImmutable from "swr/immutable"
import { Requirement } from "types"
import BlockExplorerUrl from "./BlockExplorerUrl"
import { RequirementButton, RequirementLinkButton } from "./RequirementButton"

type Props = {
  requirement: Requirement
}

const OpenseaUrl = ({ requirement }: Props): JSX.Element => {
  const { data, isValidating } = useSWRImmutable<{
    name?: string
    slug?: string
    isOpensea: boolean
  }>(
    openseaChains[requirement.chain]
      ? `/api/opensea-asset-data/${requirement.chain}/${requirement.address}/${
          requirement.data.id ?? ""
        }`
      : null
  )

  if (!data && isValidating) return <RequirementButton isLoading />

  if ((!data && !isValidating) || !data?.isOpensea)
    return <BlockExplorerUrl requirement={requirement} />

  return (
    <RequirementLinkButton
      href={
        data.name && requirement.data.id
          ? `https://opensea.io/assets/${openseaChains[requirement.chain]}/${
              requirement.address
            }/${requirement.data.id}`
          : `https://opensea.io/collection/${data.slug}`
      }
      imageUrl="/requirementLogos/opensea.svg"
    >
      View on Opensea
    </RequirementLinkButton>
  )
}

export default OpenseaUrl
