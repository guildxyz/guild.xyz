import {
  Button,
  Collapse,
  Divider,
  FormControl,
  FormLabel,
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
  Tooltip,
} from "@chakra-ui/react"
import SwitchNetworkButton from "components/[guild]/Requirements/components/GuildCheckout/components/buttons/SwitchNetworkButton"
import useAllowance from "components/[guild]/Requirements/components/GuildCheckout/hooks/useAllowance"
import AllowanceButton from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddTokenPanel/components/AllowanceButton"
import useIsBalanceSufficient from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddTokenPanel/hooks/useIsBalanceSufficient"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import { useTokenRewardContext } from "platforms/Token/TokenRewardContext"
import { RefObject } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import ControlledNumberInput from "requirements/WalletActivity/components/ControlledNumberInput"
import Token from "static/icons/token.svg"
import {
  ERC20_CONTRACTS,
  MIN_TOKEN_AMOUNT,
  NULL_ADDRESS,
} from "utils/guildCheckout/constants"
import shortenHex from "utils/shortenHex"
import { formatUnits } from "viem"
import { useAccount } from "wagmi"
import { Chains } from "wagmiConfig/chains"
import PoolInformation from "./PoolInformation"
import useFundPool from "./hooks/useFundPool"
import usePool from "./hooks/usePool"

const FundPoolModal = ({
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
    imageUrl,
    guildPlatform: {
      platformGuildData: { chain, tokenAddress, poolId },
    },
  } = useTokenRewardContext()

  const { data: poolData, refetch } = usePool(chain, BigInt(poolId))
  const { owner, balance: poolBalance } = poolData
  const balance = poolBalance ? Number(formatUnits(poolBalance, decimals)) : 0

  const methods = useForm<{ amount: string }>({
    mode: "all",
    defaultValues: {
      amount: "1",
    },
  })
  const { control } = methods
  const amount = useWatch({ name: "amount", control })

  const { chainId, address: userAddress } = useAccount()

  const { isBalanceSufficient } = useIsBalanceSufficient({
    address: tokenAddress,
    chain: chain,
    amount: amount,
  })

  const pickedCurrencyIsNative = tokenAddress === NULL_ADDRESS
  const isOnCorrectChain = Chains[chain] === chainId

  const { onSubmitTransaction: onSubmitFund, isLoading } = useFundPool(
    chain,
    tokenAddress,
    BigInt(poolId),
    amount,
    () => {
      refetch()
      onSuccess()
    }
  )

  const handleClose = () => {
    onClose()
  }

  const { allowance } = useAllowance(tokenAddress, ERC20_CONTRACTS[chain])

  const isDisabledLabel =
    owner &&
    owner !== userAddress &&
    `Only the requirement's original creator can fund (${shortenHex(owner)})`

  return (
    <FormProvider {...methods}>
      <Modal isOpen={isOpen} onClose={handleClose} finalFocusRef={finalFocusRef}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            <Text>Fund pool</Text>
          </ModalHeader>

          <ModalBody>
            <Stack gap={5}>
              <PoolInformation balance={balance} owner={owner} symbol={symbol} />
              <Divider />
              <FormControl>
                <FormLabel>Amount to deposit</FormLabel>
                <InputGroup>
                  <InputLeftElement>
                    {imageUrl ? (
                      <OptionImage img={imageUrl} alt={chain} />
                    ) : (
                      <Token />
                    )}
                  </InputLeftElement>

                  <ControlledNumberInput
                    defaultValue={"1"}
                    name="amount"
                    adaptiveStepSize
                    w="full"
                    numberFormat="FLOAT"
                    numberInputFieldProps={{ pl: 10, pr: 7 }}
                    min={MIN_TOKEN_AMOUNT}
                  />
                </InputGroup>
              </FormControl>

              <Stack>
                <AllowanceButton
                  chain={chain}
                  token={tokenAddress}
                  contract={ERC20_CONTRACTS[chain]}
                />

                <SwitchNetworkButton targetChainId={Number(Chains[chain])} />

                <Collapse
                  in={
                    isOnCorrectChain && (pickedCurrencyIsNative ? true : !!allowance)
                  }
                >
                  <Tooltip label={isDisabledLabel} hasArrow>
                    <Button
                      size="lg"
                      width="full"
                      colorScheme="indigo"
                      isDisabled={!isBalanceSufficient || !!isDisabledLabel}
                      onClick={onSubmitFund}
                      isLoading={isLoading}
                      loadingText="Funding pool..."
                    >
                      {isBalanceSufficient ? "Fund" : "Insufficient balance"}
                    </Button>
                  </Tooltip>
                </Collapse>
              </Stack>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </FormProvider>
  )
}

export default FundPoolModal
