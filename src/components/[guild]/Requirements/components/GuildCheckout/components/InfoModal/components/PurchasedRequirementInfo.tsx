import { Circle, HStack, Skeleton, Text, useColorModeValue } from "@chakra-ui/react"
import useTokenData from "hooks/useTokenData"
import { useGuildCheckoutContext } from "../../GuildCheckoutContex"

const PurchasedRequirementInfo = (): JSX.Element => {
  const circleBgColor = useColorModeValue("blackAlpha.100", "blackAlpha.300")

  const { requirement } = useGuildCheckoutContext()
  const {
    data: { symbol },
  } = useTokenData(requirement?.chain, requirement?.address)

  return (
    <HStack>
      <Circle size="var(--chakra-space-11)" bgColor={circleBgColor} />

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
