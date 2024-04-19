import {
  Button,
  Collapse,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  InputGroup,
  InputLeftElement,
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
import ConversionNumberInput from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddTokenPanel/components/ConversionNumberInput"
import { WalletTag } from "components/[guild]/crm/Identities"
import CopyableAddress from "components/common/CopyableAddress"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import useTokenBalance from "hooks/useTokenBalance"
import { useTokenRewardContext } from "platforms/Token/TokenRewardContext"
import { useState } from "react"
import Token from "static/icons/token.svg"
import { NULL_ADDRESS } from "utils/guildCheckout/constants"
import { parseUnits } from "viem"
import { useAccount, useBalance } from "wagmi"
import { Chains } from "wagmiConfig/chains"
import useFundPool from "./hooks/useFundPool"

const FundPoolModal = ({
  poolId,
  balance,
  owner,
  isOpen,
  onClose,
  onSuccess,
}: {
  poolId: bigint
  balance: number
  owner: `0x${string}`
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}) => {
  const {
    token: { decimals, symbol },
    isTokenLoading,
    rewardImageUrl,
    tokenReward: {
      guildPlatform: {
        platformGuildData: { chain, tokenAddress },
      },
    },
  } = useTokenRewardContext()

  const [amount, setAmount] = useState("1")

  const { chainId, address: userAddress } = useAccount()

  const { data: coinBalanceData } = useBalance({
    address: userAddress,
  })

  const { data: tokenBalanceData } = useTokenBalance({
    token: tokenAddress,
    chainId,
    shouldFetch: tokenAddress !== NULL_ADDRESS,
  })

  let formattedAmount = BigInt(1)
  try {
    formattedAmount = parseUnits(amount, decimals)
  } catch {}

  const pickedCurrencyIsNative = tokenAddress === NULL_ADDRESS
  const isOnCorrectChain = Chains[chain] === chainId

  const isBalanceSufficient =
    typeof formattedAmount === "bigint" &&
    (pickedCurrencyIsNative
      ? coinBalanceData?.value >= formattedAmount
      : tokenBalanceData?.value >= formattedAmount)

  const { onSubmitTransaction: onSubmitFund, isLoading } = useFundPool(
    chain,
    tokenAddress,
    poolId,
    formattedAmount,
    onSuccess
  )

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
            <Text>Fund pool</Text>
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
              <FormControl>
                <FormLabel>Amount to deposit</FormLabel>
                <InputGroup>
                  <InputLeftElement>
                    {rewardImageUrl ? (
                      <OptionImage img={rewardImageUrl} alt={chain} />
                    ) : (
                      <Token />
                    )}
                  </InputLeftElement>

                  <ConversionNumberInput value={amount} setValue={setAmount} />
                </InputGroup>
              </FormControl>

              <Collapse in={!isOnCorrectChain}>
                <SwitchNetworkButton targetChainId={Number(Chains[chain])} />
              </Collapse>

              <Collapse in={isOnCorrectChain}>
                <Button
                  size="lg"
                  width="full"
                  colorScheme="indigo"
                  isDisabled={!isBalanceSufficient}
                  onClick={onSubmitFund}
                  isLoading={isLoading}
                  loadingText="Funding pool..."
                >
                  {isBalanceSufficient ? "Fund" : "Insufficient balance"}
                </Button>
              </Collapse>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default FundPoolModal
