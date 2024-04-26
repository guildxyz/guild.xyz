import {
  Alert,
  AlertIcon,
  Button,
  Collapse,
  Divider,
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
import useToast from "hooks/useToast"
import { useTokenRewardContext } from "platforms/Token/TokenRewardContext"
import { formatUnits } from "viem"
import { useAccount } from "wagmi"
import { Chains } from "wagmiConfig/chains"
import PoolInformation from "./PoolInformation"
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

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>
          <Text>Withdraw pool</Text>
        </ModalHeader>

        <ModalBody>
          <Stack gap={5}>
            <PoolInformation balance={balance} owner={owner} symbol={symbol} />
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
                  <AlertIcon mt={0} /> If you withdraw all funds, no further rewards
                  can be claimed until the pool is funded again.
                </Alert>

                <SwitchNetworkButton targetChainId={Number(Chains[chain])} />

                <Collapse in={isOnCorrectChain}>
                  <Button
                    size="lg"
                    width="full"
                    colorScheme="indigo"
                    isDisabled={!isOnCorrectChain}
                    onClick={onSubmitWithdraw}
                    isLoading={withdrawIsLoading}
                    loadingText="Withdrawing funds..."
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
  )
}

export default WithdrawPoolModal
