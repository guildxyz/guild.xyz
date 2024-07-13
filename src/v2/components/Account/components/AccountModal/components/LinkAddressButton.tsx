import {
  addressLinkParamsAtom,
  walletSelectorModalAtom,
} from "@/components/Providers/atoms"
import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { Button, ButtonProps } from "@/components/ui/Button"
import { Plus } from "@phosphor-icons/react/Plus"
import useUser from "components/[guild]/hooks/useUser"
import { useSetAtom } from "jotai"

const LinkAddressButton = (props: ButtonProps) => {
  const { id } = useUser()

  const { address, disconnect } = useWeb3ConnectionManager()

  const setAddressLinkParams = useSetAtom(addressLinkParamsAtom)
  const setIsWalletSelectorModalOpen = useSetAtom(walletSelectorModalAtom)

  return (
    <Button
      size="sm"
      variant="secondary"
      onClick={() => {
        setAddressLinkParams({ userId: id, address })
        disconnect()
        setIsWalletSelectorModalOpen(true)
      }}
      loadingText="Check your wallet"
      {...props}
    >
      <Plus className="mr-1.5" weight="bold" />
      Link address
    </Button>
  )
}

export default LinkAddressButton
