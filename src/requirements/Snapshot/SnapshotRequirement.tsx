import { Collapse, Icon, Link, Stack, Text, useDisclosure } from "@chakra-ui/react"
import DataBlock from "components/common/DataBlock"
import { CaretDown } from "phosphor-react"
import { Fragment } from "react"
import { RequirementComponentProps } from "requirements"
import pluralize from "utils/pluralize"
import Requirement from "../common/Requirement"
import { RequirementButton } from "../common/RequirementButton"
import StrategyParamsTable from "./components/StrategyParamsTable"
import useProposal from "./hooks/useProposal"
import useSpace from "./hooks/useSpace"

const SnapshotRequirement = ({
  requirement,
  ...rest
}: RequirementComponentProps): JSX.Element => {
  const { isOpen, onToggle } = useDisclosure()
  const strategies = requirement.data.strategies

  const { space } = useSpace(requirement.data.space)
  const { proposal } = useProposal(requirement.data.proposal)

  const formattedDate = requirement.data.since
    ? new Date(requirement.data.since).toLocaleDateString()
    : null

  return (
    <Requirement
      image="/requirementLogos/snapshot.png"
      footer={
        requirement.type === "SNAPSHOT_STRATEGY" && (
          <>
            <RequirementButton
              rightIcon={
                <Icon
                  as={CaretDown}
                  transform={isOpen && "rotate(-180deg)"}
                  transition="transform .3s"
                />
              }
              onClick={onToggle}
            >
              View parameters
            </RequirementButton>
            <Collapse style={{ marginTop: 0 }} in={isOpen}>
              {requirement.data.strategies.map((strategy, i) => (
                <Stack pt={2} pr={6} key={i}>
                  <Text as="span" fontWeight="bold" fontSize="sm">
                    {strategy.name}
                  </Text>
                  {!Object.keys(strategy.params ?? {}).length ? (
                    <Text
                      position="relative"
                      top={-2}
                      as="span"
                      fontSize="sm"
                      color="gray"
                    >
                      No parameters
                    </Text>
                  ) : (
                    <StrategyParamsTable params={strategy.params} />
                  )}
                </Stack>
              ))}
            </Collapse>
          </>
        )
      }
      {...rest}
    >
      {(() => {
        switch (requirement.type) {
          case "SNAPSHOT_STRATEGY":
            return (
              <>
                {"Satisfy the "}
                {strategies.map((s, i) => (
                  <Fragment key={i}>
                    <DataBlock>{s.name}</DataBlock>
                    {i < strategies.length - 1 && ", "}
                  </Fragment>
                ))}
                {` Snapshot ${strategies.length > 1 ? "Strategies" : "Strategy"}`}
                {requirement.data.space &&
                  ` in the ${space?.name ?? requirement.data.space} space`}
              </>
            )
          case "SNAPSHOT_SPACE_ADMIN":
            return (
              <>
                {`Be an admin of the `}
                <Link
                  href={`https://snapshot.org/#/${requirement.data.space}`}
                  isExternal
                  colorScheme="orange"
                  fontWeight="medium"
                >
                  {space?.name ?? requirement.data.space}
                </Link>
                {` space`}
              </>
            )
          case "SNAPSHOT_SPACE_AUTHOR":
            return (
              <>
                {`Be an author in the `}
                <Link
                  href={`https://snapshot.org/#/${requirement.data.space}`}
                  isExternal
                  colorScheme="orange"
                  fontWeight="medium"
                >
                  {space?.name ?? requirement.data.space}
                </Link>
                {` space`}
              </>
            )
          case "SNAPSHOT_FOLLOW":
          case "SNAPSHOT_FOLLOW_SINCE":
            return (
              <>
                {`Follow the `}
                <Link
                  href={`https://snapshot.org/#/${requirement.data.space}`}
                  isExternal
                  colorScheme="orange"
                  fontWeight="medium"
                >
                  {space?.name ?? requirement.data.space}
                </Link>
                {` space`}
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
                {`Vote ${pluralize(requirement.data.minTimes, "time")}`}
                {requirement.data.space && (
                  <>
                    {` in the `}
                    <Link
                      href={`https://snapshot.org/#/${requirement.data.space}`}
                      isExternal
                      colorScheme="orange"
                      fontWeight="medium"
                    >
                      {space?.name ?? requirement.data.space}
                    </Link>
                    {` space`}
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
                    <Link
                      href={`https://snapshot.org/#/${requirement.data.space}`}
                      isExternal
                      colorScheme="orange"
                      fontWeight="medium"
                    >
                      {space?.name ?? requirement.data.space}
                    </Link>
                    {` space`}
                  </>
                )}
                {requirement.data.state && (
                  <>
                    {` that are `}
                    <DataBlock>{requirement.data.state}</DataBlock>
                  </>
                )}
              </>
            )
          case "SNAPSHOT_MAJORITY_VOTES":
            return `Vote with majority in the rate of ${(
              requirement.data.minRatio * 100
            ).toFixed(0)}%`
        }
      })()}
    </Requirement>
  )
}

export default SnapshotRequirement
