import { Center, Collapse, Icon, StackProps, Text, Tooltip } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import { ArrowRight, LockSimple } from "phosphor-react"
import { JoinState } from "../utils/mapAccessJobState"
import ProgressJoinStep from "./ProgressJoinStep"

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
      hideCount={hasNoAccessResponse && !isLoading}
      joinState={
        isLoading && joinState?.state === "NO_ACCESS"
          ? { state: "INITIAL" }
          : joinState || (isLoading ? { state: "INITIAL" } : undefined)
      }
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
            <Center w={5} h={joinState ? 12 : 6}>
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
