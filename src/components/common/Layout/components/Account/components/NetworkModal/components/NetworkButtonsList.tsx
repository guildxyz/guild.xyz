import { SimpleGrid } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { WalletConnect } from "@web3-react/walletconnect"
import { Chains, supportedChains } from "connectors"
import useToast from "hooks/useToast"
import requestNetworkChange from "../utils/requestNetworkChange"
import NetworkButton from "./NetworkButton"

type Props = {
  listedChainIDs?: number[]
  manualNetworkChangeCallback?: () => void
  small?: boolean
}

const NetworkButtonsList = ({
  listedChainIDs,
  manualNetworkChangeCallback,
  small,
}: Props): JSX.Element => {
  const { connector } = useWeb3React()
  const toast = useToast()

  const requestManualNetworkChange = (chain) => () =>
    toast({
      title: "Your wallet doesn't support switching chains automatically",
      description: `Please switch to ${chain} from your wallet manually!`,
      status: "error",
    })

  const listedChains =
    listedChainIDs?.length > 0
      ? supportedChains?.filter((chain) => listedChainIDs?.includes(Chains[chain]))
      : supportedChains

  return (
    <SimpleGrid
      columns={{ md: 2, lg: 3 }}
      spacing={small ? { base: 1, md: 2 } : { base: 3, md: "18px" }}
      w="full"
    >
      {listedChains.map((chain) => (
        <NetworkButton
          key={chain}
          chain={chain}
          requestNetworkChange={
            connector instanceof WalletConnect
              ? requestManualNetworkChange(chain)
              : requestNetworkChange(chain, manualNetworkChangeCallback)
          }
          small={small}
        />
      ))}
    </SimpleGrid>
  )
}

export default NetworkButtonsList
