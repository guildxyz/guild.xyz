import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  VStack,
  Text,
  Collapse,
  CloseButton,
  Tooltip,
  Center,
  Icon,
} from "@chakra-ui/react"
import { Info, Check, ArrowCircleUp } from "phosphor-react"
import { useEffect } from "react"
import type { AccessRequirements } from "temporaryData/types"
import msToReadableFormat from "utils/msToReadableFormat"
import ModalButton from "components/common/ModalButton"
import { Error } from "components/common/Error"
import { useCommunity } from "components/community/Context"
import useStakingModalMachine from "./hooks/useStakingModalMachine"

type Props = {
  name: string
  accessRequirement: AccessRequirements
  isOpen: boolean
  onClose: () => void
}

const StakingModal = ({
  name,
  accessRequirement: { amount, timelockMs },
  isOpen,
  onClose,
}: Props): JSX.Element => {
  const {
    chainData: {
      token: { symbol: tokenSymbol },
      stakeToken: { symbol: stakeTokenSymbol },
    },
  } = useCommunity()
  const [state, send] = useStakingModalMachine(amount)

  useEffect(() => {
    console.log({
      state: state.value,
      context: state.context,
    })
  }, [state])

  const closeModal = () => {
    send("RESET")
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {state.value === "success"
            ? `Transaction submitted`
            : `Stake to join ${name}`}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {state.value === "success" ? (
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
                You’ll recieve {amount} {stakeTokenSymbol} in return. Those mark your
                position, so don’t sell or send them because you will lose access to
                the community level and won’t be able to get your {tokenSymbol}{" "}
                tokens back.
              </Text>
            </>
          ) : (
            <>
              <Error
                error={state.context.error}
                processError={() => ({
                  title: "Error",
                  description: "Error description",
                })}
              />
              <Text fontWeight="medium">
                Stake {amount} {tokenSymbol} to gain access to {name}. Your tokens
                will be locked for {msToReadableFormat(timelockMs)}, after that you
                can unstake them anytime. You can always stake more to upgrade to
                higher levels.
              </Text>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          {/* margin is applied on the approve button,
              so there's no unwanted space when it's not shown */}
          <VStack spacing="0" alignItems="strech">
            {(() => {
              switch (state.value) {
                case "noPermission":
                case "approveTransactionError":
                  return (
                    <ModalButton
                      mb="3"
                      rightIcon={
                        <Tooltip
                          label="You have to give the Agora smart contracts permission to use your [token name]. You only have to do this once per token."
                          placement="top"
                        >
                          <Icon as={Info} tabIndex={0} />
                        </Tooltip>
                      }
                      // so the button label will be positioned to the center
                      leftIcon={<span />}
                      justifyContent="space-between"
                      onClick={() => send("ALLOW")}
                    >
                      {`Allow Agora to use ${tokenSymbol}`}
                    </ModalButton>
                  )
                case "approving":
                  return (
                    <ModalButton
                      mb="3"
                      isLoading
                      loadingText="Waiting confirmation"
                    />
                  )
                case "approveTransactionPending":
                  return (
                    <ModalButton
                      mb="3"
                      isLoading
                      loadingText="Waiting for transaction to succeed"
                    />
                  )
                case "idle":
                case "staking":
                case "stakingError":
                  return (
                    <Collapse in={state.context.showApproveSuccess}>
                      <ModalButton
                        as="div"
                        colorScheme="gray"
                        variant="solidStatic"
                        rightIcon={
                          <CloseButton
                            onClick={() => send("HIDE_APPROVE_SUCCESS")}
                          />
                        }
                        leftIcon={<Check />}
                        justifyContent="space-between"
                        mb="3"
                      >
                        {`You can now stake ${tokenSymbol}`}
                      </ModalButton>
                    </Collapse>
                  )
                default:
                  return null
              }
            })()}
            {(() => {
              switch (state.value) {
                case "idle":
                  return (
                    <ModalButton onClick={() => send("STAKE")}>
                      Confirm stake
                    </ModalButton>
                  )
                case "staking":
                  return <ModalButton isLoading loadingText="Waiting confirmation" />
                case "stakingError":
                  return (
                    <ModalButton onClick={() => send("STAKE")}>
                      Confirm stake
                    </ModalButton>
                  )
                case "success":
                  return <ModalButton onClick={closeModal}>Close</ModalButton>
                default:
                  return (
                    <ModalButton
                      disabled
                      colorScheme="gray"
                      bg="gray.200"
                      _hover={{ bg: "gray.200" }}
                    >
                      Confirm stake
                    </ModalButton>
                  )
              }
            })()}
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default StakingModal
