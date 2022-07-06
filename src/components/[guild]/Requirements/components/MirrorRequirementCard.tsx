import { Skeleton } from "@chakra-ui/react"
import useMirrorEditions from "components/create-guild/Requirements/components/MirrorFormCard/hooks/useMirror"
import { useMemo } from "react"
import { Requirement } from "types"
import BlockExplorerUrl from "./common/BlockExplorerUrl"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const MirrorRequirementCard = ({ requirement }: Props): JSX.Element => {
  const { isLoading, editions } = useMirrorEditions()

  const { title: editionName, image } = useMemo(
    () =>
      editions?.find(
        (e) =>
          e.editionContractAddress?.toLowerCase() ===
            requirement.address?.toLowerCase() &&
          e.editionId?.toString() == requirement.data?.id
      ) || { title: null, image: null },
    [editions, requirement]
  )

  return (
    <RequirementCard
      requirement={requirement}
      image={isLoading ? "" : image}
      footer={<BlockExplorerUrl requirement={requirement} />}
    >
      {`Own the `}
      <Skeleton display="inline" isLoaded={!isLoading}>
        {isLoading ? "Loading..." : editionName || `(#${requirement.data?.id})`}
      </Skeleton>
      {` Mirror edition`}
    </RequirementCard>
  )
}

export default MirrorRequirementCard
