import useOpenseaAssetData from "hooks/useOpenseaAssetData"
import { openseaChains } from "pages/api/opensea-asset-data/[chain]/[address]/[[...tokenId]]"
import { Requirement } from "types"
import BlockExplorerUrl from "./BlockExplorerUrl"
import { RequirementButton, RequirementLinkButton } from "./RequirementButton"

type Props = {
  requirement: Requirement
}

const OpenseaUrl = ({ requirement }: Props): JSX.Element => {
  const { data, isValidating } = useOpenseaAssetData(requirement)

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
