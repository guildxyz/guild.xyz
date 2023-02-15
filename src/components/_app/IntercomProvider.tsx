import { useWeb3React } from "@web3-react/core"
import useMemberships from "components/explorer/hooks/useMemberships"
import useUser from "components/[guild]/hooks/useUser"
import { createContext, PropsWithChildren, useContext, useEffect } from "react"
import { useSWRConfig } from "swr"

const IntercomContext = createContext<{
  addIntercomSettings: (newData: Record<string, string | number>) => void
  triggerChat: () => void
}>({
  addIntercomSettings: () => {},
  triggerChat: () => {},
})

export const addIntercomSettings = (newData: Record<string, string | number>) => {
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
  const { account } = useWeb3React()
  const user = useUser()

  const { cache } = useSWRConfig()

  const memberships = useMemberships()

  useEffect(() => {
    if (!cache || !account || !user || !memberships) return

    const guilds = cache.get("/guild?order=members")?.[0] ?? []

    const connectedPlatforms = user.platformUsers
      ?.map((pu) => pu.platformName)
      .join()

    const managedGuildIds = memberships
      .filter((ms) => ms.isAdmin)
      .map((ms) => ms.guildId)
    const managedGuilds = guilds
      .filter((g) => managedGuildIds.includes(g.id))
      .map((g) => g.urlName)
      .toString()

    addIntercomSettings({
      userId: user.id,
      address: account.toLowerCase(),
      connectedPlatforms,
      managedGuilds,
    })
  }, [cache, account, user, memberships])

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
