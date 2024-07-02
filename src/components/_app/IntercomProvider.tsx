import useConnectorNameAndIcon from "@/components/Web3ConnectionManager/hooks/useConnectorNameAndIcon"
import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import useUser from "components/[guild]/hooks/useUser"
import { useYourGuilds } from "components/explorer/YourGuilds"
import { PropsWithChildren, useEffect, useRef, useState } from "react"
import { Intercom, LiveChatLoaderProvider, useChat } from "react-live-chat-loader"
import { addIntercomSettings } from "utils/intercom"

const IntercomProvider = ({ children }: PropsWithChildren<unknown>) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const _window = typeof window === "undefined" ? ({} as Window) : window

  /** Calling "update" here to make sure we save the user data to Intercom */
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
    ref.current?.click()
    setHasClicked(false)
  }, [hasClicked, state])

  const onClick = () => {
    if (!window.Intercom) {
      setHasClicked(true)
      loadChat({ open: false })
    }
  }

  return <div ref={ref} onClick={onClick} {...props} />
}

export default IntercomProvider
export { IntercomTrigger }
