import useOpenseaAssetData from "hooks/useOpenseaAssetData"
import { openseaChains } from "pages/api/opensea-asset-data/[chain]/[address]/[[...tokenId]]"
import useNftMetadata from "requirements/Nft/hooks/useNftMetadata"
import { Requirement } from "types"
import BlockExplorerUrl from "./BlockExplorerUrl"
import { RequirementButton, RequirementLinkButton } from "./RequirementButton"

type Props = {
  requirement: Requirement
}

const OpenseaUrl = ({ requirement }: Props): JSX.Element => {
  const { metadata, isLoading } = useNftMetadata(
    requirement.chain === "ETHEREUM" ? requirement.address : null
  )
  const { data: openseaData, isValidating: isOpenseaDataLoading } =
    useOpenseaAssetData(requirement)

  const data = metadata ?? openseaData
  const isValidating = isLoading || isOpenseaDataLoading

  if (!data && isValidating) return <RequirementButton isLoading />

  if (!data && !isValidating) return <BlockExplorerUrl requirement={requirement} />

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
