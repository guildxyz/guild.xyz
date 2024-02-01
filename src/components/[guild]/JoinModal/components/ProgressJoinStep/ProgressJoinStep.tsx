import { Center, HStack, Stack, StackProps, Text } from "@chakra-ui/react"
import { PropsWithChildren, ReactNode } from "react"
import { JoinState } from "../../utils/mapAccessJobState"
import JoinStateCount from "./components/JoinStateCount"
import JoinStatusStepIndicator from "./components/JoinStatusStepIndicator"
import { JOIN_LOADING_TEXTS, progressTitle } from "./static"

const ProgressJoinStep = ({
  joinState,
  entity,
  shouldShowSubtitle,
  children,
  RightComponent,
  hideCount,
  ...stackProps
}: PropsWithChildren<{
  joinState: JoinState
  entity: "role" | "reward" | "requirement"
  shouldShowSubtitle: boolean
  RightComponent?: ReactNode
  hideCount?: boolean
}> &
  StackProps) => (
  <HStack py="2.5" alignItems={"flex-start"} spacing={2.5} {...stackProps}>
    <Center h={joinState?.[`${entity}s`] || shouldShowSubtitle ? 12 : 6}>
      <JoinStatusStepIndicator entity={entity} joinState={joinState} />
    </Center>

    <Stack w="full" spacing={0}>
      <Text fontWeight={"bold"}>{progressTitle[entity]}</Text>

      {!hideCount && <JoinStateCount joinState={joinState} entity={entity} />}

      {shouldShowSubtitle &&
        JOIN_LOADING_TEXTS[joinState?.state]?.[+!!joinState?.waitingPosition] && (
          <Text colorScheme={"gray"}>
            {JOIN_LOADING_TEXTS[joinState?.state][
              +!!joinState?.waitingPosition
            ].replace("POSITION", joinState?.waitingPosition)}
          </Text>
        )}

      {children}
    </Stack>
    {RightComponent}
  </HStack>
)

export default ProgressJoinStep
