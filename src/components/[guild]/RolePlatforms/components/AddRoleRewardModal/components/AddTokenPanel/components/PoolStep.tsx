import {
  Checkbox,
  FormControl,
  FormLabel,
  HStack,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
} from "@chakra-ui/react"
import { canCloseAddRewardModalAtom } from "components/[guild]/AddRewardButton/AddRewardButton"
import SwitchNetworkButton from "components/[guild]/Requirements/components/GuildCheckout/components/buttons/SwitchNetworkButton"
import useAllowance from "components/[guild]/Requirements/components/GuildCheckout/hooks/useAllowance"
import Button from "components/common/Button"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import useTokenBalance from "hooks/useTokenBalance"
import useTokenData from "hooks/useTokenData"
import { useSetAtom } from "jotai"
import useRegisterPool from "platforms/Token/hooks/useRegisterPool"
import { useEffect, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import Token from "static/icons/token.svg"
import { ERC20_CONTRACT, NULL_ADDRESS } from "utils/guildCheckout/constants"
import { parseUnits } from "viem"
import { useAccount, useBalance } from "wagmi"
import { Chains } from "wagmiConfig/chains"
import { AddTokenFormType } from "../AddTokenPanel"
import ConversionNumberInput from "./ConversionNumberInput"
import GenericBuyAllowanceButton from "./GenericBuyAllowanceButton"

const PoolStep = ({ onSubmit }: { onSubmit: () => void }) => {
  const chain = useWatch({ name: `chain` })
  const tokenAddress = useWatch({ name: `contractAddress` })

  const { chainId, address: userAddress } = useAccount()
  const [amount, setAmount] = useState("1")
  const [skip, setSkip] = useState(false)

  const setCanClose = useSetAtom(canCloseAddRewardModalAtom)

  const {
    data: { logoURI: tokenLogo, decimals },
  } = useTokenData(chain, tokenAddress)

  const formattedAmount = parseUnits(amount, decimals)

  const { data: coinBalanceData } = useBalance({
    address: userAddress,
  })

  const { data: tokenBalanceData } = useTokenBalance({
    token: tokenAddress,
    chainId,
    shouldFetch: tokenAddress !== NULL_ADDRESS,
  })

  const pickedCurrencyIsNative = tokenAddress === NULL_ADDRESS

  const isBalanceSufficient =
    typeof formattedAmount === "bigint" &&
    (coinBalanceData?.value || tokenBalanceData?.value) &&
    (pickedCurrencyIsNative
      ? coinBalanceData?.value >= formattedAmount
      : tokenBalanceData?.value >= formattedAmount)

  const isOnCorrectChain = Number(Chains[chain]) === chainId

  const handlePoolCreation = () => {
    onSubmitTransaction()
  }

  const { setValue } = useFormContext<AddTokenFormType>()

  const { isLoading, onSubmitTransaction } = useRegisterPool(
    userAddress,
    tokenAddress,
    formattedAmount,
    (poolId: string) => {
      setValue("poolId", Number(poolId))
      onSubmit()
    }
  )

  useEffect(() => {
    setCanClose(!isLoading)
  }, [isLoading])

  const { allowance } = useAllowance(
    tokenAddress,
    `0x0d72BCDA1Ec6D0E195249519fb83BB5D559E895D`
  )

  const handleDepositLater = () => {
    if (!skip) setAmount("0")
    setSkip(!skip)
  }

  const imageUrl = useWatch({ name: `imageUrl` })

  return (
    <Stack gap={5}>
      <Text colorScheme="gray">
        Supply the tokens users will receive their eligible amount from. You'll be
        able to deposit more and withdraw from any time.
      </Text>

      <Stack gap={1}>
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

            <ConversionNumberInput
              value={amount}
              setValue={setAmount}
              isDisabled={skip}
            />
          </InputGroup>
        </FormControl>

        <HStack w="full" justifyContent={"left"} spacing={3}>
          <Text fontWeight="semibold" colorScheme="gray">
            or
          </Text>
          <Checkbox
            spacing={1.5}
            isChecked={skip}
            onChange={handleDepositLater}
          ></Checkbox>
          <Text
            fontWeight="medium"
            colorScheme="gray"
            _hover={{ cursor: "pointer" }}
            onClick={handleDepositLater}
          >
            deposit tokens later
          </Text>
        </HStack>
      </Stack>

      <Stack>
        {!isOnCorrectChain && (
          <SwitchNetworkButton targetChainId={Number(Chains[chain])} />
        )}
        {isOnCorrectChain && (
          <GenericBuyAllowanceButton
            chain={chain}
            token={tokenAddress}
            amount={formattedAmount}
            contract={ERC20_CONTRACT}
          />
        )}
        {(!!allowance || pickedCurrencyIsNative) && isOnCorrectChain && (
          <Button
            size="lg"
            colorScheme="primary"
            isDisabled={!isBalanceSufficient}
            onClick={handlePoolCreation}
            isLoading={isLoading}
            loadingText="Creating pool..."
          >
            {isBalanceSufficient ? "Create pool" : "Insufficient balance"}
          </Button>
        )}
      </Stack>
    </Stack>
  )
}

export default PoolStep
