import { Img, Tooltip } from "@chakra-ui/react"
import Button from "components/common/Button"
import { useChainId } from "wagmi"
import { CHAIN_CONFIG, Chain, Chains } from "wagmiConfig/chains"

type Props = {
  chain: Chain
  requestNetworkChange: () => void
}

const NetworkButton = ({ chain, requestNetworkChange }: Props) => {
  const chainId = useChainId()

  const isCurrentChain = Chains[chain] === chainId

  return (
    <Tooltip
      isDisabled={!isCurrentChain && !CHAIN_CONFIG[chain].deprecated}
      label={
        isCurrentChain
          ? `${CHAIN_CONFIG[chain].name} is currently selected`
          : "Deprecated chain"
      }
      shouldWrapChildren
    >
      <Button
        leftIcon={
          <Img
            src={CHAIN_CONFIG[chain].iconUrl}
            boxSize={6}
            alt={`${CHAIN_CONFIG[chain].name} logo`}
          />
        }
        border={isCurrentChain && "2px"}
        borderColor="primary.500"
        borderRadius={"xl"}
        isDisabled={isCurrentChain || CHAIN_CONFIG[chain].deprecated}
        onClick={requestNetworkChange}
        w="full"
        size={"xl"}
        iconSpacing={5}
        px={5}
        justifyContent="start"
      >
        {CHAIN_CONFIG[chain].name}
      </Button>
    </Tooltip>
  )
}

export default NetworkButton
