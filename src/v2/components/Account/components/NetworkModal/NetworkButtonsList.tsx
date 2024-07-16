import useTriggerNetworkChange from "hooks/useTriggerNetworkChange"
import { CHAIN_CONFIG, Chains, supportedChains } from "wagmiConfig/chains"
import NetworkButton from "./NetworkButton"

type Props = {
  networkChangeCallback?: () => void
}

const NetworkButtonsList = ({ networkChangeCallback }: Props): JSX.Element => {
  const { requestNetworkChange } = useTriggerNetworkChange()

  return (
    <div className="grid gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
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
    </div>
  )
}

export default NetworkButtonsList
