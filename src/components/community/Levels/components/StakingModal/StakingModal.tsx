import {
  Center,
  CloseButton,
  Collapse,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react"
import { Error } from "components/common/Error"
import ModalButton from "components/common/ModalButton"
import { useCommunity } from "components/community/Context"
import useTokenAllowanceMachine from "components/community/hooks/useTokenAllowanceMachine"
import { ArrowCircleUp, Check, Info } from "phosphor-react"
import type { AccessRequirements } from "temporaryData/types"
import { processMetaMaskError } from "utils/processMetaMaskError"
import msToReadableFormat from "utils/msToReadableFormat"
import useStakingModalMachine from "./hooks/useStakingMachine"

type Props = {
  levelName: string
  accessRequirement: AccessRequirements
  isOpen: boolean
  onClose: () => void
}

const StakingModal = ({
  levelName,
  accessRequirement: { amount, timelockMs },
  isOpen,
  onClose,
}: Props): JSX.Element => {
  const {
    chainData: { token, stakeToken },
  } = useCommunity()
  const [allowanceState, allowanceSend] = useTokenAllowanceMachine(token)
  const [stakeState, stakeSend] = useStakingModalMachine(amount)

  const closeModal = () => {
    allowanceSend("CLOSE_MODAL")
    stakeSend("CLOSE_MODAL")
    onClose()
  }

  const startStaking = () => {
    allowanceSend("HIDE_NOTIFICATION")
    stakeSend("STAKE")
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {stakeState.value === "success"
            ? `Transaction submitted`
            : `Stake to join ${levelName}`}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {stakeState.value === "success" ? (
            <>
              <Center>
                <ArrowCircleUp
                  size="50%"
                  color="var(--chakra-colors-primary-500)"
                  weight="thin"
                />
              </Center>
              <Text fontWeight="medium" mt="8" mb="4">
                Avarage transaction time is 2 minutes. You’ll be notified when it
                succeeds.
              </Text>
              <Text textColor="gray">
                You’ll recieve {amount} {stakeToken.symbol} in return. Those mark
                your position, so don’t sell or send them because you will lose
                access to the community level and won’t be able to get your{" "}
                {token.symbol} tokens back.
              </Text>
            </>
          ) : (
            <>
              <Error
                error={stakeState.context.error || allowanceState.context.error}
                processError={processMetaMaskError}
              />
              <Text fontWeight="medium">
                Stake {amount} {token.symbol} to gain access to {levelName}. Your
                tokens will be locked for {msToReadableFormat(timelockMs)}, after
                that you can unstake them anytime. You can always stake more to
                upgrade to higher levels.
              </Text>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          {/* margin is applied on the approve button,
              so there's no unwanted space when it's not shown */}
          <VStack spacing="0" alignItems="strech">
            {(() => {
              switch (allowanceState.value) {
                case "noAllowance":
                case "error":
                  return (
                    <ModalButton
                      mb="3"
                      rightIcon={
                        <Tooltip
                          label={`You have to give the Agora smart contracts permission to use your ${token.symbol}. You only have to do this once per token.`}
                          placement="top"
                        >
                          <Icon as={Info} tabIndex={0} />
                        </Tooltip>
                      }
                      // so the button label will be positioned to the center
                      leftIcon={<span />}
                      justifyContent="space-between"
                      onClick={() => allowanceSend("ALLOW")}
                    >
                      {`Allow Agora to use ${token.symbol}`}
                    </ModalButton>
                  )
                case "waitingConfirmation":
                  return (
                    <ModalButton
                      mb="3"
                      isLoading
                      loadingText="Waiting confirmation"
                    />
                  )
                case "waitingForTransaction":
                  return (
                    <ModalButton
                      mb="3"
                      isLoading
                      loadingText="Waiting for transaction to succeed"
                    />
                  )
                case "successNotification":
                case "allowanceGranted":
                default:
                  return (
                    <Collapse
                      in={allowanceState.value === "successNotification"}
                      unmountOnExit
                    >
                      <ModalButton
                        as="div"
                        colorScheme="gray"
                        variant="solidStatic"
                        rightIcon={
                          <CloseButton
                            onClick={() => allowanceSend("HIDE_NOTIFICATION")}
                          />
                        }
                        leftIcon={<Check />}
                        justifyContent="space-between"
                        mb="3"
                      >
                        {`You can now stake ${token.symbol}`}
                      </ModalButton>
                    </Collapse>
                  )
              }
            })()}

            {["allowanceGranted", "successNotification"].includes(
              allowanceState.value
            ) ? (
              (() => {
                switch (stakeState.value) {
                  case "idle":
                  case "error":
                  default:
                    return (
                      <ModalButton onClick={startStaking}>Confirm stake</ModalButton>
                    )
                  case "waitingConfirmation":
                    return (
                      <ModalButton isLoading loadingText="Waiting confirmation" />
                    )
                  case "success":
                    return <ModalButton onClick={closeModal}>Close</ModalButton>
                }
              })()
            ) : (
              <ModalButton
                disabled
                colorScheme="gray"
                bg="gray.200"
                _hover={{ bg: "gray.200" }}
              >
                Confirm stake
              </ModalButton>
            )}
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default StakingModal
