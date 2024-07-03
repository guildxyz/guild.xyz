import { walletSelectorModalAtom } from "@/components/Providers/atoms"
import { useSetAtom } from "jotai"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useWeb3ConnectionManager } from "./useWeb3ConnectionManager"

export function useTriggerWalletSelectorModal() {
  const searchParams = useSearchParams()
  const setIsWalletSelectorModalOpen = useSetAtom(walletSelectorModalAtom)
  const { isWeb3Connected } = useWeb3ConnectionManager()

  useEffect(() => {
    if (!isWeb3Connected && searchParams?.get("redirectUrl"))
      setIsWalletSelectorModalOpen(true)
  }, [isWeb3Connected, searchParams, setIsWalletSelectorModalOpen])
}
