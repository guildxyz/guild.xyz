import { Skeleton } from "@chakra-ui/react"
import { Requirement } from "types"
import RequirementCard from "../common/RequirementCard"
import useJuiceboxProject from "./hooks/useJuiceboxProject"

type Props = {
  requirement: Requirement
}

const JuiceboxRequirementCard = ({ requirement }: Props) => {
  const { project, isLoading } = useJuiceboxProject(requirement?.data?.id)

  return (
    <RequirementCard
      requirement={requirement}
      image={isLoading ? "" : project?.logoUri}
      loading={isLoading}
    >
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
    </RequirementCard>
  )
}

export default JuiceboxRequirementCard
