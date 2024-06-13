import { Link, Text } from "@chakra-ui/react"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import DataBlock from "components/common/DataBlock"
import useNooxBadge from "./hooks/useNooxBadge"

const NooxRequirement = (props: RequirementProps) => {
  const requirement = useRequirementContext()

  // @ts-expect-error TODO: fix this error originating from strictNullChecks
  const { badgeMetaData, isError, isLoading } = useNooxBadge(requirement.data.id)

  return (
    <Requirement
      image={badgeMetaData?.image_thumbnail?.replace(
        "ipfs://",
        "https://ipfs.io/ipfs/"
      )}
      isImageLoading={isLoading}
      {...props}
    >
      <Text as="span">{`Have the `}</Text>
      {!badgeMetaData || isLoading || isError ? (
        <DataBlock
          isLoading={isLoading}
          // @ts-expect-error TODO: fix this error originating from strictNullChecks
          error={isError && "Couldn't fetch Noox badge data"}
        >
          {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
          {`#${requirement.data.id}`}
        </DataBlock>
      ) : (
        <Link
          // @ts-expect-error TODO: fix this error originating from strictNullChecks
          href={`https://noox.world/badge/${requirement.data.id}`}
          isExternal
          display="inline"
          colorScheme="blue"
          fontWeight="medium"
        >
          {badgeMetaData.name}
        </Link>
      )}

      <Text as="span">{` Noox badge`}</Text>
    </Requirement>
  )
}

export default NooxRequirement
