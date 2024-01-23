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
import { JoinState } from "../utils/mapAccessJobState"
import { JoinStatusStep, JoinStepIndicator } from "./JoinStep"

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
    <HStack py="3" {...stackProps}>
      {hasNoAccessResponse ? (
        <JoinStepIndicator status="ERROR" />
      ) : (
        <JoinStatusStep entity="requirement" joinState={joinState} />
      )}

      <Stack w="full" spacing={0} mt="-1.5px !important">
        <Text fontWeight={"bold"}>Satisfy the requirements</Text>

        <JoinStateCount joinState={joinState} entity="requirement" />

        {(joinState?.state === "PREPARING" ||
          joinState?.state === "CHECKING" ||
          joinState?.state === "INITIAL") &&
          JOIN_LOADING_TESTS?.[joinState.state]?.[
            +(joinState.waitingPosition || false)
          ] && (
            <Text
              color={joinState.state === "CHECKING" ? "whiteAlpha.500" : undefined}
            >
              {
                JOIN_LOADING_TESTS[joinState.state][
                  +(joinState.waitingPosition ?? false)
                ]
              }
            </Text>
          )}

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
      </Stack>
      {!hasNoAccessResponse && (
        <Tooltip
          hasArrow
          label="Connect your accounts and check access below to see if you meet the requirements the guild owner has set"
        >
          <Center boxSize={5}>
            <Icon as={LockSimple} weight="bold" />
          </Center>
        </Tooltip>
      )}
    </HStack>
  )
}

export { JoinStateCount }
export default SatisfyRequirementsJoinStep
