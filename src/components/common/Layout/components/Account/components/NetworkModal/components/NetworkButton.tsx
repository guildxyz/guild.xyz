import { Box, Img, Tooltip } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import { Chains, RPC } from "connectors"

type Props = {
  chain: string
  requestNetworkChange: () => void
  small?: boolean
}

const NetworkButton = ({ chain, requestNetworkChange, small }: Props) => {
  const { chainId } = useWeb3React()

  const isCurrentChain = Chains[chain] === chainId

  return (
    <Tooltip
      isDisabled={!isCurrentChain}
      label={`${RPC[chain].chainName} is currently selected`}
    >
      <Box>
        <Button
          leftIcon={
            <Img
              src={RPC[chain].iconUrls[0]}
              boxSize={small ? 4 : 6}
              alt={`${RPC[chain].chainName} logo`}
            />
          }
          border={isCurrentChain && "2px"}
          borderColor="primary.500"
          borderRadius={small ? "lg" : "xl"}
          disabled={isCurrentChain}
          onClick={requestNetworkChange}
          isFullWidth
          size={small ? "sm" : "xl"}
          iconSpacing={small ? 2 : 5}
          px={small ? 2 : 5}
          justifyContent="start"
        >
          {RPC[chain].chainName}
        </Button>
      </Box>
    </Tooltip>
  )
}

export default NetworkButton
