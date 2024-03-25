import { Box } from "@chakra-ui/react"
import useUser from "components/[guild]/hooks/useUser"
import { useYourGuilds } from "components/explorer/YourGuilds"
import { PropsWithChildren, useEffect, useRef, useState } from "react"
import { Intercom, LiveChatLoaderProvider, useChat } from "react-live-chat-loader"
import useConnectorNameAndIcon from "./Web3ConnectionManager/hooks/useConnectorNameAndIcon"
import useWeb3ConnectionManager from "./Web3ConnectionManager/hooks/useWeb3ConnectionManager"

const IntercomProvider = ({ children }: PropsWithChildren<unknown>) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const _window = typeof window === "undefined" ? ({} as Window) : window

  /**
   * We can store settings in window.intercomSettings using the addIntercomSettings
   * function even before the chat widget loads, so we need to make sure that these
   * settings are actually saved to Intercom
   */
  useEffect(() => {
    if (!_window.Intercom) return
    _window.Intercom?.("update", window.intercomSettings)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_window.Intercom])

  useIntercomSettingSetup()

  return (
    <LiveChatLoaderProvider providerKey="vo3n8mii" provider="intercom">
      {children}
      <Intercom color="#27272A" />
    </LiveChatLoaderProvider>
  )
}

const useIntercomSettingSetup = () => {
  const { address, isWeb3Connected, type: walletType } = useWeb3ConnectionManager()
  const { connectorName } = useConnectorNameAndIcon()
  const user = useUser()
  const { data: yourGuilds } = useYourGuilds()

  useEffect(() => {
    if (!isWeb3Connected) return

    addIntercomSettings({
      address: address?.toLowerCase(),
      walletType,
      wallet: connectorName,
      userId: null,
      connectedPlatforms: null,
      managedGuilds: null,
    })

    if (!user || !yourGuilds) return

    const connectedPlatforms = user.platformUsers
      ?.map((pu) => pu.platformName)
      .join(", ")

    const managedGuilds = yourGuilds.filter((guild) => guild.isAdmin)

    addIntercomSettings({
      userId: user.id,
      connectedPlatforms,
      isAdmin: managedGuilds.length > 0,
      managedGuilds: managedGuilds.map((guild) => guild.urlName).join(", "),
      biggestGuild: managedGuilds.sort(
        (guild1, guild2) => guild2.memberCount - guild1.memberCount
      )[0]?.memberCount,
    })
  }, [address, isWeb3Connected, connectorName, walletType, user, yourGuilds])
}

type IntercomTriggerProps = {
  "data-intercom-selector": string
}

const IntercomTrigger = (props: PropsWithChildren<IntercomTriggerProps>) => {
  const ref = useRef<HTMLDivElement>(null)
  const [hasClicked, setHasClicked] = useState(false)
  const [state, loadChat] = useChat()

  useEffect(() => {
    if (!hasClicked || state !== "complete") return
    ref.current?.click?.()
    setHasClicked(false)
  }, [hasClicked, state])

  const onClick = () => {
    if (!window.Intercom) {
      setHasClicked(true)
      loadChat({ open: false })
    }
  }

  return <Box ref={ref} onClick={onClick} {...props} />
}

const triggerChat = () => {
  if (typeof window === "undefined") return

  if (window.Intercom) {
    window.Intercom?.("show")
    return
  }

  const facade: HTMLButtonElement = document.querySelector(
    ".live-chat-loader-placeholder [role='button']"
  )
  facade?.click()
}

const addIntercomSettings = (newData: Window["intercomSettings"]) => {
  if (typeof window === "undefined" || !newData) return

  if (!window.intercomSettings) window.intercomSettings = {}

  const shouldUpdate = Object.entries(newData).some(
    ([key, value]) => window.intercomSettings[key] !== value
  )

  if (!shouldUpdate) return

  window.intercomSettings = {
    ...window.intercomSettings,
    ...newData,
  }

  // In case Intercom is loaded, we update the setting
  window.Intercom?.("update", window.intercomSettings)
}

const pushToIntercomSetting = (settingName: string, value: string) => {
  if (typeof window === "undefined") return

  if (!window.intercomSettings) window.intercomSettings = {}

  if (window.intercomSettings[settingName]?.toString().length)
    window.intercomSettings[settingName] += `,${value}`
  else window.intercomSettings[settingName] = value

  // In case Intercom is loaded, we update the setting
  window.Intercom?.("update", window.intercomSettings)
}

declare global {
  interface Window {
    intercomSettings?: Record<string, string | number | boolean>
    Intercom?: (
      action: "show" | "update",
      intercomSettings?: Window["intercomSettings"]
    ) => void
  }
}

export default IntercomProvider
export { IntercomTrigger, addIntercomSettings, pushToIntercomSetting, triggerChat }
