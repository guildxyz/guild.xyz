import type { Chain } from "connectors"
import useNftMetadata, {
  useNftMetadataWithTraits,
} from "requirements/Nft/hooks/useNftMetadata"
import { Requirement } from "types"
import BlockExplorerUrl from "./BlockExplorerUrl"
import { RequirementButton, RequirementLinkButton } from "./RequirementButton"

type Props = {
  requirement: Requirement
}

const openseaCompatibleChain: Partial<Record<Chain, string>> = {
  POLYGON: "matic",
}

const OpenseaUrl = ({ requirement }: Props): JSX.Element => {
  const { metadata: metadataWithTraits, isLoading: isMetadataWithTraitsLoading } =
    useNftMetadataWithTraits(requirement.chain, requirement.address)
  const { metadata, isLoading } = useNftMetadata(
    requirement.chain,
    requirement.address,
    requirement.data.id
  )

  const isValidating = isLoading || isMetadataWithTraitsLoading

  if (!metadataWithTraits && !metadata && isValidating)
    return <RequirementButton isLoading />

  if (!metadataWithTraits && !metadata && !isValidating)
    return <BlockExplorerUrl requirement={requirement} />

  return (
    <RequirementLinkButton
      href={
        metadata
          ? `https://opensea.io/assets/${
              openseaCompatibleChain[requirement.chain] ??
              requirement.chain.toLowerCase()
            }/${requirement.address}/${requirement.data.id}`
          : `https://opensea.io/collection/${metadataWithTraits.slug}`
      }
      imageUrl="/requirementLogos/opensea.svg"
    >
      View on Opensea
    </RequirementLinkButton>
  )
}

export default OpenseaUrl
