import { HStack, Img, SkeletonCircle } from "@chakra-ui/react"
import usePoaps from "components/create-guild/Requirements/components/PoapFormCard/hooks/usePoaps"
import { useMemo } from "react"
import { Requirement } from "types"
import RequirementCard from "./common/RequirementCard"
import RequirementText from "./common/RequirementText"

type Props = {
  requirement: Requirement
}

const PoapRequirementCard = ({ requirement }: Props) => {
  // TODO: maybe somehow we could fetch only 1 POAP by fancy_id?
  const { poaps, isLoading } = usePoaps()

  const poapImage = useMemo(
    () => poaps?.find((poap) => poap.fancy_id === requirement?.data?.id)?.image_url,
    [requirement, poaps]
  )

  return (
    <RequirementCard requirement={requirement}>
      <HStack spacing={4} alignItems="center">
        <SkeletonCircle minW={6} boxSize={6} isLoaded={!isLoading && !!poapImage}>
          <Img
            src={poapImage}
            alt={requirement.data?.id}
            width={6}
            borderRadius="full"
          />
        </SkeletonCircle>

        <RequirementText>{`Own the ${requirement.data?.id} POAP`}</RequirementText>
      </HStack>
    </RequirementCard>
  )
}

export default PoapRequirementCard
