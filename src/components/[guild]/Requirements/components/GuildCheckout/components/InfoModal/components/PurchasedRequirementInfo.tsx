import {
  Circle,
  Img,
  SimpleGrid,
  Skeleton,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react"
import useTokenData from "hooks/useTokenData"
import { useGuildCheckoutContext } from "../../GuildCheckoutContex"

type Props = {
  rightElement?: JSX.Element
  footer?: JSX.Element
}

const PurchasedRequirementInfo = ({ rightElement, footer }: Props): JSX.Element => {
  const circleBgColor = useColorModeValue("blackAlpha.100", "blackAlpha.300")

  const { requirement } = useGuildCheckoutContext()
  const {
    data: { symbol, logoURI },
  } = useTokenData(requirement?.chain, requirement?.address)

  return (
    <SimpleGrid
      spacing={4}
      w="full"
      py={2}
      templateColumns={`auto 1fr ${rightElement ? "auto" : ""}`}
      alignItems="center"
    >
      <Circle size="var(--chakra-space-11)" bgColor={circleBgColor}>
        {logoURI ? (
          <Img src={logoURI} alt={symbol} boxSize={6} />
        ) : (
          <Text as="span" fontWeight="bold" fontSize="xx-small">
            ERC20
          </Text>
        )}
      </Circle>

      <VStack alignItems="flex-start" alignSelf="center" spacing={0.5}>
        <Skeleton isLoaded={symbol}>
          <Text as="span" fontWeight="bold">
            {requirement && symbol
              ? `${requirement.data?.minAmount} ${symbol}`
              : "Loading..."}
          </Text>
        </Skeleton>

        {footer}
      </VStack>

      {rightElement}
    </SimpleGrid>
  )
}

export default PurchasedRequirementInfo
