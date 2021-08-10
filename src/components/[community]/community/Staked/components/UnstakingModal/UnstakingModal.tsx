import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react"
import { Error } from "components/common/Error"
import Modal from "components/common/Modal"
import ModalButton from "components/common/ModalButton"
import { useCommunity } from "components/[community]/common/Context"
import TokenAllowance from "components/[community]/community/common/TokenAllowance"
import useTokenAllowanceMachine from "components/[community]/community/common/TokenAllowance/hooks/useTokenAllowanceMachine"
import TransactionSubmitted from "components/[community]/community/common/TransactionSubmitted"
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
            <TokenAllowance
              state={allowanceState}
              send={allowanceSend}
              tokenSymbol={tokenSymbol}
              successText={`You can now unstake ${tokenSymbol}`}
            />

            {["allowanceGranted", "successNotification"].includes(
              allowanceState.value.toString()
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
              <ModalButton disabled colorScheme="gray">
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
