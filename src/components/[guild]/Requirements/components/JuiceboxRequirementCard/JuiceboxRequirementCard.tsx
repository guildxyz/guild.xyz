import { HStack, Img, Skeleton, SkeletonCircle } from "@chakra-ui/react"
import { Requirement } from "types"
import RequirementCard from "../common/RequirementCard"
import RequirementText from "../common/RequirementText"
import useJuiceboxProject from "./hooks/useJuiceboxProject"

type Props = {
  requirement: Requirement
}

const JuiceboxRequirementCard = ({ requirement }: Props) => {
  const { project, isLoading } = useJuiceboxProject(requirement?.data?.id)

  return (
    <RequirementCard requirement={requirement}>
      <HStack spacing={4} alignItems="center">
        <SkeletonCircle
          minW={6}
          boxSize={6}
          isLoaded={!isLoading && !!project?.logoUri}
        >
          <Img
            src={project?.logoUri}
            alt={requirement.data?.id}
            width={6}
            borderRadius="full"
          />
        </SkeletonCircle>

        <RequirementText>
          {!isLoading && !project ? (
            "Could not fetch requirement."
          ) : (
            <>
              {`Hold ${
                requirement.data?.minAmount > 0
                  ? `at least ${requirement.data?.minAmount}`
                  : "any amount of"
              } `}
              <Skeleton display="inline" isLoaded={!isLoading}>
                {isLoading ? "Loading..." : project.name}
              </Skeleton>
              {` ticket(s) in Juicebox`}
            </>
          )}
        </RequirementText>
      </HStack>
    </RequirementCard>
  )
}

export default JuiceboxRequirementCard
