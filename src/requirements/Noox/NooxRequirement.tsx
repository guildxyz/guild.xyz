import { Link, Text } from "@chakra-ui/react"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import DataBlock from "components/common/DataBlock"
import useNooxBadge from "./hooks/useNooxBadge"

const NooxRequirement = (props: RequirementProps) => {
  const requirement = useRequirementContext()

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
          error={isError && "Couldn't fetch Noox badge data"}
        >
          {`#${requirement.data.id}`}
        </DataBlock>
      ) : (
        <Link
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
