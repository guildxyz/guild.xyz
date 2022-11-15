import useSWRImmutable from "swr/immutable"
import { Requirement } from "types"
import BlockExplorerUrl from "./BlockExplorerUrl"
import { RequirementButton, RequirementLinkButton } from "./RequirementButton"

type Props = {
  requirement: Requirement
}

const OpenseaUrl = ({ requirement }: Props): JSX.Element => {
  const { data, isValidating } = useSWRImmutable(
    requirement.chain === "ETHEREUM"
      ? `/api/opensea-asset-data/${requirement?.address}`
      : null
  )

  if (!data && isValidating) return <RequirementButton isLoading />

  if (!data && !isValidating) return <BlockExplorerUrl requirement={requirement} />

  return (
    <RequirementLinkButton
      href={`https://opensea.io/collection/${data?.slug}`}
      imageUrl="/requirementLogos/opensea.svg"
    >
      View on Opensea
    </RequirementLinkButton>
  )
}

export default OpenseaUrl
