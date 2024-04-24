import {
  Alert,
  AlertIcon,
  Button,
  Collapse,
  Divider,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react"
import SwitchNetworkButton from "components/[guild]/Requirements/components/GuildCheckout/components/buttons/SwitchNetworkButton"
import { WalletTag } from "components/[guild]/crm/Identities"
import CopyableAddress from "components/common/CopyableAddress"
import useToast from "hooks/useToast"
import { useTokenRewardContext } from "platforms/Token/TokenRewardContext"
import { formatUnits } from "viem"
import { useAccount } from "wagmi"
import { Chains } from "wagmiConfig/chains"
import usePool from "./hooks/usePool"
import useWithdrawPool from "./hooks/useWithdrawPool"

const WithdrawPoolModal = ({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}) => {
  const {
    token: {
      data: { decimals, symbol },
    },
    guildPlatform: {
      platformGuildData: { chain, poolId },
    },
  } = useTokenRewardContext()

  const { data: poolData, refetch } = usePool(chain, BigInt(poolId))

  const [owner, , , poolBalance] = poolData || []
  const balance = poolBalance ? Number(formatUnits(poolBalance, decimals)) : 0

  const { chainId } = useAccount()
  const isOnCorrectChain = Chains[chain] === chainId

  const toast = useToast()

  const { onSubmitTransaction: onSubmitWithdraw, isLoading: withdrawIsLoading } =
    useWithdrawPool(chain, BigInt(poolId), () => {
      toast({
        status: "success",
        title: "Success",
        description: "Successfully withdrawed all funds from the pool!",
      })
      onClose()
      refetch()
      onSuccess()
    })

  const handleClose = () => {
    onClose()
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            <Text>Withdraw pool</Text>
          </ModalHeader>

          <ModalBody>
            <Stack gap={5}>
              <Stack gap={1}>
                <HStack>
                  <Text fontWeight={"semibold"} fontSize="sm">
                    Balance
                  </Text>
                  <Text ml={"auto"} fontSize="sm">
                    {balance} {symbol}
                  </Text>
                </HStack>
                <HStack>
                  <Text fontWeight={"semibold"} fontSize={"sm"}>
                    Owner
                  </Text>{" "}
                  <WalletTag ml={"auto"}>
                    <CopyableAddress address={owner} fontSize="sm" />
                  </WalletTag>
                </HStack>
              </Stack>
              <Divider />

              {balance === 0 ? (
                <>
                  <Alert status="info">
                    <AlertIcon mt={0} /> There are currently no funds available to
                    withdraw from the reward pool.
                  </Alert>
                </>
              ) : (
                <>
                  <Alert status="warning">
                    <AlertIcon mt={0} /> Are you sure you want to withdraw all funds
                    from the reward pool? No further rewards can be claimed until
                    funded again.
                  </Alert>

                  <Collapse in={!isOnCorrectChain}>
                    <SwitchNetworkButton targetChainId={Number(Chains[chain])} />
                  </Collapse>

                  <Collapse in={isOnCorrectChain}>
                    <Button
                      size="lg"
                      width="full"
                      colorScheme="indigo"
                      isDisabled={!isOnCorrectChain}
                      onClick={onSubmitWithdraw}
                      isLoading={withdrawIsLoading}
                      loadingText="Funding pool..."
                    >
                      {"Withdraw"}
                    </Button>
                  </Collapse>
                </>
              )}
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default WithdrawPoolModal
