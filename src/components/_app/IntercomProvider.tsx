import { useWeb3React } from "@web3-react/core"
import useMemberships from "components/explorer/hooks/useMemberships"
import useUser from "components/[guild]/hooks/useUser"
import { createContext, PropsWithChildren, useContext, useEffect } from "react"
import useSWRImmutable from "swr/immutable"
import { GuildBase } from "types"

const IntercomContext = createContext<{
  intercomSettings: Record<string, string | number>
  addIntercomSettings: (newData: Record<string, string | number>) => void
  triggerChat: () => void
}>({
  intercomSettings: undefined,
  addIntercomSettings: () => {},
  triggerChat: () => {},
})

const IntercomProvider = ({ children }: PropsWithChildren<unknown>): JSX.Element => {
  let intercomSettings: Record<string, any> = {}

  const addIntercomSettings = (newData: Record<string, string | number>) => {
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

    intercomSettings = { ...windowAsObject.intercomSettings }

    windowAsObject.Intercom?.("update", windowAsObject.intercomSettings)
  }

  const triggerChat = () => {
    if (typeof window === "undefined") return
    const windowAsObject = window as Record<string, any>

    windowAsObject.Intercom?.("show")
  }

  const { account } = useWeb3React()
  const user = useUser()

  // Using `?order=members`, so if the user already visitet the explorer page, we won't refetch the guilds, just use the ones from the SWR cache
  const { data: guilds } = useSWRImmutable<GuildBase[]>("/guild?order=members")
  const memberships = useMemberships()

  useEffect(() => {
    if (!account || !user || !guilds || !memberships) return

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
  }, [account, user, guilds, memberships])

  return (
    <IntercomContext.Provider
      value={{ intercomSettings, addIntercomSettings, triggerChat }}
    >
      {children}
    </IntercomContext.Provider>
  )
}

const useIntercom = () => useContext(IntercomContext)

export default IntercomProvider
export { useIntercom }
