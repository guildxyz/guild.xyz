import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from "@/components/ui/Popover"
import { CaretDown } from "@phosphor-icons/react/dist/ssr"
import { DataBlockWithDate } from "components/[guild]/Requirements/components/DataBlockWithDate"
import {
  Requirement,
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { RequirementButton } from "components/[guild]/Requirements/components/RequirementButton"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { DataBlock } from "components/common/DataBlock"
import useSWRImmutable from "swr/immutable"
import pluralize from "utils/pluralize"
import { SnapshotSpaceLink } from "./components/SnapshotSpaceLink"
import { StrategyParamsTable } from "./components/StrategyParamsTable"
import { Proposal } from "./types"

const SnapshotRequirement = (props: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext()

  const strategies = requirement.data.strategies

  const { data: proposal } = useSWRImmutable<Proposal>(
    requirement.data.proposal
      ? `/v2/third-party/snapshot/proposals/${requirement.data.proposal}`
      : null
  )

  return (
    <Requirement
      image="/requirementLogos/snapshot.png"
      footer={
        requirement.type === "SNAPSHOT_STRATEGY" &&
        Object.keys(requirement.data.strategies[0].params ?? {}).length && (
          <Popover>
            <PopoverTrigger asChild>
              <RequirementButton rightIcon={<CaretDown weight="bold" />}>
                View parameters
              </RequirementButton>
            </PopoverTrigger>

            <PopoverPortal>
              <PopoverContent side="bottom" className="p-0">
                <StrategyParamsTable
                  params={requirement.data.strategies[0].params}
                />
              </PopoverContent>
            </PopoverPortal>
          </Popover>
        )
      }
      {...props}
    >
      {(() => {
        switch (requirement.type) {
          case "SNAPSHOT_STRATEGY":
            return (
              <>
                <span>{"Satisfy the "}</span>
                <DataBlock>{strategies[0].name}</DataBlock>
                {` Snapshot Strategy`}
                {requirement.data.space && (
                  <>
                    <span>{" in the "}</span>
                    <SnapshotSpaceLink requirement={requirement} />
                  </>
                )}
              </>
            )
          case "SNAPSHOT_SPACE_ADMIN":
            return (
              <>
                <span>{"Be an admin of the "}</span>
                <SnapshotSpaceLink requirement={requirement} />
              </>
            )
          case "SNAPSHOT_SPACE_AUTHOR":
            return (
              <>
                <span>{"Be an author in the "}</span>
                <SnapshotSpaceLink requirement={requirement} />
              </>
            )
          case "SNAPSHOT_FOLLOW":
          case "SNAPSHOT_FOLLOW_SINCE":
            return (
              <>
                <span>{"Follow the "}</span>
                <SnapshotSpaceLink requirement={requirement} />
                {requirement.type === "SNAPSHOT_FOLLOW_SINCE" && (
                  <>
                    <span>{" since at least "}</span>
                    <DataBlockWithDate timestamp={requirement.data.since} />
                  </>
                )}
              </>
            )
          case "SNAPSHOT_USER_SINCE":
            return (
              <>
                <span>{"Be a Snapshot user since at least "}</span>
                <DataBlockWithDate timestamp={requirement.data.since} />
              </>
            )
          case "SNAPSHOT_VOTES":
            return (
              <>
                <span>{`Vote ${pluralize(requirement.data.minAmount, "time")}`}</span>
                {requirement.data.space && (
                  <>
                    <span>{" in the "}</span>
                    <SnapshotSpaceLink requirement={requirement} />
                  </>
                )}
                {requirement.data.proposal && (
                  <>
                    <span>{" on proposal "}</span>
                    <DataBlock>
                      {proposal?.title ?? requirement.data.proposal}
                    </DataBlock>
                  </>
                )}
              </>
            )
          case "SNAPSHOT_PROPOSALS":
            return (
              <>
                <span>{`Make at least ${requirement.data.minAmount}${
                  requirement.data.successfulOnly ? " successful" : ""
                } proposal${requirement.data.minAmount > 1 ? "s" : ""}`}</span>
                {requirement.data.space && (
                  <>
                    <span>{" in the "}</span>
                    <SnapshotSpaceLink requirement={requirement} />
                  </>
                )}
                {requirement.data.state && (
                  <>
                    <span>{` that ${requirement.data.minAmount > 1 ? "are" : "is"} `}</span>
                    <DataBlock>{requirement.data.state}</DataBlock>
                  </>
                )}
              </>
            )
          case "SNAPSHOT_MAJORITY_VOTES":
            return `Vote with the majority at least ${(requirement.data.minRatio * 100).toFixed(0)}% of the time`
        }
      })()}
    </Requirement>
  )
}

export default SnapshotRequirement
