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
  Tooltip,
} from "@chakra-ui/react"
import SwitchNetworkButton from "components/[guild]/Requirements/components/GuildCheckout/components/buttons/SwitchNetworkButton"
import AllowanceButton from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddTokenPanel/components/AllowanceButton"
import useToast from "hooks/useToast"
import { useTokenRewardContext } from "platforms/Token/TokenRewardContext"
import { RefObject } from "react"
import { ERC20_CONTRACTS } from "utils/guildCheckout/constants"
import shortenHex from "utils/shortenHex"
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
  finalFocusRef,
}: {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  finalFocusRef?: RefObject<any>
}) => {
  const {
    token: {
      data: { decimals, symbol },
    },
    guildPlatform: {
      platformGuildData: { chain, poolId, tokenAddress },
    },
  } = useTokenRewardContext()

  const { data: poolData, refetch } = usePool(chain, BigInt(poolId))

  const { owner, balance: poolBalance } = poolData
  const balance = poolBalance ? Number(formatUnits(poolBalance, decimals)) : 0

  const { chainId, address } = useAccount()
  const isOnCorrectChain = Chains[chain] === chainId

  const toast = useToast()

  const { onSubmitTransaction: onSubmitWithdraw, isLoading: withdrawIsLoading } =
    useWithdrawPool(chain, BigInt(poolId), () => {
      toast({
        status: "success",
        title: "Success",
        description: "Successfully withdrawn all funds from the pool!",
      })
      onClose()
      refetch()
      onSuccess()
    })

  const isDisabledLabel =
    owner &&
    owner !== address &&
    `Only the requirement's original creator can withdraw (${shortenHex(owner)})`

  return (
    <Modal isOpen={isOpen} onClose={onClose} finalFocusRef={finalFocusRef}>
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

                <AllowanceButton
                  chain={chain}
                  token={tokenAddress}
                  contract={ERC20_CONTRACTS[chain]}
                />

                <SwitchNetworkButton targetChainId={Number(Chains[chain])} />

                <Collapse in={isOnCorrectChain}>
                  <Tooltip label={isDisabledLabel} hasArrow>
                    <Button
                      size="lg"
                      width="full"
                      colorScheme="indigo"
                      isDisabled={!isOnCorrectChain || !!isDisabledLabel}
                      onClick={onSubmitWithdraw}
                      isLoading={withdrawIsLoading}
                      loadingText="Withdrawing funds..."
                    >
                      {"Withdraw"}
                    </Button>
                  </Tooltip>
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
