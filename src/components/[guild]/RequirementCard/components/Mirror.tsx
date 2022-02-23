import { Skeleton } from "@chakra-ui/react"
import Link from "components/common/Link"
import useMirrorEditions from "components/create-guild/Requirements/components/MirrorFormCard/hooks/useMirror"
import { RPC } from "connectors"
import { useMemo } from "react"
import { Requirement } from "types"
import RequirementText from "./RequirementText"

type Props = {
  requirement: Requirement
}

const Mirror = ({ requirement }: Props): JSX.Element => {
  const { isLoading, editions } = useMirrorEditions()

  const editionName = useMemo(() => {
    if (!requirement || !editions?.length) return null
    const edition = editions.find(
      (e) =>
        e.editionContractAddress?.toLowerCase() ===
          requirement.address?.toLowerCase() && e.editionId == requirement.value
    )
    return edition?.title
  }, [editions, requirement])

  return (
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
                {`(#${requirement.value})`}
              </>
            )}
      </Skeleton>
      {` Mirror edition`}
    </RequirementText>
  )
}

export default Mirror
