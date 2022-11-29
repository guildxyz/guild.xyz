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
          return "TODO - Gitcoin Stamp"
        case "GITCOIN_SCORE":
          return "TODO - Gitcoin Score"
        default:
          return "Have a Gitcoin Passport"
      }
    })()}
  </Requirement>
)

export default GitcoinPassportRequirement
