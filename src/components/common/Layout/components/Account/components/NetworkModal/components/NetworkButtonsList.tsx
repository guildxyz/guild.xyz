import { SimpleGrid } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { WalletConnect } from "@web3-react/walletconnect"
import { Web3Connection } from "components/_app/Web3ConnectionManager"
import { Chains, supportedChains } from "connectors"
import useToast from "hooks/useToast"
import { useContext } from "react"
import requestNetworkChange from "../utils/requestNetworkChange"
import NetworkButton from "./NetworkButton"

type Props = {
  manualNetworkChangeCallback?: () => void
}

const NetworkButtonsList = ({ manualNetworkChangeCallback }: Props): JSX.Element => {
  const { listedChainIDs } = useContext(Web3Connection)
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
    <SimpleGrid columns={{ md: 2, lg: 3 }} spacing={{ base: 3, md: "18px" }}>
      {listedChains.map((chain) => (
        <NetworkButton
          key={chain}
          chain={chain}
          requestNetworkChange={
            connector instanceof WalletConnect
              ? requestManualNetworkChange(chain)
              : requestNetworkChange(chain, manualNetworkChangeCallback)
          }
        />
      ))}
    </SimpleGrid>
  )
}

export default NetworkButtonsList
