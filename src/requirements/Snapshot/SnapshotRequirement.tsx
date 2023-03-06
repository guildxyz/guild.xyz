import {
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
} from "@chakra-ui/react"
import DataBlock from "components/[guild]/Requirements/components/DataBlock"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { RequirementButton } from "components/[guild]/Requirements/components/RequirementButton"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { ArrowSquareOut } from "phosphor-react"
import useSWRImmutable from "swr/immutable"
import pluralize from "utils/pluralize"
import SnapshotSpaceLink from "./components/SnapshotSpaceLink"
import StrategyParamsTable from "./components/StrategyParamsTable"
import { Proposal } from "./hooks/useProposals"

const SnapshotRequirement = (props: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext()

  const strategies = requirement.data.strategies

  const { data: proposal } = useSWRImmutable<Proposal>(
    requirement.data.proposal
      ? `/assets/snapshot/proposals/${requirement.data.proposal}`
      : null
  )

  const formattedDate = requirement.data.since
    ? new Date(requirement.data.since).toLocaleDateString()
    : null

  return (
    <Requirement
      image="/requirementLogos/snapshot.png"
      footer={
        requirement.type === "SNAPSHOT_STRATEGY" &&
        Object.keys(requirement.data.strategies[0].params ?? {}).length && (
          <Popover placement="bottom">
            <PopoverTrigger>
              <RequirementButton rightIcon={<Icon as={ArrowSquareOut} />}>
                View parameters
              </RequirementButton>
            </PopoverTrigger>

            <Portal>
              <PopoverContent>
                <PopoverArrow />
                <PopoverBody p={0}>
                  <StrategyParamsTable
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
                    <DataBlock>{formattedDate}</DataBlock>
                  </>
                )}
              </>
            )
          case "SNAPSHOT_USER_SINCE":
            return (
              <>
                {`Be a Snapshot user since at least `}
                <DataBlock>{formattedDate}</DataBlock>
              </>
            )
          case "SNAPSHOT_VOTES":
            return (
              <>
                {`Vote ${pluralize(requirement.data.minAmount, "time")}`}
                {requirement.data.space && (
                  <>
                    {` in the `}
                    <SnapshotSpaceLink requirement={requirement} />
                  </>
                )}
                {requirement.data.proposal && (
                  <>
                    {` on proposal `}
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
                {`Make at least ${requirement.data.minAmount}${
                  requirement.data.successfulOnly ? " successful" : ""
                } proposal${requirement.data.minAmount > 1 ? "s" : ""}`}
                {requirement.data.space && (
                  <>
                    {` in the `}
                    <SnapshotSpaceLink requirement={requirement} />
                  </>
                )}
                {requirement.data.state && (
                  <>
                    {` that ${requirement.data.minAmount > 1 ? "are" : "is"} `}
                    <DataBlock>{requirement.data.state}</DataBlock>
                  </>
                )}
              </>
            )
          case "SNAPSHOT_MAJORITY_VOTES":
            return `Vote with the majority at least ${(
              requirement.data.minRatio * 100
            ).toFixed(0)}% of the time`
        }
      })()}
    </Requirement>
  )
}

export default SnapshotRequirement
