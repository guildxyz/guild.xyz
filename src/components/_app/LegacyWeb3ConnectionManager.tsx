import { walletSelectorModalAtom } from "@/components/Providers/atoms"
import { Web3ConnectionManagerBase } from "@/components/Web3ConnectionManager/Web3ConnectionManager"
import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { useSetAtom } from "jotai"
import { useRouter } from "next/router"
import { useEffect } from "react"

function useLegacyTriggerWalletSelectorModal() {
  const { query } = useRouter()
  const setIsWalletSelectorModalOpen = useSetAtom(walletSelectorModalAtom)
  const { isWeb3Connected } = useWeb3ConnectionManager()

  useEffect(() => {
    if (!isWeb3Connected && query.redirectUrl) setIsWalletSelectorModalOpen(true)
  }, [isWeb3Connected, query, setIsWalletSelectorModalOpen])
}

export function LegacyWeb3ConnectionManager() {
  useLegacyTriggerWalletSelectorModal()
  return <Web3ConnectionManagerBase />
}
