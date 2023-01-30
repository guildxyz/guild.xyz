import { HStack, Icon, Text, Tooltip } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import { Chains, RPC } from "connectors"
import useTokenData from "hooks/useTokenData"
import { Question } from "phosphor-react"
import { useGuildCheckoutContext } from "../GuildCheckoutContex"

const AllowanceButton = (): JSX.Element => {
  const { pickedCurrency, requirement } = useGuildCheckoutContext()
  const requirementChainId = Chains[requirement.chain]

  const { chainId } = useWeb3React()

  const {
    data: { symbol, name },
  } = useTokenData(requirement.chain, pickedCurrency)
  const tokenSymbol =
    pickedCurrency === "COIN" ? RPC[Chains[chainId]].nativeCurrency.symbol : symbol
  const tokenName =
    pickedCurrency === "COIN" ? RPC[Chains[chainId]].nativeCurrency.name : name

  if (!pickedCurrency || chainId !== requirementChainId) return null

  return (
    <CardMotionWrapper>
      <Button
        size="xl"
        colorScheme="blue"
        isLoading={false} // TODO
        loadingText="Check your wallet"
        onClick={() => {}} // TODO
        w="full"
      >
        <HStack>
          <Text as="span">{`Allow Guild to use your ${tokenSymbol}`}</Text>
          <Tooltip
            label={`You have to give the Guild smart contracts permission to use your ${tokenName}. You only have to do this once per token.`}
          >
            <Icon as={Question} />
          </Tooltip>
        </HStack>
      </Button>
    </CardMotionWrapper>
  )
}

export default AllowanceButton
