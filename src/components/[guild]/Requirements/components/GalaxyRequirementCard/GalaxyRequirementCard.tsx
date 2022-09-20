import { Skeleton, Text } from "@chakra-ui/react"
import { Requirement } from "types"
import RequirementCard from "../common/RequirementCard"
import useGalaxyCampaign from "./hooks/useGalaxyCampaign"

type Props = {
  requirement: Requirement
}

const GalaxyRequirementCard = ({ requirement }: Props): JSX.Element => {
  const { campaign, isLoading } = useGalaxyCampaign(requirement?.data?.galaxyId)

  return (
    <RequirementCard
      requirement={requirement}
      image={isLoading ? "" : campaign?.thumbnail}
      loading={isLoading}
    >
      <Text as="span">{`Participate in the `}</Text>
      <Skeleton as="span" isLoaded={!isLoading}>
        {isLoading ? "Loading..." : campaign?.name}
      </Skeleton>
      <Text as="span">{` Galxe campaign`}</Text>
    </RequirementCard>
  )
}

export default GalaxyRequirementCard
