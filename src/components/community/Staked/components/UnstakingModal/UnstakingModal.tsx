import {
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
import TransactionSubmitted from "components/common/TransactionSubmitted"
import { useCommunity } from "components/community/Context"
import useTokenAllowanceMachine from "components/community/hooks/useTokenAllowanceMachine"
import { Check, Info } from "phosphor-react"
import useUnstakingModalMachine from "./hooks/useUnstakingMachine"
import processUnstakingError from "./utils/processUnstakingError"

type Props = {
  isOpen: boolean
  onClose: () => void
}

const UnstakingModal = ({ isOpen, onClose }: Props): JSX.Element => {
  const {
    chainData: { stakeToken },
  } = useCommunity()
  const tokenSymbol = stakeToken.symbol
  const [allowanceState, allowanceSend] = useTokenAllowanceMachine(stakeToken)
  const [unstakeState, unstakeSend] = useUnstakingModalMachine()

  const closeModal = () => {
    allowanceSend("CLOSE_MODAL")
    unstakeSend("CLOSE_MODAL")
    onClose()
  }

  const startUnstaking = () => {
    allowanceSend("HIDE_NOTIFICATION")
    unstakeSend("UNSTAKE")
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {unstakeState.value === "success"
            ? "Transaction submitted"
            : "Unstake tokens"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {unstakeState.value === "success" ? (
            <TransactionSubmitted transaction={unstakeState.context.transaction} />
          ) : (
            <>
              <Error
                error={unstakeState.context.error || allowanceState.context.error}
                processError={processUnstakingError}
              />
              <Text>
                By unstaking you’ll lose access to the relevant levels. You can
                always stake back, but then the timelock will restart.
              </Text>
            </>
          )}
        </ModalBody>
        <ModalFooter>
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
                          label={`You have to give the Agora smart contracts permission to use your ${tokenSymbol}. You only have to do this once per token.`}
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
                      {`Allow Agora to use ${tokenSymbol}`}
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
                        {`You can now unstake ${tokenSymbol}`}
                      </ModalButton>
                    </Collapse>
                  )
              }
            })()}

            {["allowanceGranted", "successNotification"].includes(
              allowanceState.value
            ) ? (
              (() => {
                switch (unstakeState.value) {
                  case "idle":
                  case "error":
                  default:
                    return (
                      <ModalButton onClick={startUnstaking}>
                        Confirm unstake
                      </ModalButton>
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
                Confirm unstake
              </ModalButton>
            )}
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default UnstakingModal
