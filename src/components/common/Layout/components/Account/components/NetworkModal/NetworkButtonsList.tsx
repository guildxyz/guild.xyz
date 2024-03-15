import { SimpleGrid } from "@chakra-ui/react"
import { Chains, supportedChains } from "chains"
import useTriggerNetworkChange from "hooks/useTriggerNetworkChange"
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
      {supportedChains.map((chain) => (
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
