import useGuild from "components/[guild]/hooks/useGuild"

const useGuildPlatform = (guildPlatformId: number) => {
  const { guildPlatforms, isLoading, error } = useGuild()
  // @ts-expect-error TODO: fix this error originating from strictNullChecks
  const guildPlatform = guildPlatforms.find((gp) => gp.id === guildPlatformId)

  const notFoundError = !guildPlatform
    ? new Error(`GuildPlatform with the following ID not found: ${guildPlatformId}`)
    : null

  return { guildPlatform, isLoading, error: error || notFoundError }
}

export default useGuildPlatform
