import useGuild from "components/[guild]/hooks/useGuild"

const useRolePlatformsOfReward = (guildPlatformId: number) => {
  const { roles } = useGuild()

  return (
    roles
      ?.flatMap((role) => role.rolePlatforms)
      ?.filter(
        (rp) =>
          rp?.guildPlatformId === guildPlatformId ||
          rp?.guildPlatform?.id === guildPlatformId
      ) ?? []
  )
}

export default useRolePlatformsOfReward
