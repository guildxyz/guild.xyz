import useAutoReconnect from "@/hooks/useAutoReconnect"
import { useAtom } from "jotai"
import { useEffect } from "react"
import { walletSelectorModalAtom } from "../Providers/atoms"
import { PlatformMergeErrorAlert } from "./PlatformMergeErrorAlert"
import WalletLinkHelperModal from "./WalletLinkHelperModal"
import WalletSelectorModal from "./WalletSelectorModal"
import useConnectFromLocalStorage from "./hooks/useConnectFromLocalStorage"
import { useTriggerWalletSelectorModal } from "./hooks/useTriggerWalletSelectorModal"

export function Web3ConnectionManagerBase() {
  const [isWalletSelectorModalOpen, setIsWalletSelectorModalOpen] = useAtom(
    walletSelectorModalAtom
  )

  useAutoReconnect()
  useConnectFromLocalStorage()

  return (
    <>
      <WalletSelectorModal
        isOpen={isWalletSelectorModalOpen}
        onOpen={() => setIsWalletSelectorModalOpen(true)}
        onClose={() => setIsWalletSelectorModalOpen(false)}
      />
      <WalletLinkHelperModal />
      <PlatformMergeErrorAlert />
    </>
  )
}

export function Web3ConnectionManager() {
  useTriggerWalletSelectorModal()

  // a11y: WCM misses label from their modal
  useEffect(() => {
    function waitQuerySelector(selector: string): Promise<Element> {
      return new Promise((resolve) => {
        const elem = document.querySelector(selector)
        if (elem) {
          return resolve(elem)
        }
        const observer = new MutationObserver(() => {
          const elem = document.querySelector(selector)
          if (elem) {
            observer.disconnect()
            resolve(elem)
          }
        })
        observer.observe(document.body, {
          childList: true,
          subtree: true,
        })
      })
    }
    waitQuerySelector("wcm-modal").then((element) => {
      element?.shadowRoot
        ?.getElementById("wcm-modal")
        ?.setAttribute("aria-label", "Web3ConnectionManager")
    })
  }, [])

  return <Web3ConnectionManagerBase />
}
