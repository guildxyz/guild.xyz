import { Skeleton, Text } from "@chakra-ui/react"
import { useJuiceboxProject } from "requirements/formComponents/JuiceboxForm/hooks/useJuicebox"
import { RequirementComponentProps } from "types"
import Requirement from "./common/Requirement"

const JuiceboxRequirement = ({
  requirement,
  ...rest
}: RequirementComponentProps) => {
  const { project, isLoading } = useJuiceboxProject(requirement?.data?.id)

  return (
    <Requirement
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
    </Requirement>
  )
}

export default JuiceboxRequirement
