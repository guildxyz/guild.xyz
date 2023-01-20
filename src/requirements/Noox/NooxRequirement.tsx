import { Link } from "@chakra-ui/react"
import DataBlock from "components/[guild]/Requirements/components/DataBlock"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import useSWRImmutable from "swr/immutable"
import { NooxBadge } from "./NooxForm"

const NooxRequirement = (props: RequirementProps) => {
  const requirement = useRequirementContext()

  const { data, isValidating, error } = useSWRImmutable<NooxBadge[]>("/api/noox")

  const badgeData = data?.find((badge) => badge.id === requirement.data.id)

  return (
    <Requirement
      isNegated={requirement.isNegated}
      image={badgeData?.image}
      isImageLoading={isValidating}
      {...props}
    >
      {`Have the `}
      {!badgeData || isValidating || error ? (
        <DataBlock
          isLoading={isValidating}
          error={error && "API error, please contact Noox to report."}
        >
          {`#${requirement.data.id}`}
        </DataBlock>
      ) : (
        <Link
          href={`https://noox.world/badge/${badgeData?.id}`}
          isExternal
          display="inline"
          colorScheme="blue"
          fontWeight="medium"
        >
          {badgeData.name}
        </Link>
      )}

      {` Noox badge`}
    </Requirement>
  )
}

export default NooxRequirement
