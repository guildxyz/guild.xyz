import DataBlock from "components/[guild]/Requirements/components/DataBlock"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"

const GitcoinPassportRequirement = ({ ...rest }: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext()

  return (
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
}

export default GitcoinPassportRequirement
