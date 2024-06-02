import useGuild from "components/[guild]/hooks/useGuild"

const useGuildPlatform = (guildPlatformId: number) => {
  const { guildPlatforms, isLoading, error } = useGuild()
  const guildPlatform = guildPlatforms.find((gp) => gp.id === guildPlatformId)

  const notFoundError = !guildPlatform
    ? new Error(`GuildPlatform with the following ID not found: ${guildPlatformId}`)
    : null

  return { guildPlatform, isLoading, error: error || notFoundError }
}

export default useGuildPlatform
