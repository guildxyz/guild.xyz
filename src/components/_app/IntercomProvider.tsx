import useUser from "components/[guild]/hooks/useUser"
import { useYourGuilds } from "components/explorer/YourGuilds"
import { createContext, PropsWithChildren, useContext, useEffect } from "react"
import useConnectorNameAndIcon from "./Web3ConnectionManager/hooks/useConnectorNameAndIcon"
import useWeb3ConnectionManager from "./Web3ConnectionManager/hooks/useWeb3ConnectionManager"

const IntercomContext = createContext<{
  addIntercomSettings: (newData: Record<string, string | number>) => void
  triggerChat: () => void
}>({
  addIntercomSettings: () => {},
  triggerChat: () => {},
})

export const addIntercomSettings = (
  newData: Record<string, string | number | boolean>
) => {
  if (typeof window === "undefined" || !newData) return
  const windowAsObject = window as Record<string, any>

  if (!windowAsObject.intercomSettings) windowAsObject.intercomSettings = {}

  const shouldUpdate = Object.entries(newData).some(
    ([key, value]) => windowAsObject.intercomSettings[key] !== value
  )

  if (!shouldUpdate) return

  windowAsObject.intercomSettings = {
    ...windowAsObject.intercomSettings,
    ...newData,
  }

  windowAsObject.Intercom?.("update", windowAsObject.intercomSettings)
}

export const pushToIntercomSetting = (settingName: string, value: string) => {
  if (typeof window === "undefined") return
  const windowAsObject = window as Record<string, any>

  if (!windowAsObject.intercomSettings) windowAsObject.intercomSettings = {}

  if (windowAsObject.intercomSettings[settingName]?.length)
    windowAsObject.intercomSettings[settingName] += `,${value}`
  else windowAsObject.intercomSettings[settingName] = value

  windowAsObject.Intercom?.("update", windowAsObject.intercomSettings)
}

const triggerChat = () => {
  if (typeof window === "undefined") return
  const windowAsObject = window as Record<string, any>

  windowAsObject.Intercom?.("show")
}

const IntercomProvider = ({ children }: PropsWithChildren<unknown>): JSX.Element => {
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
  }, [address, isWeb3Connected, user, yourGuilds])

  return (
    <IntercomContext.Provider
      value={{
        addIntercomSettings,
        triggerChat,
      }}
    >
      {children}
    </IntercomContext.Provider>
  )
}

const useIntercom = () => useContext(IntercomContext)

export default IntercomProvider
export { useIntercom }
