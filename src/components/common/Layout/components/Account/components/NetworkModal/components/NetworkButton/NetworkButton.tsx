import { Box, Button, Img, Tooltip } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { Chains, RPC } from "connectors"

type Props = {
  chain: string
  requestNetworkChange: () => void
}

const NetworkButton = ({ chain, requestNetworkChange }: Props) => {
  const { chainId } = useWeb3React()

  const isCurrentChain = Chains[chain] === chainId

  return (
    <Tooltip
      isDisabled={!isCurrentChain}
      label={`${RPC[chain].chainName} is currently selected`}
    >
      <Box>
        <Button
          rightIcon={
            <Img
              src={RPC[chain].iconUrls[0]}
              boxSize="6"
              alt={`${RPC[chain].chainName} logo`}
            />
          }
          border={isCurrentChain && "2px"}
          borderColor="primary.500"
          disabled={isCurrentChain}
          onClick={requestNetworkChange}
          isFullWidth
          size="xl"
          justifyContent="space-between"
        >
          {RPC[chain].chainName}
        </Button>
      </Box>
    </Tooltip>
  )
}

export default NetworkButton
