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
  address: string
}

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const TokenInfo = ({ chainId, address }: Props): JSX.Element => {
  const circleBgColor = useColorModeValue("blackAlpha.100", "blackAlpha.300")

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
    <HStack spacing={4}>
      <SkeletonCircle isLoaded={!isTokenDataLoading} size="var(--chakra-space-11)">
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

      <Stack spacing={1}>
        <Skeleton isLoaded={!isTokenDataLoading} h={5}>
          <Text as="span">
            {`{price} ${symbol}`}
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
