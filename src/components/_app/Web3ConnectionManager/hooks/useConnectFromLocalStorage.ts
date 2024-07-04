import { useToast } from "@/components/ui/hooks/useToast"
import { useConnect } from "components/[guild]/JoinModal/hooks/useConnectPlatform"
import { Message } from "components/[guild]/JoinModal/hooks/useOauthPopupWindow"
import useUser, { useUserPublic } from "components/[guild]/hooks/useUser"
import { usePostHogContext } from "components/_app/PostHogProvider"
import rewards from "rewards"
import { useEffect } from "react"

const useConnectFromLocalStorage = () => {
  const { keyPair } = useUserPublic()
  const { captureEvent } = usePostHogContext()
  const { toast } = useToast()
  const { onSubmit } = useConnect(
    {
      onSuccess: () => {
        toast({
          variant: "success",
          title: "Success",
          description: "Platform connected",
        })
      },
    },
    true
  )
  const { platformUsers } = useUser()

  useEffect(() => {
    if (!keyPair || !platformUsers) return

    Object.keys(rewards).forEach((platformName) => {
      const storageKey = `${platformName}_shouldConnect`
      const strData = window.localStorage.getItem(storageKey)
      window.localStorage.removeItem(storageKey)

      const isAlreadyConnected = platformUsers.some(
        (platformUser) => platformUser.platformName === platformName
      )
      if (isAlreadyConnected) return

      if (strData) {
        const data: Message = JSON.parse(strData)

        if (data.type === "OAUTH_SUCCESS") {
          onSubmit({ platformName, authData: data.data })
        } else {
          toast({
            variant: "error",
            title: data.data.error ?? "Error",
            description:
              data.data.errorDescription || `Failed to connect ${platformName}`,
          })
          captureEvent("OAuth error from localStorage data", { data: data.data })
        }
      }
    })
  }, [keyPair, platformUsers, onSubmit, toast, captureEvent])
}

export default useConnectFromLocalStorage
