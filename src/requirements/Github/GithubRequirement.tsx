import { Icon } from "@chakra-ui/react"
import Link from "components/common/Link"
import ConnectRequirementPlatformButton from "components/[guild]/Requirements/components/ConnectRequirementPlatformButton"
import DataBlock from "components/[guild]/Requirements/components/DataBlock"
import DataBlockWithDate from "components/[guild]/Requirements/components/DataBlockWithDate"
import DataBlockWithRelativeDate from "components/[guild]/Requirements/components/DataBlockWithRelativeDate"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { GithubLogo } from "phosphor-react"
import pluralize from "utils/pluralize"

const GithubRequirement = (props: RequirementProps) => {
  const requirement = useRequirementContext()

  return (
    <Requirement
      image={<Icon as={GithubLogo} boxSize={6} />}
      footer={<ConnectRequirementPlatformButton />}
      {...props}
    >
      {(() => {
        switch (requirement.type) {
          case "GITHUB_STARRING":
            return (
              <>
                {"Give a star to the "}
                <Link
                  href={requirement.data.id ?? ""}
                  isExternal
                  colorScheme="blue"
                  fontWeight="medium"
                >
                  {requirement.data.id.match(/https:\/\/github\.com\/(.+)$/i)[1]}
                </Link>
                {" repository"}
              </>
            )
          case "GITHUB_ACCOUNT_AGE":
            return (
              <>
                {"Have a GitHub account"}
                {requirement.data.maxAmount && requirement.data.minAmount ? (
                  <>
                    {" which was created between "}
                    <DataBlockWithDate timestamp={requirement.data.minAmount} />
                    {" and "}
                    <DataBlockWithDate timestamp={requirement.data.maxAmount} />
                  </>
                ) : requirement.data.minAmount ? (
                  <>
                    {" which was created after "}
                    <DataBlockWithDate timestamp={requirement.data.minAmount} />
                  </>
                ) : requirement.data.maxAmount ? (
                  <>
                    {" which was created before "}
                    <DataBlockWithDate timestamp={requirement.data.maxAmount} />
                  </>
                ) : null}
              </>
            )
          case "GITHUB_ACCOUNT_AGE_RELATIVE":
            return (
              <>
                {"Have a GitHub account "}
                {requirement.data.maxAmount && requirement.data.minAmount ? (
                  <>
                    {" which was created in the last "}
                    <DataBlockWithRelativeDate
                      timestamp={requirement.data.minAmount}
                    />
                    {" - "}
                    <DataBlockWithRelativeDate
                      timestamp={requirement.data.maxAmount}
                    />
                  </>
                ) : requirement.data.minAmount ? (
                  <>
                    {"older than "}
                    <DataBlockWithRelativeDate
                      timestamp={requirement.data.minAmount}
                    />
                  </>
                ) : requirement.data.maxAmount ? (
                  <>
                    {"no older than "}
                    <DataBlockWithRelativeDate
                      timestamp={requirement.data.maxAmount}
                    />
                  </>
                ) : null}
              </>
            )
          case "GITHUB_COMMIT_COUNT":
            return (
              <>
                {`Have at least `}
                <DataBlock>{pluralize(requirement.data.id, "commit")}</DataBlock>
                {requirement.data.maxAmount && requirement.data.minAmount ? (
                  <>
                    {" between "}
                    <DataBlockWithDate timestamp={requirement.data.minAmount} />
                    {" and "}
                    <DataBlockWithDate timestamp={requirement.data.maxAmount} />
                  </>
                ) : requirement.data.minAmount ? (
                  <>
                    {" after "}
                    <DataBlockWithDate timestamp={requirement.data.minAmount} />
                  </>
                ) : requirement.data.maxAmount ? (
                  <>
                    {" before "}
                    <DataBlockWithDate timestamp={requirement.data.maxAmount} />
                  </>
                ) : null}
              </>
            )
          case "GITHUB_COMMIT_COUNT_RELATIVE":
            return (
              <>
                {`Have at least `}
                <DataBlock>{pluralize(requirement.data.id, "commit")}</DataBlock>
                {requirement.data.maxAmount && requirement.data.minAmount ? (
                  <>
                    {" in the last "}
                    <DataBlockWithRelativeDate
                      timestamp={requirement.data.minAmount}
                    />
                    {" - "}
                    <DataBlockWithRelativeDate
                      timestamp={requirement.data.maxAmount}
                    />
                  </>
                ) : requirement.data.minAmount ? (
                  <>
                    {" during the last "}
                    <DataBlockWithRelativeDate
                      timestamp={requirement.data.minAmount}
                    />
                  </>
                ) : requirement.data.maxAmount ? (
                  <>
                    {" before the last "}
                    <DataBlockWithRelativeDate
                      timestamp={requirement.data.maxAmount}
                    />
                  </>
                ) : null}
              </>
            )
        }
      })()}
    </Requirement>
  )
}

export default GithubRequirement
