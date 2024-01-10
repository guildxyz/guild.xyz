import { SimpleGrid } from "@chakra-ui/react"
import { CHAIN_CONFIG, Chains, supportedChains } from "chains"
import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import NetworkButton from "./NetworkButton"

type Props = {
  listedChainIDs?: number[]
  networkChangeCallback?: () => void
}

const shownSupportedChains = supportedChains.filter(
  (chain) => CHAIN_CONFIG[chain].rpcUrls.default.http.length > 0
)

const NetworkButtonsList = ({
  listedChainIDs,
  networkChangeCallback,
}: Props): JSX.Element => {
  const { requestNetworkChange } = useWeb3ConnectionManager()

  const listedChains =
    listedChainIDs?.length > 0
      ? shownSupportedChains.filter((chain) =>
          listedChainIDs?.includes(Chains[chain])
        )
      : shownSupportedChains.filter(
          (chain) => CHAIN_CONFIG[chain].rpcUrls.default.http.length > 0
        )

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
          requestNetworkChange={() =>
            requestNetworkChange(Chains[chain], networkChangeCallback)
          }
        />
      ))}
    </SimpleGrid>
  )
}

export default NetworkButtonsList
