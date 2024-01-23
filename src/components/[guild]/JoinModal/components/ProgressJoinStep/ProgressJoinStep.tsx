import { HStack, Stack, StackProps, Text } from "@chakra-ui/react"
import { PropsWithChildren, ReactNode } from "react"
import { JoinState } from "../../utils/mapAccessJobState"
import JoinStateCount from "./components/JoinStateCount"
import JoinStatusStepIndicator from "./components/JoinStatusStepIndicator"
import { JOIN_LOADING_TESTS, progressTitle } from "./static"

const ProgressJoinStep = ({
  joinState,
  entity,
  shouldShowSubtitle,
  children,
  RightComponent,
  ...stackProps
}: PropsWithChildren<{
  joinState: JoinState
  entity: "role" | "reward" | "requirement"
  shouldShowSubtitle: boolean
  RightComponent?: ReactNode
}> &
  StackProps) => (
  <HStack py="3" {...stackProps}>
    <JoinStatusStepIndicator entity={entity} joinState={joinState} />

    <Stack w="full" spacing={0} mt="-1.5px !important">
      <Text fontWeight={"bold"}>{progressTitle[entity]}</Text>

      <JoinStateCount joinState={joinState} entity={entity} />

      {shouldShowSubtitle &&
        JOIN_LOADING_TESTS[joinState?.state]?.[+!!joinState?.waitingPosition] && (
          <Text>
            {JOIN_LOADING_TESTS[joinState?.state][+!!joinState?.waitingPosition]}
          </Text>
        )}

      {children}
    </Stack>
    {RightComponent}
  </HStack>
)

export default ProgressJoinStep
