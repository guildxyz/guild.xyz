import {
  As,
  Circle,
  HStack,
  Img,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import { formatUnits } from "@ethersproject/units"
import usePrice from "components/[guild]/Requirements/components/PurchaseRequirement/hooks/usePrice"
import { Chains, RPC } from "connectors"
import useCoinBalance from "hooks/useCoinBalance"
import useTokenBalance from "hooks/useTokenBalance"
import useTokenData from "hooks/useTokenData"
import { Rest } from "types"

type Props = {
  chainId: number
  address: string
  as?: As<any>
} & Rest

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const TokenInfo = ({ chainId, address, as, ...rest }: Props): JSX.Element => {
  const circleBgColor = useColorModeValue("blackAlpha.100", "blackAlpha.300")

  const {
    data: priceData,
    isValidating: isPriceDataLoading,
    error: priceError,
  } = usePrice(address)

  // TODO: error handling
  const {
    data: { symbol: tokenSymbol, decimals, logoURI: tokenLogoURI },
    error,
    isValidating: isTokenDataLoading,
  } = useTokenData(Chains[chainId], address)
  const logoURI = ADDRESS_REGEX.test(address)
    ? tokenLogoURI
    : RPC[Chains[chainId]].nativeCurrency.logoURI
  const symbol = ADDRESS_REGEX.test(address)
    ? tokenSymbol
    : RPC[Chains[chainId]].nativeCurrency.symbol

  // TODO: error handling
  const { balance: coinBalance, isLoading: isCoinBalanceLoading } =
    useCoinBalance(chainId)
  const { balance: tokenBalance, isLoading: isTokenBalanceLoading } =
    useTokenBalance(address, chainId)
  const balance = formatUnits(
    (address ? tokenBalance : coinBalance) ?? "0",
    address ? decimals : 18
  )
  const formattedBalance = Number(balance).toFixed(2)

  const isBalanceLoading = isCoinBalanceLoading || isTokenBalanceLoading

  return (
    <HStack
      as={as}
      spacing={4}
      maxW="calc(100% - 2rem)"
      {...rest}
      isDisabled={!!priceError}
    >
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
              : `${priceData?.price.toFixed(5)} ${symbol}`}
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
  )
}

export default TokenInfo
