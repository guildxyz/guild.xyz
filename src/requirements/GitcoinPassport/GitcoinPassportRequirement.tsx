import DataBlock from "components/common/DataBlock"
import { RequirementComponentProps } from "requirements"
import Requirement from "requirements/common/Requirement"

const GitcoinPassportRequirement = ({
  requirement,
  ...rest
}: RequirementComponentProps): JSX.Element => (
  <Requirement image="/requirementLogos/gitcoin-passport.svg" {...rest}>
    {(() => {
      switch (requirement.type) {
        case "GITCOIN_STAMP":
          return (
            <>
              {"Have a Gitcoin Passport with the "}
              <DataBlock>{requirement.data?.stamp ?? "unknown"}</DataBlock>
              {" stamp"}
            </>
          )
        case "GITCOIN_SCORE":
          return (
            <>
              {"Have a Gitcoin Passport with "}
              <DataBlock>{requirement.data?.score ?? "unknown"}</DataBlock>
              {" score"}
            </>
          )
        default:
          return "Have a Gitcoin Passport"
      }
    })()}
  </Requirement>
)

export default GitcoinPassportRequirement
