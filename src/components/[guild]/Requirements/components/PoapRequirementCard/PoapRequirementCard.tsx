import { HStack, Img, SkeletonCircle } from "@chakra-ui/react"
import { Requirement } from "types"
import RequirementCard from "../common/RequirementCard"
import RequirementText from "../common/RequirementText"
import usePoap from "./hooks/usePoap"

type Props = {
  requirement: Requirement
}

const PoapRequirementCard = ({ requirement }: Props) => {
  const { poap, isLoading } = usePoap(requirement?.data?.id)

  return (
    <RequirementCard requirement={requirement}>
      <HStack spacing={4} alignItems="center">
        <SkeletonCircle
          minW={6}
          boxSize={6}
          isLoaded={!isLoading && !!poap?.image_url}
        >
          <Img
            src={poap?.image_url}
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
