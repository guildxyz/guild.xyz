import {
  RequirementButton,
  RequirementLinkButton,
} from "components/[guild]/Requirements/components/RequirementButton"
import type { Chain } from "connectors"
import useNftMetadata, {
  useNftMetadataWithTraits,
} from "requirements/Nft/hooks/useNftMetadata"
import BlockExplorerUrl from "./BlockExplorerUrl"
import { useRequirementContext } from "./RequirementContext"

const openseaCompatibleChain: Partial<Record<Chain, string>> = {
  POLYGON: "matic",
}

const OpenseaUrl = (): JSX.Element => {
  const { chain, address, data } = useRequirementContext()

  const { metadata: metadataWithTraits, isLoading: isMetadataWithTraitsLoading } =
    useNftMetadataWithTraits(chain, address)
  const { metadata, isLoading } = useNftMetadata(chain, address, data.id)

  const isValidating = isLoading || isMetadataWithTraitsLoading

  if (!metadataWithTraits && !metadata && isValidating)
    return <RequirementButton isLoading />

  if (!metadataWithTraits && !metadata && !isValidating) return <BlockExplorerUrl />

  return (
    <RequirementLinkButton
      href={
        metadata
          ? `https://opensea.io/assets/${
              openseaCompatibleChain[chain] ?? chain.toLowerCase()
            }/${address}/${data.id}`
          : `https://opensea.io/collection/${metadataWithTraits.slug}`
      }
      imageUrl="/requirementLogos/opensea.svg"
    >
      View on Opensea
    </RequirementLinkButton>
  )
}

export default OpenseaUrl
