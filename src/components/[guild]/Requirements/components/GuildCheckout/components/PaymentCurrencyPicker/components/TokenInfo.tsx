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
import { useWeb3React } from "@web3-react/core"
import { Chains, RPC } from "connectors"
import useBalance from "hooks/useBalance"
import useTokenData from "hooks/useTokenData"
import { Fragment } from "react"
import { Rest } from "types"

type Props = {
  chainId: number
  address: string
  isLoading?: boolean
  error?: any
  requiredAmount: number
  asMenuItem?: boolean
} & Rest

const TokenInfo = ({
  chainId,
  address,
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

  const {
    data: { symbol, decimals, logoURI },
    error: tokenDataError,
    isValidating: isTokenDataLoading,
  } = useTokenData(Chains[chainId], address)

  const { account } = useWeb3React()
  const {
    coinBalance,
    tokenBalance,
    isLoading: isBalanceLoading,
  } = useBalance(address, chainId)

  const balance = formatUnits(
    (address === RPC[Chains[chainId]]?.nativeCurrency?.symbol
      ? coinBalance
      : tokenBalance) ?? "0",
    address === RPC[Chains[chainId]]?.nativeCurrency?.symbol
      ? RPC[Chains[chainId]]?.nativeCurrency?.decimals
      : decimals ?? 18
  )
  const formattedBalance = Number(Number(balance).toFixed(3))

  const Wrapper = asMenuItem ? MenuItem : Fragment

  return (
    <Wrapper
      {...(asMenuItem ? { ...rest, isDisabled: !!error || !!tokenDataError } : {})}
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

        <Stack spacing={1.5} maxW="calc(100% - 3rem)" alignItems={"flex-start"}>
          <Skeleton isLoaded={!isTokenDataLoading && !isLoading} w="full" h={5}>
            <Text as="span" display="block" isTruncated>
              {tokenDataError
                ? "Couldn't fetch token data"
                : error
                ? `[?] ${symbol}`
                : `${
                    isTooSmallRequiredAmount
                      ? "< 0.001"
                      : Number(requiredAmount?.toFixed(3))
                  } ${symbol}`}
              <Text as="span" colorScheme="gray">
                {` (${RPC[Chains[chainId]].chainName})`}
              </Text>
            </Text>
          </Skeleton>

          <Text as="span" colorScheme="gray" fontSize="xs">
            {account ? (
              <>
                {`Balance: `}
                <Skeleton
                  isLoaded={!isBalanceLoading}
                  h={4}
                  display="inline-flex"
                  alignItems="center"
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
