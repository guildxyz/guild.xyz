import {
  Center,
  Collapse,
  HStack,
  Icon,
  Stack,
  StackProps,
  Text,
  Tooltip,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import { ArrowRight, LockSimple } from "phosphor-react"
import { PropsWithChildren, ReactNode } from "react"
import { JoinState } from "../utils/mapAccessJobState"
import { JoinStatusStep } from "./JoinStep"

export const JOIN_LOADING_TESTS: Record<
  Exclude<JoinState["state"], "FINISHED">,
  [string, string]
> = {
  INITIAL: ["Preparing access check", null],
  PREPARING: [
    "Preparing access check",
    "There are a lot of users joining right now, so you have to wait a bit. There're POSITION users before you",
  ],
  CHECKING: [null, "Waiting for the next one, there're POSITION users before you"],
  MANAGING_ROLES: [
    "Evaluating which roles you have access to",
    "There are a lot of users joining right now, so you have to wait a bit. There're POSITION users before you",
  ],
  MANAGING_REWARDS: [
    "Evaluating which rewards you will get",
    "There are a lot of users joining right now, so you have to wait a bit. There're POSITION users before you",
  ],
}

const JoinStateCount = ({
  joinState,
  entity,
}: {
  joinState: JoinState
  entity: "role" | "reward" | "requirement"
}) => {
  if (!joinState) {
    return null
  }

  if (entity === "requirement" && joinState.requirements) {
    if (joinState.state === "CHECKING") {
      return (
        <Text>
          {joinState.requirements.checked}/{joinState.requirements.all} requirements
          checked
        </Text>
      )
    }

    return (
      <Text>
        {joinState.requirements.satisfied}/{joinState.requirements.all} requirements
        satisfied
      </Text>
    )
  }

  if (entity === "reward" && joinState.rewards) {
    return (
      <Text>
        {joinState.rewards.granted}/{joinState.rewards.all} rewards granted
      </Text>
    )
  }

  if (entity === "role" && joinState.roles) {
    return (
      <Text>
        {joinState.roles.granted}/{joinState.roles.all} roles granted
      </Text>
    )
  }

  return null
}

const progressTitle = {
  role: "Get roles",
  reward: "Get rewards",
  requirement: "Satisfy the requirements",
}

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
    <JoinStatusStep entity={entity} joinState={joinState} />

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

const SatisfyRequirementsJoinStep = ({
  isLoading,
  hasNoAccessResponse,
  onClose,
  joinState,
  ...stackProps
}: {
  joinState: JoinState
  onClose: () => void
  hasNoAccessResponse: boolean
  isLoading: boolean
} & StackProps) => {
  const { roles } = useGuild()

  const onClick = () => {
    onClose()
    window.location.hash = `role-${roles[0]?.id}`
  }

  return (
    <ProgressJoinStep
      entity="requirement"
      joinState={joinState}
      shouldShowSubtitle={
        joinState?.state === "PREPARING" ||
        joinState?.state === "CHECKING" ||
        joinState?.state === "INITIAL"
      }
      RightComponent={
        !hasNoAccessResponse &&
        joinState?.state !== "MANAGING_REWARDS" &&
        joinState?.state !== "MANAGING_ROLES" &&
        joinState?.state !== "FINISHED" ? (
          <Tooltip
            hasArrow
            label="Connect your accounts and check access below to see if you meet the requirements the guild owner has set"
          >
            <Center boxSize={5}>
              <Icon as={LockSimple} weight="bold" />
            </Center>
          </Tooltip>
        ) : null
      }
      {...stackProps}
    >
      <Collapse in={hasNoAccessResponse && !isLoading}>
        <Text pt="2">
          {`You're not eligible with your connected accounts. `}
          <Button
            variant="link"
            rightIcon={<ArrowRight />}
            onClick={onClick}
            iconSpacing={1.5}
          >
            See requirements
          </Button>
        </Text>
      </Collapse>
    </ProgressJoinStep>
  )
}

export { ProgressJoinStep }
export default SatisfyRequirementsJoinStep
