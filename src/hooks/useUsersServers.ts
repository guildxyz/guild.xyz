import { fetcherWithDCAuth } from "components/[guild]/RolesByPlatform/components/JoinButton/components/JoinModal/hooks/useDCAuth"
import useSWR from "swr"
import { DiscordServerData } from "types"
import fetcher from "utils/fetcher"

const fetchUsersServers = async (
  _,
  authToken: string,
  shouldFilterServersWithGuild: boolean
) => {
  const servers = await fetcherWithDCAuth(
    authToken,
    "https://discord.com/api/users/@me/guilds"
  ).then((res: DiscordServerData[]) => {
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
  })

  if (!shouldFilterServersWithGuild) return servers

  return Promise.all(
    servers.map(({ value }) =>
      fetcher(`/guild/platformId/${value}`)
        .then(() => [value, true])
        .catch(() => [value, false])
    )
  ).then((data) => {
    const hasGuild = Object.fromEntries(data)
    return servers.filter(({ value }) => !hasGuild[value])
  })
}

const useUsersServers = (
  authToken: string,
  shouldFilterServersWithGuild = false
) => {
  const { data: servers, ...rest } = useSWR(
    authToken ? ["usersServers", authToken, shouldFilterServersWithGuild] : null,
    fetchUsersServers
  )
  return { servers, ...rest }
}

export default useUsersServers
