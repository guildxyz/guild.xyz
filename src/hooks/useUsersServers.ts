import { fetcherWithDCAuth } from "components/[guild]/RolesByPlatform/components/JoinButton/components/JoinModal/hooks/useDCAuth"
import useSWR from "swr"
import { DiscordServerData } from "types"

const fetchUsersServers = async (_, authorization: string) =>
  fetcherWithDCAuth(authorization, "https://discord.com/api/users/@me/guilds").then(
    (res: DiscordServerData[]) => {
      if (!Array.isArray(res)) return []
      return res
        .filter(
          ({ owner, permissions }) => owner || (permissions & (1 << 3)) === 1 << 3
        )
        .map(({ icon, id, name, owner }) => ({
          img: icon
            ? `https://cdn.discordapp.com/icons/${id}/${icon}.png`
            : "/default_discord_icon.png",
          id,
          name,
          owner,
        }))
    }
  )

const useUsersServers = (authorization: string) => {
  const { data: servers, ...rest } = useSWR(
    authorization ? ["usersServers", authorization] : null,
    fetchUsersServers
  )
  return { servers, ...rest }
}

export default useUsersServers
