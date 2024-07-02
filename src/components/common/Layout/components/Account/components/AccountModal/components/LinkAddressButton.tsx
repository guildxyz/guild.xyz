import {
  addressLinkParamsAtom,
  walletSelectorModalAtom,
} from "@/components/Providers/Providers"
import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import useUser from "components/[guild]/hooks/useUser"
import Button from "components/common/Button"
import { useSetAtom } from "jotai"
import { Plus } from "phosphor-react"

const LinkAddressButton = (props) => {
  const { id } = useUser()

  const { address, disconnect } = useWeb3ConnectionManager()

  const setAddressLinkParams = useSetAtom(addressLinkParamsAtom)
  const setIsWalletSelectorModalOpen = useSetAtom(walletSelectorModalAtom)

  return (
    <>
      <Button
        leftIcon={<Plus />}
        size="sm"
        onClick={() => {
          setAddressLinkParams({ userId: id, address })
          disconnect()
          setIsWalletSelectorModalOpen(true)
        }}
        loadingText="Check your wallet"
        {...props}
      >
        Link address
      </Button>
    </>
  )
}

export default LinkAddressButton
