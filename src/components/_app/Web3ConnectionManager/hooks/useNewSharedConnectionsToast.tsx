import useKeyPair from "hooks/useKeyPair"
import { useToastWithButton } from "hooks/useToast"
import { ArrowRight } from "phosphor-react"
import { useEffect } from "react"

const useNewSharedConnectionsToast = (openAccountModal) => {
  const { keyPair } = useKeyPair()
  const toastWithButton = useToastWithButton()

  const onClick = () => {
    openAccountModal()
    setTimeout(() => {
      document.getElementById("sharedConnectionsButton").focus()
    }, 300)
  }

  // TODO: only show when needed, based on BE
  useEffect(() => {
    if (!keyPair) return

    toastWithButton({
      status: "info",
      title: "New privacy settings",
      description:
        "Some guilds could access your connected accounts from now on. See & manage them in account settings!",
      buttonProps: {
        children: "Open account modal",
        onClick,
        rightIcon: <ArrowRight />,
      },
    })
  }, [!!keyPair])
}

export default useNewSharedConnectionsToast
