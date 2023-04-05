import { Icon } from "@chakra-ui/react"
import ConnectRequirementPlatformButton from "components/[guild]/Requirements/components/ConnectRequirementPlatformButton"
import DataBlock from "components/[guild]/Requirements/components/DataBlock"
import DataBlockWithDate from "components/[guild]/Requirements/components/DataBlockWithDate"
import DataBlockWithRelativeDate from "components/[guild]/Requirements/components/DataBlockWithRelativeDate"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import Link from "components/common/Link"
import { GithubLogo } from "phosphor-react"

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
                Give a star to the{" "}
                <Link
                  href={requirement.data.id ?? ""}
                  isExternal
                  colorScheme="blue"
                  fontWeight="medium"
                >
                  {requirement.data.id.match(/https:\/\/github\.com\/(.+)$/i)[1]}
                </Link>{" "}
                repository
              </>
            )
          case "GITHUB_ACCOUNT_AGE":
            return (
              <>
                {" Github account was created "}
                {requirement.data.maxAmount && requirement.data.minAmount ? (
                  <>
                    {" between "}
                    <DataBlockWithDate timestamp={requirement.data.minAmount} />
                    {" and "}
                    <DataBlockWithDate timestamp={requirement.data.maxAmount} />
                  </>
                ) : requirement.data.minAmount ? (
                  <>
                    {"since at least "}
                    <DataBlockWithDate timestamp={requirement.data.minAmount} />
                  </>
                ) : requirement.data.maxAmount ? (
                  <>
                    {"before "}
                    <DataBlockWithDate timestamp={requirement.data.maxAmount} />
                  </>
                ) : null}
              </>
            )
          case "GITHUB_ACCOUNT_AGE_RELATIVE":
            return (
              <>
                {" Github account was created "}
                {requirement.data.maxAmount && requirement.data.minAmount ? (
                  <>
                    {" between "}
                    <DataBlockWithRelativeDate
                      timestamp={requirement.data.minAmount}
                    />
                    {" and "}
                    <DataBlockWithRelativeDate
                      timestamp={requirement.data.maxAmount}
                    />
                  </>
                ) : requirement.data.minAmount ? (
                  <>
                    {"at least "}
                    <DataBlockWithRelativeDate
                      timestamp={requirement.data.minAmount}
                    />
                  </>
                ) : requirement.data.maxAmount ? (
                  <>
                    {"later than "}
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
                {" Github account was created "}
                {requirement.data.maxAmount && requirement.data.minAmount ? (
                  <>
                    {" between "}
                    <DataBlockWithDate timestamp={requirement.data.minAmount} />
                    {" and "}
                    <DataBlockWithDate timestamp={requirement.data.maxAmount} />
                  </>
                ) : requirement.data.minAmount ? (
                  <>
                    {"since at least "}
                    <DataBlockWithRelativeDate
                      timestamp={requirement.data.minAmount}
                    />
                  </>
                ) : requirement.data.maxAmount ? (
                  <>
                    <DataBlockWithDate timestamp={requirement.data.maxAmount} />
                  </>
                ) : null}
                {" and"} it has{" "}
                <DataBlock>
                  {requirement.data.id} commit{requirement.data.id > 1 ? "s" : ""}
                </DataBlock>
              </>
            )
          case "GITHUB_COMMIT_COUNT_RELATIVE":
            return (
              <>
                {" Github account was created "}
                {requirement.data.maxAmount && requirement.data.minAmount ? (
                  <>
                    {" between "}
                    <DataBlockWithRelativeDate
                      timestamp={requirement.data.minAmount}
                    />
                    {" and "}
                    <DataBlockWithRelativeDate
                      timestamp={requirement.data.maxAmount}
                    />
                  </>
                ) : requirement.data.minAmount ? (
                  <>
                    {"at least "}
                    <DataBlockWithRelativeDate
                      timestamp={requirement.data.minAmount}
                    />
                  </>
                ) : requirement.data.maxAmount ? (
                  <>
                    {"after "}
                    <DataBlockWithRelativeDate
                      timestamp={requirement.data.maxAmount}
                    />
                  </>
                ) : null}
                {" and"} it has{" "}
                <DataBlock>
                  {requirement.data.id} commit{requirement.data.id > 1 ? "s" : ""}
                </DataBlock>
              </>
            )
        }
      })()}
    </Requirement>
  )
}

export default GithubRequirement
