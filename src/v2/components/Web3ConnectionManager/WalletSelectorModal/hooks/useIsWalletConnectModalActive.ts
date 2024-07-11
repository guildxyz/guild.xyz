import { useEffect, useRef, useState } from "react"

const useIsWalletConnectModalActive = () => {
  const [isWalletConnectModalActive, setIsWalletConnectModalActive] = useState(false)

  const w3mModalRef = useRef(null)
  useEffect(() => {
    if (typeof window === "undefined" || w3mModalRef.current) return
    w3mModalRef.current = document.querySelector("wcm-modal")
  })

  useEffect(() => {
    if (!w3mModalRef.current) return

    const observerTarget =
      w3mModalRef.current.shadowRoot?.getElementById("wcm-modal")

    if (!observerTarget) return

    const mutationCallback: MutationCallback = (mutations, _) => {
      const classNameChange = mutations.find(
        (mutation) => mutation.attributeName === "class"
      )
      if (!classNameChange) return
      const classNameChangeTarget = classNameChange.target as HTMLElement
      const isW3mModalActive = classNameChangeTarget.classList.contains("wcm-active")

      setIsWalletConnectModalActive(isW3mModalActive)
    }

    const observer = new MutationObserver(mutationCallback)

    observer.observe(observerTarget, {
      attributes: true,
    })

    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [w3mModalRef.current])

  return isWalletConnectModalActive
}

export default useIsWalletConnectModalActive
