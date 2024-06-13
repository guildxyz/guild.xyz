import {
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
} from "@chakra-ui/react"
import DataBlockWithDate from "components/[guild]/Requirements/components/DataBlockWithDate"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { RequirementButton } from "components/[guild]/Requirements/components/RequirementButton"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import DataBlock from "components/common/DataBlock"
import { CaretDown } from "phosphor-react"
import useSWRImmutable from "swr/immutable"
import pluralize from "utils/pluralize"
import SnapshotSpaceLink from "./components/SnapshotSpaceLink"
import StrategyParamsTable from "./components/StrategyParamsTable"
import { Proposal } from "./hooks/useProposals"

const SnapshotRequirement = (props: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext()

  // @ts-expect-error TODO: fix this error originating from strictNullChecks
  const strategies = requirement.data.strategies

  const { data: proposal } = useSWRImmutable<Proposal>(
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    requirement.data.proposal
      ? // @ts-expect-error TODO: fix this error originating from strictNullChecks
        `/v2/third-party/snapshot/proposals/${requirement.data.proposal}`
      : null
  )

  return (
    <Requirement
      image="/requirementLogos/snapshot.png"
      // @ts-expect-error TODO: fix this error originating from strictNullChecks
      footer={
        requirement.type === "SNAPSHOT_STRATEGY" &&
        // @ts-expect-error TODO: fix this error originating from strictNullChecks
        Object.keys(requirement.data.strategies[0].params ?? {}).length && (
          <Popover placement="bottom">
            <PopoverTrigger>
              <RequirementButton rightIcon={<Icon as={CaretDown} />}>
                View parameters
              </RequirementButton>
            </PopoverTrigger>

            <Portal>
              <PopoverContent>
                <PopoverArrow />
                <PopoverBody p={0}>
                  <StrategyParamsTable
                    // @ts-expect-error TODO: fix this error originating from strictNullChecks
                    params={requirement.data.strategies[0].params}
                  />
                </PopoverBody>
              </PopoverContent>
            </Portal>
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
                {"Satisfy the "}
                <DataBlock>{strategies[0].name}</DataBlock>
                {` Snapshot Strategy`}
                {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
                {requirement.data.space && (
                  <>
                    {` in the `}
                    <SnapshotSpaceLink requirement={requirement} />
                  </>
                )}
              </>
            )
          case "SNAPSHOT_SPACE_ADMIN":
            return (
              <>
                {`Be an admin of the `}
                <SnapshotSpaceLink requirement={requirement} />
              </>
            )
          case "SNAPSHOT_SPACE_AUTHOR":
            return (
              <>
                {`Be an author in the `}
                <SnapshotSpaceLink requirement={requirement} />
              </>
            )
          case "SNAPSHOT_FOLLOW":
          case "SNAPSHOT_FOLLOW_SINCE":
            return (
              <>
                {`Follow the `}
                <SnapshotSpaceLink requirement={requirement} />
                {requirement.type === "SNAPSHOT_FOLLOW_SINCE" && (
                  <>
                    {` since at least `}
                    {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
                    <DataBlockWithDate timestamp={requirement.data.since} />
                  </>
                )}
              </>
            )
          case "SNAPSHOT_USER_SINCE":
            return (
              <>
                {`Be a Snapshot user since at least `}
                {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
                <DataBlockWithDate timestamp={requirement.data.since} />
              </>
            )
          case "SNAPSHOT_VOTES":
            return (
              <>
                {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
                {`Vote ${pluralize(requirement.data.minAmount, "time")}`}
                {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
                {requirement.data.space && (
                  <>
                    {` in the `}
                    <SnapshotSpaceLink requirement={requirement} />
                  </>
                )}
                {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
                {requirement.data.proposal && (
                  <>
                    {` on proposal `}
                    <DataBlock>
                      {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
                      {proposal?.title ?? requirement.data.proposal}
                    </DataBlock>
                  </>
                )}
              </>
            )
          case "SNAPSHOT_PROPOSALS":
            return (
              <>
                {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
                {`Make at least ${requirement.data.minAmount}${
                  // @ts-expect-error TODO: fix this error originating from strictNullChecks
                  requirement.data.successfulOnly ? " successful" : ""
                  // @ts-expect-error TODO: fix this error originating from strictNullChecks
                } proposal${requirement.data.minAmount > 1 ? "s" : ""}`}
                {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
                {requirement.data.space && (
                  <>
                    {` in the `}
                    <SnapshotSpaceLink requirement={requirement} />
                  </>
                )}
                {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
                {requirement.data.state && (
                  <>
                    {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
                    {` that ${requirement.data.minAmount > 1 ? "are" : "is"} `}
                    {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
                    <DataBlock>{requirement.data.state}</DataBlock>
                  </>
                )}
              </>
            )
          case "SNAPSHOT_MAJORITY_VOTES":
            return `Vote with the majority at least ${// @ts-expect-error TODO: fix this error originating from strictNullChecks
            (requirement.data.minRatio * 100).toFixed(0)}% of the time`
        }
      })()}
    </Requirement>
  )
}

export default SnapshotRequirement
