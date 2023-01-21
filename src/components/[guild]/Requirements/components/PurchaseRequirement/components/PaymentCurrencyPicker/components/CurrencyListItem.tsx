import {
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
import { Chains, RPC } from "connectors"
import useCoinBalance from "hooks/useCoinBalance"
import useTokenBalance from "hooks/useTokenBalance"
import useTokenData from "hooks/useTokenData"

type Props = {
  chainId: number
  address?: string
}

const CurrencyListItem = ({ chainId, address }: Props): JSX.Element => {
  const circleBgColor = useColorModeValue("blackAlpha.100", "blackAlpha.300")

  const {
    data: { symbol: tokenSymbol, decimals, logoURI: tokenLogoURI },
    error,
    isValidating: isTokenDataLoading,
  } = useTokenData(Chains[chainId], address)
  const logoURI = address
    ? tokenLogoURI
    : RPC[Chains[chainId]].nativeCurrency.logoURI
  const symbol = address ? tokenSymbol : RPC[Chains[chainId]].nativeCurrency.symbol

  // TODO: error handling here???
  const { balance: coinBalance, isLoading: isCoinBalanceLoading } =
    useCoinBalance(chainId)
  const { balance: tokenBalance, isLoading: isTokenBalanceLoading } =
    useTokenBalance(address, chainId)
  const balance = formatUnits(
    (address ? tokenBalance : coinBalance) ?? "0",
    address ? decimals : 18
  )
  const formattedBalance = Number(balance).toFixed(2)

  const isLoading =
    isTokenDataLoading || isCoinBalanceLoading || isTokenBalanceLoading

  return (
    <HStack spacing={4} px={4} py={2}>
      <SkeletonCircle isLoaded={!isLoading} size="var(--chakra-space-11)">
        <Circle size="var(--chakra-space-11)" bgColor={circleBgColor}>
          {logoURI ? (
            <Img src={logoURI} alt={symbol} boxSize={8} />
          ) : (
            <Text as="span" fontWeight="bold" fontSize="xx-small">
              {symbol}
            </Text>
          )}
        </Circle>
      </SkeletonCircle>
      <Stack spacing={0.5}>
        <Skeleton isLoaded={!isLoading} h={5}>
          <Text as="span">
            {`{PRICE} ${symbol}`}
            <Text as="span" colorScheme="gray">
              {` (${RPC[Chains[chainId]].chainName})`}
            </Text>
          </Text>
        </Skeleton>

        <Skeleton isLoaded={!isLoading} h={4}>
          <Text as="span" colorScheme="gray" fontSize="xs">
            {`Balance: ${formattedBalance ?? "0.00"} ${symbol ?? "currency"}`}
          </Text>
        </Skeleton>
      </Stack>
    </HStack>
  )
}

export default CurrencyListItem
