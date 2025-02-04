import { Anchor } from "@/components/ui/Anchor"
import { GithubLogo } from "@phosphor-icons/react/dist/ssr"
import ConnectRequirementPlatformButton from "components/[guild]/Requirements/components/ConnectRequirementPlatformButton"
import { DataBlockWithDate } from "components/[guild]/Requirements/components/DataBlockWithDate"
import { DataBlockWithRelativeDate } from "components/[guild]/Requirements/components/DataBlockWithRelativeDate"
import {
  Requirement,
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { DataBlock } from "components/common/DataBlock"
import { RequirementType } from "requirements/types"
import pluralize from "utils/pluralize"

const GithubRequirement = (props: RequirementProps) => {
  const requirement =
    useRequirementContext<Extract<RequirementType, `GITHUB_${string}`>>()

  return (
    <Requirement
      image={<GithubLogo weight="bold" className="size-6" />}
      footer={<ConnectRequirementPlatformButton />}
      {...props}
    >
      {(() => {
        switch (requirement.type) {
          case "GITHUB_STARRING":
            return (
              <>
                <span>{"Give a star to the "}</span>
                <Anchor
                  href={requirement.data.id ?? ""}
                  target="_blank"
                  showExternal
                  variant="highlighted"
                >
                  {requirement.data.id.match(/https:\/\/github\.com\/(.+)$/i)?.[1] ??
                    "unknown"}
                </Anchor>
                <span>{" repository"}</span>
              </>
            )
          case "GITHUB_ACCOUNT_AGE":
            return (
              <>
                <span>{"Have a GitHub account"}</span>
                {requirement.data.maxAmount && requirement.data.minAmount ? (
                  <>
                    <span>{" which was created between "}</span>
                    <DataBlockWithDate timestamp={requirement.data.minAmount} />
                    <span>{" and "}</span>
                    <DataBlockWithDate timestamp={requirement.data.maxAmount} />
                  </>
                ) : requirement.data.minAmount ? (
                  <>
                    <span>{" which was created after "}</span>
                    <DataBlockWithDate timestamp={requirement.data.minAmount} />
                  </>
                ) : requirement.data.maxAmount ? (
                  <>
                    <span>{" which was created before "}</span>
                    <DataBlockWithDate timestamp={requirement.data.maxAmount} />
                  </>
                ) : null}
              </>
            )
          case "GITHUB_ACCOUNT_AGE_RELATIVE":
            return (
              <>
                <span>{"Have a GitHub account"}</span>
                {requirement.data.maxAmount && requirement.data.minAmount ? (
                  <>
                    <span>{" which was created in the last "}</span>
                    <DataBlockWithRelativeDate
                      timestamp={requirement.data.minAmount}
                    />
                    <span>{" - "}</span>
                    <DataBlockWithRelativeDate
                      timestamp={requirement.data.maxAmount}
                    />
                  </>
                ) : requirement.data.minAmount ? (
                  <>
                    <span>{" older than "}</span>
                    <DataBlockWithRelativeDate
                      timestamp={requirement.data.minAmount}
                    />
                  </>
                ) : requirement.data.maxAmount ? (
                  <>
                    <span>{" no older than "}</span>
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
                <span>{"Have at least "}</span>
                <DataBlock>{pluralize(requirement.data.id, "commit")}</DataBlock>
                {requirement.data.maxAmount && requirement.data.minAmount ? (
                  <>
                    <span>{" between "}</span>
                    <DataBlockWithDate timestamp={requirement.data.minAmount} />
                    <span>{" and "}</span>
                    <DataBlockWithDate timestamp={requirement.data.maxAmount} />
                  </>
                ) : requirement.data.minAmount ? (
                  <>
                    <span>{" after "}</span>
                    <DataBlockWithDate timestamp={requirement.data.minAmount} />
                  </>
                ) : requirement.data.maxAmount ? (
                  <>
                    <span>{" before "}</span>
                    <DataBlockWithDate timestamp={requirement.data.maxAmount} />
                  </>
                ) : null}
              </>
            )
          case "GITHUB_COMMIT_COUNT_RELATIVE":
            return (
              <>
                <span>{"Have at least "}</span>
                <DataBlock>{pluralize(requirement.data.id, "commit")}</DataBlock>
                {requirement.data.maxAmount && requirement.data.minAmount ? (
                  <>
                    <span>{" in the last "}</span>
                    <DataBlockWithRelativeDate
                      timestamp={requirement.data.minAmount}
                    />
                    <span>{" - "}</span>
                    <DataBlockWithRelativeDate
                      timestamp={requirement.data.maxAmount}
                    />
                  </>
                ) : requirement.data.minAmount ? (
                  <>
                    <span>{" during the last "}</span>
                    <DataBlockWithRelativeDate
                      timestamp={requirement.data.minAmount}
                    />
                  </>
                ) : requirement.data.maxAmount ? (
                  <>
                    <span>{" before the last "}</span>
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
