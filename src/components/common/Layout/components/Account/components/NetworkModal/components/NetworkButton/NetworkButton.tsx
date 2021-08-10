import { Box, Button, Img, Tooltip } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { useCommunity } from "components/[community]/common/Context"
import { Chains, RPC } from "connectors"

type Props = {
  chain: string
  requestNetworkChange: () => void
}

const NetworkButton = ({ chain, requestNetworkChange }: Props) => {
  const { chainId } = useWeb3React()
  const communityData = useCommunity()
  const isCommunityAvailable =
    !communityData || communityData.availableChains.includes(chain)

  const isCurrentChain = Chains[chain] === chainId

  return (
    <Tooltip
      isDisabled={isCommunityAvailable && !isCurrentChain}
      label={
        isCurrentChain
          ? `${RPC[chain].chainName} is currently selected`
          : `${communityData?.name} is not available on this network`
      }
    >
      <Box>
        <Button
          rightIcon={
            <Img
              src={RPC[chain].iconUrl}
              boxSize="6"
              alt={`${RPC[chain].chainName} logo`}
            />
          }
          border={isCurrentChain && "2px"}
          borderColor="primary.500"
          disabled={!isCommunityAvailable || isCurrentChain}
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
