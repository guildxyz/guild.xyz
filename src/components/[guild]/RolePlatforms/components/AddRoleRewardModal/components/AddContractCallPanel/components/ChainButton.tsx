import { Img, useColorModeValue } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import { Chain, Chains, RPC } from "connectors"
import { useState } from "react"

// This component is mainly a copy-paste from MintGuildPinChainPicker, so we should maybe generalize that component instead of using this one

type Props = {
  chain: Chain
  unsupported?: boolean
}

const ChainButton = ({ chain, unsupported }: Props) => {
  const { chainId } = useWeb3React()
  const { requestNetworkChange } = useWeb3ConnectionManager()
  const [isLoading, setIsLoading] = useState(false)

  const isCurrentChain = Chains[chain] === chainId

  const activeBorderColor = useColorModeValue("gray.300", "gray.500")

  return (
    <Button
      size="sm"
      isDisabled={isCurrentChain}
      leftIcon={
        <Img
          src={RPC[chain].iconUrls[0]}
          alt={`${RPC[chain].chainName} network icon`}
          boxSize={4}
        />
      }
      borderRadius="lg"
      onClick={
        unsupported
          ? undefined
          : () => {
              setIsLoading(true)
              requestNetworkChange(
                RPC[chain].chainId,
                () => setIsLoading(false),
                () => setIsLoading(false)
              )
            }
      }
      isLoading={isLoading}
      loadingText={RPC[chain].chainName}
      border={isCurrentChain && "2px"}
      borderColor={activeBorderColor}
      opacity={isCurrentChain && "1!important"}
    >
      {`${RPC[chain].chainName}${unsupported ? " (unsupported)" : ""}`}
    </Button>
  )
}

export default ChainButton
