import { SimpleGrid } from "@chakra-ui/react"
import useTriggerNetworkChange from "hooks/useTriggerNetworkChange"
import { CHAIN_CONFIG, Chains, supportedChains } from "wagmiConfig/chains"
import NetworkButton from "./NetworkButton"

type Props = {
  networkChangeCallback?: () => void
}

const NetworkButtonsList = ({ networkChangeCallback }: Props): JSX.Element => {
  const { requestNetworkChange } = useTriggerNetworkChange()

  return (
    <SimpleGrid
      columns={{ md: 2, lg: 3 }}
      spacing={{ base: 3, md: "18px" }}
      w="full"
    >
      <>
        {supportedChains
          .filter((chain) => !CHAIN_CONFIG[chain].deprecated)
          .map((chain) => (
            <NetworkButton
              key={chain}
              chain={chain}
              requestNetworkChange={() =>
                requestNetworkChange(Chains[chain], networkChangeCallback)
              }
            />
          ))}

        {supportedChains
          .filter((chain) => CHAIN_CONFIG[chain].deprecated)
          .map((chain) => (
            <NetworkButton
              key={chain}
              chain={chain}
              requestNetworkChange={() => {}}
            />
          ))}
      </>
    </SimpleGrid>
  )
}

export default NetworkButtonsList
