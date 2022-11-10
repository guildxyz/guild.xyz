import { Skeleton } from "@chakra-ui/react"
import { NooxBadge } from "components/create-guild/Requirements/components/NooxFormCard"
import useSWRImmutable from "swr/immutable"
import { RequirementCardComponentProps } from "types"
import { RequirementLinkButton } from "./common/RequirementButton"
import RequirementCard from "./common/RequirementCard"

const NooxRequirementCard = ({
  requirement,
  ...rest
}: RequirementCardComponentProps) => {
  const { data, isValidating } = useSWRImmutable<NooxBadge[]>("/api/noox")

  const badgeData = data?.find((badge) => badge.id === requirement.data.id)

  return (
    <RequirementCard
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
    </RequirementCard>
  )
}

export default NooxRequirementCard
