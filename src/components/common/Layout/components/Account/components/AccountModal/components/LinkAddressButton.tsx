import useUser from "components/[guild]/hooks/useUser"
import { walletSelectorModalAtom } from "components/_app/Web3ConnectionManager/components/WalletSelectorModal"
import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import Button from "components/common/Button"
import { atom, useSetAtom } from "jotai"
import { Plus } from "phosphor-react"

export type AddressLinkParams = {
  userId?: number
  address?: `0x${string}`
}
export const addressLinkParamsAtom = atom<AddressLinkParams>({
  userId: undefined,
  address: undefined,
})

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
