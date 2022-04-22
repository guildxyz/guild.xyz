import { fetcherWithDCAuth } from "components/[guild]/RolesByPlatform/components/JoinButton/components/JoinModal/hooks/useDCAuth"
import useSWR from "swr"
import { DiscordServerData } from "types"

const fetchUsersServers = (_, authToken: string) =>
  fetcherWithDCAuth(authToken, "https://discord.com/api/users/@me/guilds").then(
    (res: DiscordServerData[]) => {
      if (!Array.isArray(res)) return []
      return res
        .filter(
          ({ owner, permissions }) => owner || (permissions & (1 << 3)) === 1 << 3
        )
        .map(({ id, icon, name }) => ({
          img: icon
            ? `https://cdn.discordapp.com/icons/${id}/${icon}.png`
            : "./default_discord_icon.png",
          label: name,
          value: id,
        }))
    }
  )

const useUsersServers = (authToken: string) => {
  const { data: servers, ...rest } = useSWR(
    authToken ? ["usersServers", authToken] : null,
    fetchUsersServers
  )
  return { servers, ...rest }
}

export default useUsersServers
