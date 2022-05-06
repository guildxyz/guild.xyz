import { HStack, Img, Skeleton, SkeletonCircle } from "@chakra-ui/react"
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
    <RequirementCard requirement={requirement}>
      <HStack spacing={4} alignItems="center">
        <SkeletonCircle minW={6} boxSize={6} isLoaded={!isLoading && !!image}>
          <Img
            src={image}
            alt={requirement.data?.id}
            width={6}
            borderRadius="full"
          />
        </SkeletonCircle>
        <RequirementText>
          {`Own the `}
          <Skeleton display="inline" isLoaded={!isLoading}>
            {isLoading
              ? "Loading..."
              : editionName || (
                  <>
                    <Link
                      href={`${
                        RPC[requirement.chain]?.blockExplorerUrls?.[0]
                      }/token/${requirement.address}`}
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
      </HStack>
    </RequirementCard>
  )
}

export default MirrorRequirementCard
