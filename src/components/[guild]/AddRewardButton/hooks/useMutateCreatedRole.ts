import useGuild from "components/[guild]/hooks/useGuild"
import { mutateGuildsCache } from "components/create-guild/hooks/useCreateRole"
import { useYourGuilds } from "components/explorer/YourGuilds"
import useMatchMutate from "hooks/useMatchMutate"
import { GuildBase, GuildPlatform, Requirement, Role } from "types"
import { CreateRolePlatformResponse } from "./useCreateRolePlatforms"

const useMutateCreatedRole = () => {
  const { mutate: mutateYourGuilds } = useYourGuilds()
  const matchMutate = useMatchMutate()
  const { mutateGuild, id: guildId } = useGuild()

  const mutateCreatedRole = (
    createdRole: Role,
    createdRequirements: Requirement[],
    createdRolePlatforms: CreateRolePlatformResponse[]
  ) => {
    const completeRole = {
      ...createdRole,
      requirements: createdRequirements,
      rolePlatforms: createdRolePlatforms,
    }

    mutateYourGuilds((prev) => mutateGuildsCache(prev, guildId), {
      revalidate: false,
    })
    matchMutate<GuildBase[]>(
      /\/guilds\?order/,
      (prev) => mutateGuildsCache(prev, guildId),
      { revalidate: false }
    )

    const createdGuildPlatforms = createdRolePlatforms
      .map((rp) => rp.createdGuildPlatform)
      .filter(Boolean)

    mutateGuild(
      (prev) => ({
        ...prev,
        guildPlatforms: [
          ...prev.guildPlatforms,
          ...(createdGuildPlatforms as GuildPlatform[]),
        ],
        roles: prev.roles.some((role) => role.id === createdRole.id)
          ? prev.roles.map((role) =>
              role.id === createdRole.id ? completeRole : role
            )
          : [...prev.roles, completeRole],
      }),
      { revalidate: false }
    )
  }

  return mutateCreatedRole
}

export default useMutateCreatedRole
