import { Img, Tooltip } from "@chakra-ui/react"
import { CHAIN_CONFIG, Chain, Chains, coinIconUrls } from "chains"
import Button from "components/common/Button"
import { useChainId } from "wagmi"

type Props = {
  chain: Chain
  requestNetworkChange: () => void
}

const NetworkButton = ({ chain, requestNetworkChange }: Props) => {
  const chainId = useChainId()

  const isCurrentChain = Chains[chain] === chainId

  return (
    <Tooltip
      isDisabled={!isCurrentChain}
      label={`${CHAIN_CONFIG[chain].name} is currently selected`}
      shouldWrapChildren
    >
      <Button
        leftIcon={
          <Img
            src={coinIconUrls[chain]}
            boxSize={6}
            alt={`${CHAIN_CONFIG[chain].name} logo`}
          />
        }
        border={isCurrentChain && "2px"}
        borderColor="primary.500"
        borderRadius={"xl"}
        isDisabled={isCurrentChain}
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
