import {
  Circle,
  HStack,
  Img,
  MenuItem,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import useTokenBalance from "hooks/useTokenBalance"
import { Fragment } from "react"
import { Rest } from "types"
import { NULL_ADDRESS } from "utils/guildCheckout/constants"
import { formatUnits } from "viem"
import { useAccount, useBalance } from "wagmi"
import { CHAIN_CONFIG, Chains } from "wagmiConfig/chains"

type Props = {
  chainId: number
  address: `0x${string}`
  isLoading?: boolean
  error?: any
  requiredAmount: number
  asMenuItem?: boolean
} & Rest

const TokenInfo = ({
  chainId,
  address: tokenAddress,
  asMenuItem,
  isLoading,
  error,
  requiredAmount,
  ...rest
}: Props): JSX.Element => {
  const circleBgColor = useColorModeValue("blackAlpha.100", "blackAlpha.300")

  const isTooSmallRequiredAmount = requiredAmount
    ? parseFloat(requiredAmount.toFixed(3)) <= 0.0
    : undefined

  const isNativeCurrency = tokenAddress === NULL_ADDRESS

  const logoURI = isNativeCurrency
    ? CHAIN_CONFIG[Chains[chainId]].iconUrl
    : undefined

  const { address } = useAccount()
  const { data: coinBalanceData, isLoading: isCoinBalanceLoading } = useBalance({
    address,
    chainId,
  })

  const {
    data: tokenBalanceData,
    isLoading: isTokenBalanceLoading,
    isError: isTokenBalanceError,
  } = useTokenBalance({
    token: tokenAddress,
    chainId,
    shouldFetch: tokenAddress !== NULL_ADDRESS,
  })

  const symbol = isNativeCurrency
    ? CHAIN_CONFIG[Chains[chainId]].nativeCurrency.symbol
    : tokenBalanceData?.symbol

  const isBalanceLoading = isCoinBalanceLoading || isTokenBalanceLoading

  const formattedBalance = Number(
    Number(
      tokenAddress === NULL_ADDRESS && coinBalanceData?.value
        ? formatUnits(coinBalanceData.value, coinBalanceData.decimals)
        : tokenBalanceData?.value
        ? formatUnits(tokenBalanceData.value, tokenBalanceData.decimals)
        : 0
    ).toFixed(3)
  )

  const Wrapper = asMenuItem ? MenuItem : Fragment

  return (
    <Wrapper
      {...(asMenuItem
        ? { ...rest, isDisabled: !!error || isTokenBalanceError }
        : {})}
    >
      <HStack spacing={4} maxW="calc(100% - 2rem)" {...(asMenuItem ? {} : rest)}>
        <SkeletonCircle
          isLoaded={!isTokenBalanceLoading}
          size="var(--chakra-space-11)"
        >
          <Circle size="var(--chakra-space-11)" bgColor={circleBgColor}>
            {logoURI ? (
              <Img src={logoURI} alt={symbol} boxSize={6} />
            ) : (
              <Text as="span" fontWeight="bold" fontSize="xx-small">
                {symbol}
              </Text>
            )}
          </Circle>
        </SkeletonCircle>

        <Stack
          spacing={1.5}
          maxW="calc(100% - 3rem)"
          alignItems={"flex-start"}
          textAlign={"left"}
        >
          <Skeleton isLoaded={!isTokenBalanceLoading && !isLoading} w="full" h={5}>
            <Text
              as="span"
              display="block"
              isTruncated
              data-test="token-info-fee-currency"
            >
              {isTokenBalanceError
                ? "Couldn't fetch token data"
                : error
                ? `[?] ${symbol}`
                : `${
                    isTooSmallRequiredAmount
                      ? "< 0.001"
                      : Number(requiredAmount?.toFixed(3))
                  } ${symbol}`}
              <Text as="span" colorScheme="gray">
                {` (${CHAIN_CONFIG[Chains[chainId]].name})`}
              </Text>
            </Text>
          </Skeleton>

          <Text as="span" colorScheme="gray" fontSize="xs">
            {address ? (
              <>
                {`Balance: `}
                <Skeleton
                  isLoaded={!isBalanceLoading}
                  h={4}
                  display="inline-flex"
                  alignItems="center"
                  data-test="token-info-balance"
                >
                  {`${formattedBalance ?? "0.00"} ${symbol ?? "currency"}`}
                </Skeleton>
              </>
            ) : (
              "Connect wallet to check balance"
            )}
          </Text>
        </Stack>
      </HStack>
    </Wrapper>
  )
}

export default TokenInfo
