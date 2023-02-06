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
import { formatUnits } from "@ethersproject/units"
import usePrice from "components/[guild]/Requirements/components/GuildCheckout/hooks/usePrice"
import { Chains, RPC } from "connectors"
import useCoinBalance from "hooks/useCoinBalance"
import useTokenBalance from "hooks/useTokenBalance"
import useTokenData from "hooks/useTokenData"
import { Fragment } from "react"
import { Rest } from "types"

type Props = {
  chainId: number
  address: string
  asMenuItem?: boolean
} & Rest

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const TokenInfo = ({
  chainId,
  address,
  asMenuItem,
  ...rest
}: Props): JSX.Element => {
  const circleBgColor = useColorModeValue("blackAlpha.100", "blackAlpha.300")

  const {
    data: { priceInSellToken },
    isValidating: isPriceDataLoading,
    error: priceError,
  } = usePrice(address)

  const isTooSmallPrice = priceInSellToken
    ? parseFloat(priceInSellToken.toFixed(3)) <= 0.0
    : undefined

  const {
    data: { symbol, decimals, logoURI },
    error,
    isValidating: isTokenDataLoading,
  } = useTokenData(Chains[chainId], address)

  const { balance: coinBalance, isLoading: isCoinBalanceLoading } =
    useCoinBalance(chainId)
  const { balance: tokenBalance, isLoading: isTokenBalanceLoading } =
    useTokenBalance(address, chainId)
  const balance = formatUnits(
    (address === RPC[Chains[chainId]]?.nativeCurrency?.symbol
      ? coinBalance
      : tokenBalance) ?? "0",
    address === RPC[Chains[chainId]]?.nativeCurrency?.symbol
      ? RPC[Chains[chainId]]?.nativeCurrency?.decimals
      : decimals ?? 18
  )
  const formattedBalance = Number(balance).toFixed(2)

  const isBalanceLoading = isCoinBalanceLoading || isTokenBalanceLoading
  const Wrapper = asMenuItem ? MenuItem : Fragment

  return (
    <Wrapper
      {...(asMenuItem ? { ...rest, isDisabled: !!priceError || !!error } : {})}
    >
      <HStack spacing={4} maxW="calc(100% - 2rem)" {...(asMenuItem ? {} : rest)}>
        <SkeletonCircle isLoaded={!isTokenDataLoading} size="var(--chakra-space-11)">
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

        <Stack spacing={1} maxW="calc(100% - 3rem)">
          <Skeleton isLoaded={!isTokenDataLoading && !isPriceDataLoading} h={5}>
            <Text as="span" display="block" isTruncated>
              {priceError
                ? "Couldn't fetch price"
                : error
                ? "Couldn't fetch token data"
                : `${
                    isTooSmallPrice ? "< 0.001" : priceInSellToken?.toFixed(3)
                  } ${symbol}`}
              <Text as="span" colorScheme="gray">
                {` (${RPC[Chains[chainId]].chainName})`}
              </Text>
            </Text>
          </Skeleton>

          <Skeleton
            isLoaded={!isBalanceLoading}
            h={4}
            display="flex"
            alignItems="center"
          >
            <Text as="span" colorScheme="gray" fontSize="xs">
              {`Balance: ${formattedBalance ?? "0.00"} ${symbol ?? "currency"}`}
            </Text>
          </Skeleton>
        </Stack>
      </HStack>
    </Wrapper>
  )
}

export default TokenInfo
