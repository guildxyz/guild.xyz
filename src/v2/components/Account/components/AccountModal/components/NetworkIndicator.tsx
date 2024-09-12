import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { Button } from "@/components/ui/Button"
import { useDisclosure } from "@/hooks/useDisclosure"
import { LinkBreak } from "@phosphor-icons/react/dist/ssr"
import { useAccount } from "wagmi"
import { CHAIN_CONFIG, Chains } from "wagmiConfig/chains"
import NetworkModal from "../../NetworkModal"

export const NetworkIndicator = () => {
  const { type } = useWeb3ConnectionManager()
  const { chainId } = useAccount()

  const {
    isOpen: isNetworkModalOpen,
    onOpen: openNetworkModal,
    onClose: closeNetworkModal,
  } = useDisclosure()

  return (
    <>
      {type === "EVM" ? (
        <Button
          variant="ghost"
          onClick={() => openNetworkModal()}
          size="xs"
          className="-my-0.5 w-6 px-0"
        >
          {CHAIN_CONFIG[Chains[chainId]] ? (
            <img
              src={CHAIN_CONFIG[Chains[chainId]].iconUrl}
              alt={CHAIN_CONFIG[Chains[chainId]].name}
              className="size-4"
            />
          ) : (
            <LinkBreak weight="bold" />
          )}
        </Button>
      ) : (
        <img src="/walletLogos/fuel.svg" alt="Fuel" className="size-4" />
      )}
      <NetworkModal isOpen={isNetworkModalOpen} onClose={closeNetworkModal} />
    </>
  )
}
