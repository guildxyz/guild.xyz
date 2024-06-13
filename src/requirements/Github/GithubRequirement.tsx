import { Link } from "@chakra-ui/next-js"
import { Icon } from "@chakra-ui/react"
import ConnectRequirementPlatformButton from "components/[guild]/Requirements/components/ConnectRequirementPlatformButton"
import DataBlockWithDate from "components/[guild]/Requirements/components/DataBlockWithDate"
import DataBlockWithRelativeDate from "components/[guild]/Requirements/components/DataBlockWithRelativeDate"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import DataBlock from "components/common/DataBlock"
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
                  // @ts-expect-error TODO: fix this error originating from strictNullChecks
                  href={requirement.data.id ?? ""}
                  isExternal
                  colorScheme="blue"
                  fontWeight="medium"
                >
                  {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
                  {requirement.data.id.match(/https:\/\/github\.com\/(.+)$/i)[1]}
                </Link>
                {" repository"}
              </>
            )
          case "GITHUB_ACCOUNT_AGE":
            return (
              <>
                {"Have a GitHub account"}
                {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
                {requirement.data.maxAmount && requirement.data.minAmount ? (
                  <>
                    {" which was created between "}
                    {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
                    <DataBlockWithDate timestamp={requirement.data.minAmount} />
                    {" and "}
                    {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
                    <DataBlockWithDate timestamp={requirement.data.maxAmount} />
                  </>
                ) : // @ts-expect-error TODO: fix this error originating from strictNullChecks
                requirement.data.minAmount ? (
                  <>
                    {" which was created after "}
                    {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
                    <DataBlockWithDate timestamp={requirement.data.minAmount} />
                  </>
                ) : // @ts-expect-error TODO: fix this error originating from strictNullChecks
                requirement.data.maxAmount ? (
                  <>
                    {" which was created before "}
                    {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
                    <DataBlockWithDate timestamp={requirement.data.maxAmount} />
                  </>
                ) : null}
              </>
            )
          case "GITHUB_ACCOUNT_AGE_RELATIVE":
            return (
              <>
                {"Have a GitHub account "}
                {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
                {requirement.data.maxAmount && requirement.data.minAmount ? (
                  <>
                    {" which was created in the last "}
                    <DataBlockWithRelativeDate
                      // @ts-expect-error TODO: fix this error originating from strictNullChecks
                      timestamp={requirement.data.minAmount}
                    />
                    {" - "}
                    <DataBlockWithRelativeDate
                      // @ts-expect-error TODO: fix this error originating from strictNullChecks
                      timestamp={requirement.data.maxAmount}
                    />
                  </>
                ) : // @ts-expect-error TODO: fix this error originating from strictNullChecks
                requirement.data.minAmount ? (
                  <>
                    {"older than "}
                    <DataBlockWithRelativeDate
                      // @ts-expect-error TODO: fix this error originating from strictNullChecks
                      timestamp={requirement.data.minAmount}
                    />
                  </>
                ) : // @ts-expect-error TODO: fix this error originating from strictNullChecks
                requirement.data.maxAmount ? (
                  <>
                    {"no older than "}
                    <DataBlockWithRelativeDate
                      // @ts-expect-error TODO: fix this error originating from strictNullChecks
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
                {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
                <DataBlock>{pluralize(requirement.data.id, "commit")}</DataBlock>
                {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
                {requirement.data.maxAmount && requirement.data.minAmount ? (
                  <>
                    {" between "}
                    {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
                    <DataBlockWithDate timestamp={requirement.data.minAmount} />
                    {" and "}
                    {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
                    <DataBlockWithDate timestamp={requirement.data.maxAmount} />
                  </>
                ) : // @ts-expect-error TODO: fix this error originating from strictNullChecks
                requirement.data.minAmount ? (
                  <>
                    {" after "}
                    {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
                    <DataBlockWithDate timestamp={requirement.data.minAmount} />
                  </>
                ) : // @ts-expect-error TODO: fix this error originating from strictNullChecks
                requirement.data.maxAmount ? (
                  <>
                    {" before "}
                    {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
                    <DataBlockWithDate timestamp={requirement.data.maxAmount} />
                  </>
                ) : null}
              </>
            )
          case "GITHUB_COMMIT_COUNT_RELATIVE":
            return (
              <>
                {`Have at least `}
                {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
                <DataBlock>{pluralize(requirement.data.id, "commit")}</DataBlock>
                {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
                {requirement.data.maxAmount && requirement.data.minAmount ? (
                  <>
                    {" in the last "}
                    <DataBlockWithRelativeDate
                      // @ts-expect-error TODO: fix this error originating from strictNullChecks
                      timestamp={requirement.data.minAmount}
                    />
                    {" - "}
                    <DataBlockWithRelativeDate
                      // @ts-expect-error TODO: fix this error originating from strictNullChecks
                      timestamp={requirement.data.maxAmount}
                    />
                  </>
                ) : // @ts-expect-error TODO: fix this error originating from strictNullChecks
                requirement.data.minAmount ? (
                  <>
                    {" during the last "}
                    <DataBlockWithRelativeDate
                      // @ts-expect-error TODO: fix this error originating from strictNullChecks
                      timestamp={requirement.data.minAmount}
                    />
                  </>
                ) : // @ts-expect-error TODO: fix this error originating from strictNullChecks
                requirement.data.maxAmount ? (
                  <>
                    {" before the last "}
                    <DataBlockWithRelativeDate
                      // @ts-expect-error TODO: fix this error originating from strictNullChecks
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
