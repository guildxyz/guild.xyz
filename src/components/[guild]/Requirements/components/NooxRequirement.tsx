import { Skeleton } from "@chakra-ui/react"
import { NooxBadge } from "components/create-guild/Requirements/components/NooxForm"
import useSWRImmutable from "swr/immutable"
import { RequirementComponentProps } from "types"
import Requirement from "./common/Requirement"
import { RequirementLinkButton } from "./common/RequirementButton"

const NooxRequirement = ({ requirement, ...rest }: RequirementComponentProps) => {
  const { data, isValidating } = useSWRImmutable<NooxBadge[]>("/api/noox")

  const badgeData = data?.find((badge) => badge.id === requirement.data.id)

  return (
    <Requirement
      image={badgeData?.image}
      footer={
        <RequirementLinkButton
          href={`https://noox.world/badge/${badgeData?.id}`}
          imageUrl={"/requirementLogos/noox.svg"}
          isLoading={isValidating}
        >
          View on Noox
        </RequirementLinkButton>
      }
      {...rest}
    >
      {`Have the `}
      <Skeleton as="span" isLoaded={!!badgeData}>
        {badgeData?.name ?? "Loading..."}
      </Skeleton>
      {` Noox badge`}
    </Requirement>
  )
}

export default NooxRequirement
