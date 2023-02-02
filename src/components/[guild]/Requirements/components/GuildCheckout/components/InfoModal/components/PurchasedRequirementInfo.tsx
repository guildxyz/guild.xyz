import {
  Circle,
  HStack,
  Img,
  Skeleton,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import useTokenData from "hooks/useTokenData"
import { useGuildCheckoutContext } from "../../GuildCheckoutContex"

const PurchasedRequirementInfo = (): JSX.Element => {
  const circleBgColor = useColorModeValue("blackAlpha.100", "blackAlpha.300")

  const { requirement } = useGuildCheckoutContext()
  const {
    data: { symbol, logoURI },
  } = useTokenData(requirement?.chain, requirement?.address)

  return (
    <HStack>
      <Circle size="var(--chakra-space-11)" bgColor={circleBgColor}>
        {logoURI ? (
          <Img src={logoURI} alt={symbol} boxSize={6} />
        ) : (
          <Text as="span" fontWeight="bold" fontSize="xx-small">
            ERC20
          </Text>
        )}
      </Circle>

      <Skeleton isLoaded={symbol}>
        <Text as="span" fontWeight="bold">
          {requirement && symbol
            ? `${requirement.data?.minAmount} ${symbol}`
            : "Loading..."}
        </Text>
      </Skeleton>
    </HStack>
  )
}

export default PurchasedRequirementInfo
