import {
  Box,
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
import usePoapVault from "components/[guild]/CreatePoap/hooks/usePoapVault"
import { Chains, RPC } from "connectors"
import useTokenData from "hooks/useTokenData"

type Props = {
  vaultId: number
  chainId: number
}

const MonetizedPoapCard = ({ vaultId, chainId }: Props): JSX.Element => {
  const monetizedPoapCardBg = useColorModeValue("gray.50", "blackAlpha.300")
  const chainLogoBg = useColorModeValue("white", "gray.100")

  const { isVaultLoading, vaultData } = usePoapVault(vaultId, chainId)

  const {
    data: { symbol, decimals },
    isValidating: isTokenDataLoading,
  } = useTokenData(Chains[chainId], vaultData?.token)

  return (
    <Box
      bgColor={monetizedPoapCardBg}
      px={{ base: 5, sm: 6 }}
      py={7}
      borderRadius="2xl"
    >
      <HStack spacing={{ base: 5, sm: 10 }}>
        <SkeletonCircle
          boxSize={10}
          isLoaded={!isVaultLoading && !isTokenDataLoading}
        >
          <Circle size={10} bgColor={chainLogoBg}>
            <Img
              src={RPC[Chains[chainId]]?.iconUrls?.[0]}
              alt={RPC[Chains[chainId]]?.chainName}
              boxSize={6}
            />
          </Circle>
        </SkeletonCircle>

        <Stack spacing={0.5}>
          <Skeleton isLoaded={!isVaultLoading && !isTokenDataLoading} h={5}>
            <Text as="span" fontWeight="bold">
              {RPC[Chains[chainId]]?.chainName}
            </Text>
          </Skeleton>

          <Skeleton isLoaded={!isVaultLoading && !isTokenDataLoading} h={4}>
            <Text as="span" fontSize="sm" color="gray">
              {`${formatUnits(vaultData?.fee ?? "0", decimals ?? 18)} ${
                symbol ?? RPC[Chains[chainId]]?.nativeCurrency?.symbol
              }`}
            </Text>
          </Skeleton>
        </Stack>
      </HStack>
    </Box>
  )
}

export default MonetizedPoapCard
