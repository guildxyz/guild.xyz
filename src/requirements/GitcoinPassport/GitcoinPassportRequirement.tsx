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
                <DataBlock>{requirement.data.stamp}</DataBlock>
                {" stamp"}
              </>
            )
          case "GITCOIN_SCORE":
            return (
              <>
                {"Have a Gitcoin Passport with "}
                <DataBlock>{requirement.data.score}</DataBlock>
                {" score in the "}
                <DataBlock>{`#${requirement.data.id}`}</DataBlock>
                {" community"}
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
