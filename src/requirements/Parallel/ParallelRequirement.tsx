import DataBlock from "components/common/DataBlock"
import { RequirementComponentProps } from "requirements"
import Requirement from "../common/Requirement"

const ParallelRequirement = ({
  requirement,
  ...rest
}: RequirementComponentProps) => (
  <Requirement
    isNegated={requirement.isNegated}
    image={"requirementLogos/parallel.png"}
    {...rest}
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

export default ParallelRequirement
