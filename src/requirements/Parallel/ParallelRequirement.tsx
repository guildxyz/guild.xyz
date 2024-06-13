import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import DataBlock from "components/common/DataBlock"

const ParallelRequirement = (props: RequirementProps) => {
  const requirement = useRequirementContext()

  return (
    <Requirement image="/requirementLogos/parallel.png" {...props}>
      {(() => {
        switch (requirement.type) {
          case "PARALLEL_ID":
            return <>{`Have a Parallel ID`}</>
          case "PARALLEL_SANCTIONS_SAFE":
            return (
              <>
                {`Be sanctions safe `}
                {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
                {requirement.data.countryId ? (
                  <>
                    {` in country: `}
                    {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
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
