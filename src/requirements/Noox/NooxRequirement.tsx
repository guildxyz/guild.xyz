import { Skeleton } from "@chakra-ui/react"
import { RequirementComponentProps } from "requirements"
import useSWRImmutable from "swr/immutable"
import Requirement from "../common/Requirement"
import { RequirementLinkButton } from "../common/RequirementButton"
import { NooxBadge } from "./NooxForm"

const NooxRequirement = ({ requirement, ...rest }: RequirementComponentProps) => {
  const { data, isValidating } = useSWRImmutable<NooxBadge[]>("/api/noox")

  const badgeData = data?.find((badge) => badge.id === requirement.data.id)

  return (
    <Requirement
      isNegated={requirement.isNegated}
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
