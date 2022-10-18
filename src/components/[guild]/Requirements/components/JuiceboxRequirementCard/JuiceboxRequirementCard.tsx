import { Skeleton, Text } from "@chakra-ui/react"
import { Requirement } from "types"
import RequirementCard from "../common/RequirementCard"
import useJuiceboxProject from "./hooks/useJuiceboxProject"

type Props = {
  requirement: Requirement
}

const JuiceboxRequirementCard = ({ requirement, ...rest }: Props) => {
  const { project, isLoading } = useJuiceboxProject(requirement?.data?.id)

  return (
    <RequirementCard
      requirement={requirement}
      image={isLoading ? "" : project?.logoUri}
      loading={isLoading}
      {...rest}
    >
      {!isLoading && !project ? (
        <Text as="span">Could not fetch requirement.</Text>
      ) : (
        <>
          <Text as="span">{`Hold ${
            requirement.data?.minAmount > 0
              ? `at least ${requirement.data?.minAmount}`
              : "any amount of"
          } `}</Text>
          <Skeleton as="span" isLoaded={!isLoading}>
            {isLoading ? "Loading..." : project.name}
          </Skeleton>
          <Text as="span">{` ticket(s) in Juicebox`}</Text>
        </>
      )}
    </RequirementCard>
  )
}

export default JuiceboxRequirementCard
