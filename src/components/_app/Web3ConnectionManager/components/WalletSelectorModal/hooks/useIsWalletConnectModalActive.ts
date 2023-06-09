import { useEffect, useRef, useState } from "react"

const useIsWalletConnectModalActive = () => {
  const [isWalletConnectModalActive, setIsWalletConnectModalActive] = useState(false)

  const w3mModalRef = useRef(null)
  useEffect(() => {
    if (typeof window === "undefined" || w3mModalRef.current) return
    w3mModalRef.current = document.querySelector("w3m-modal")
  })

  useEffect(() => {
    if (!w3mModalRef.current) return

    const observerTarget =
      w3mModalRef.current.shadowRoot?.getElementById("w3m-modal")

    if (!observerTarget) return

    const mutationCallback: MutationCallback = (mutations, _) => {
      const classNameChange = mutations.find(
        (mutation) => mutation.attributeName === "class"
      )
      if (!classNameChange) return
      const classNameChangeTarget = classNameChange.target as HTMLElement
      const isW3mModalActive = classNameChangeTarget.classList.contains("w3m-active")

      setIsWalletConnectModalActive(isW3mModalActive)
    }

    const observer = new MutationObserver(mutationCallback)

    observer.observe(observerTarget, {
      attributes: true,
    })

    return () => observer.disconnect()
  }, [w3mModalRef.current])

  return isWalletConnectModalActive
}

export default useIsWalletConnectModalActive
