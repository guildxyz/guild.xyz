import {
  Checkbox,
  Collapse,
  FormControl,
  FormLabel,
  HStack,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
} from "@chakra-ui/react"
import { useTokenRewards } from "components/[guild]/AccessHub/hooks/useTokenRewards"
import { canCloseAddRewardModalAtom } from "components/[guild]/AddRewardButton/AddRewardButton"
import SwitchNetworkButton from "components/[guild]/Requirements/components/GuildCheckout/components/buttons/SwitchNetworkButton"
import useAllowance from "components/[guild]/Requirements/components/GuildCheckout/hooks/useAllowance"
import Button from "components/common/Button"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import useTokenData from "hooks/useTokenData"
import { useSetAtom } from "jotai"
import useRegisterPool from "platforms/Token/hooks/useRegisterPool"
import { useEffect, useState } from "react"
import { useController, useFormContext, useWatch } from "react-hook-form"
import ControlledNumberInput from "requirements/WalletActivity/components/ControlledNumberInput"
import Token from "static/icons/token.svg"
import {
  ERC20_CONTRACTS,
  MIN_TOKEN_AMOUNT,
  NULL_ADDRESS,
} from "utils/guildCheckout/constants"
import { parseUnits } from "viem"
import { useAccount } from "wagmi"
import { Chains } from "wagmiConfig/chains"
import useIsBalanceSufficient from "../hooks/useIsBalanceSufficient"
import AllowanceButton from "./AllowanceButton"

const PoolStep = ({ onSubmit }: { onSubmit: () => void }) => {
  const chain = useWatch({ name: `chain` })
  const tokenAddress = useWatch({ name: `tokenAddress` })
  const imageUrl = useWatch({ name: `imageUrl` })

  const { setValue } = useFormContext()
  const { chainId, address: userAddress } = useAccount()
  const {
    field: { value: amount },
  } = useController({ name: "amount" })

  const [skip, setSkip] = useState(false)

  const setCanClose = useSetAtom(canCloseAddRewardModalAtom)

  const {
    data: { logoURI: tokenLogo, decimals },
  } = useTokenData(chain, tokenAddress)

  const { isBalanceSufficient } = useIsBalanceSufficient({
    address: tokenAddress,
    chain: chain,
    amount: amount,
  })

  const formattedAmount =
    !!amount && decimals ? parseUnits(amount, decimals) : BigInt(1)

  const { isLoading, onSubmitTransaction: submitRegisterPool } = useRegisterPool(
    userAddress,
    chain,
    tokenAddress,
    formattedAmount,
    (poolId: string) => {
      setValue("poolId", Number(poolId))
      onSubmit()
    }
  )

  const { allowance } = useAllowance(tokenAddress, ERC20_CONTRACTS[chain])

  useEffect(() => {
    setCanClose(!isLoading)
  }, [isLoading, setCanClose])

  const accessedTokens = useTokenRewards()

  const platformForToken = accessedTokens.find(
    (guildPlatform) =>
      guildPlatform.platformGuildData.chain === chain &&
      guildPlatform.platformGuildData.tokenAddress.toLowerCase() ===
        tokenAddress?.toLowerCase()
  )

  const continuePoolExists = () => {
    setValue("poolId", platformForToken.platformGuildData.poolId)
    onSubmit()
  }

  if (!!platformForToken)
    return (
      <Stack>
        <Text colorScheme="gray">
          You're all set! You had already set up a pool for this token in your guild.
        </Text>
        <Button
          size="lg"
          width="full"
          mt="3"
          colorScheme="indigo"
          onClick={continuePoolExists}
        >
          Create reward
        </Button>
      </Stack>
    )

  const pickedCurrencyIsNative = tokenAddress === NULL_ADDRESS
  const isOnCorrectChain = Number(Chains[chain]) === chainId

  const handleDepositLater = () => {
    if (!skip) setValue("amount", "0")
    setSkip(!skip)
  }

  return (
    <Stack gap={5}>
      <Text colorScheme="gray">
        Supply the tokens users will receive their eligible amount from. You'll be
        able to deposit more and withdraw from any time.
      </Text>

      <Stack gap={2}>
        <FormControl>
          <FormLabel>Amount to deposit</FormLabel>
          <InputGroup>
            <InputLeftElement>
              {tokenLogo || imageUrl ? (
                <OptionImage img={tokenLogo ?? imageUrl} alt={chain} />
              ) : (
                <Token />
              )}
            </InputLeftElement>

            <ControlledNumberInput
              numberFormat="FLOAT"
              name="amount"
              min={MIN_TOKEN_AMOUNT}
              isDisabled={skip}
              defaultValue={1}
              numberInputFieldProps={{ pr: 7, pl: 10 }}
              width={"full"}
            />
          </InputGroup>
        </FormControl>

        <HStack w="full" justifyContent={"left"} spacing={3}>
          <Text fontWeight="semibold" colorScheme="gray">
            or
          </Text>
          <Checkbox spacing={1.5} isChecked={skip} onChange={handleDepositLater}>
            <Text fontWeight="medium" colorScheme="gray">
              deposit tokens later
            </Text>
          </Checkbox>
        </HStack>
      </Stack>

      <Stack>
        <Collapse in={!isOnCorrectChain}>
          <SwitchNetworkButton targetChainId={Number(Chains[chain])} />
        </Collapse>

        <Collapse in={isOnCorrectChain && !skip}>
          <AllowanceButton
            chain={chain}
            token={tokenAddress}
            contract={ERC20_CONTRACTS[chain]}
          />
        </Collapse>

        <Collapse
          in={(!!allowance || skip || pickedCurrencyIsNative) && isOnCorrectChain}
        >
          <Button
            size="lg"
            width="full"
            colorScheme="indigo"
            isDisabled={!isBalanceSufficient}
            onClick={submitRegisterPool}
            isLoading={isLoading}
            loadingText="Creating pool..."
          >
            {isBalanceSufficient ? "Create pool" : "Insufficient balance"}
          </Button>
        </Collapse>
      </Stack>
    </Stack>
  )
}

export default PoolStep
