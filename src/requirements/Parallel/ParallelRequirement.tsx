import DataBlock from "components/[guild]/Requirements/components/DataBlock"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"

const ParallelRequirement = (props: RequirementProps) => {
  const requirement = useRequirementContext()

  return (
    <Requirement
      isNegated={requirement.isNegated}
      image={"requirementLogos/parallel.png"}
      {...props}
    >
      {(() => {
        switch (requirement.type) {
          case "PARALLEL_ID":
            return <>{`Have a Parallel ID`}</>
          case "PARALLEL_SANCTIONS_SAFE":
            return (
              <>
                {`Be sanctions safe `}
                {requirement.data.countryId ? (
                  <>
                    {` in country: `}
                    <DataBlock>{requirement.data.countryId}</DataBlock>
                  </>
                ) : (
                  "worldwide"
                )}
              </>
            )
          case "PARALLEL_TRAIT":
            return `Be accredited on Parallel`
        }
      })()}
    </Requirement>
  )
}

export default ParallelRequirement
