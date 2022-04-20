import { HStack, Img, SkeletonCircle } from "@chakra-ui/react"
import useJuicebox from "components/create-guild/Requirements/components/JuiceboxFormCard/hooks/useJuicebox"
import { useMemo } from "react"
import { Requirement } from "types"
import RequirementCard from "./common/RequirementCard"
import RequirementText from "./common/RequirementText"

type Props = {
  requirement: Requirement
}

const JuiceboxRequirementCard = ({ requirement }: Props) => {
  const { projects, isLoading } = useJuicebox()

  const projectImage = useMemo(
    () => projects?.find((project) => project.id === requirement?.data?.id)?.logoUri,
    [requirement, projects]
  )

  return (
    <RequirementCard requirement={requirement}>
      <HStack spacing={4} alignItems="center">
        <SkeletonCircle minW={6} boxSize={6} isLoaded={!isLoading && !!projectImage}>
          <Img
            src={projectImage}
            alt={requirement.data?.id}
            width={6}
            borderRadius="full"
          />
        </SkeletonCircle>

        <RequirementText>{`Hold ${
          requirement.data?.amount > 0
            ? `at least ${requirement.data?.amount}`
            : "any amount of"
        } ${requirement.symbol} ticket(s) in Juicebox`}</RequirementText>
      </HStack>
    </RequirementCard>
  )
}

export default JuiceboxRequirementCard
