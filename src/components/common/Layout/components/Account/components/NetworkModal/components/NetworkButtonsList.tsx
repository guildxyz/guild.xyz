import { SimpleGrid } from "@chakra-ui/react"
import { CoinbaseWallet } from "@web3-react/coinbase-wallet"
import { useWeb3React } from "@web3-react/core"
import { WalletConnect } from "@web3-react/walletconnect"
import { Chains, supportedChains } from "connectors"
import useToast from "hooks/useToast"
import requestNetworkChange from "../utils/requestNetworkChange"
import NetworkButton from "./NetworkButton"

type Props = {
  listedChainIDs?: number[]
  manualNetworkChangeCallback?: () => void
}

const NetworkButtonsList = ({
  listedChainIDs,
  manualNetworkChangeCallback,
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
      spacing={{ base: 3, md: "18px" }}
      w="full"
    >
      {listedChains.map((chain) => (
        <NetworkButton
          key={chain}
          chain={chain}
          requestNetworkChange={
            connector instanceof WalletConnect || connector instanceof CoinbaseWallet
              ? requestManualNetworkChange(chain)
              : requestNetworkChange(chain, manualNetworkChangeCallback)
          }
        />
      ))}
    </SimpleGrid>
  )
}

export default NetworkButtonsList
