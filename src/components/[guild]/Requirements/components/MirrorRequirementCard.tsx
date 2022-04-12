import { Skeleton } from "@chakra-ui/react"
import Link from "components/common/Link"
import useMirrorEditions from "components/create-guild/Requirements/components/MirrorFormCard/hooks/useMirror"
import { RPC } from "connectors"
import { useMemo } from "react"
import { Requirement } from "types"
import RequirementCard from "./common/RequirementCard"
import RequirementText from "./common/RequirementText"

type Props = {
  requirement: Requirement
}

const MirrorRequirementCard = ({ requirement }: Props): JSX.Element => {
  const { isLoading, editions } = useMirrorEditions()

  const editionName = useMemo(() => {
    if (!requirement || !editions?.length) return null
    const edition = editions.find(
      (e) =>
        e.editionContractAddress?.toLowerCase() ===
          requirement.address?.toLowerCase() && e.editionId == requirement.data?.id
    )
    return edition?.title
  }, [editions, requirement])

  return (
    <RequirementCard requirement={requirement}>
      <RequirementText>
        {`Own the `}
        <Skeleton display="inline" isLoaded={!isLoading}>
          {isLoading
            ? "Loading..."
            : editionName || (
                <>
                  <Link
                    href={`${RPC[requirement.chain]?.blockExplorerUrls?.[0]}/token/${
                      requirement.address
                    }`}
                    isExternal
                    title="View on explorer"
                  >
                    {requirement.name}
                  </Link>
                  {`(#${requirement.data?.id})`}
                </>
              )}
        </Skeleton>
        {` Mirror edition`}
      </RequirementText>
    </RequirementCard>
  )
}

export default MirrorRequirementCard
