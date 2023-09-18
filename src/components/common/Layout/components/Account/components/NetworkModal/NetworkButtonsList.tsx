import { SimpleGrid } from "@chakra-ui/react"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import { Chains, supportedChains } from "connectors"
import NetworkButton from "./NetworkButton"

type Props = {
  listedChainIDs?: number[]
  networkChangeCallback?: () => void
}

const NetworkButtonsList = ({
  listedChainIDs,
  networkChangeCallback,
}: Props): JSX.Element => {
  const { requestNetworkChange } = useWeb3ConnectionManager()

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
          requestNetworkChange={() =>
            requestNetworkChange(Chains[chain], networkChangeCallback)
          }
        />
      ))}
    </SimpleGrid>
  )
}

export default NetworkButtonsList
