import useGuild from "components/[guild]/hooks/useGuild"
import { mutateGuildsCache } from "components/create-guild/hooks/useCreateRole"
import { useYourGuilds } from "components/explorer/YourGuilds"
import useMatchMutate from "hooks/useMatchMutate"
import { GuildBase, Requirement, Role, RolePlatform } from "types"

const useMutateCreatedRole = () => {
  const { mutate: mutateYourGuilds } = useYourGuilds()
  const matchMutate = useMatchMutate()
  const { mutateGuild, id: guildId } = useGuild()

  const mutateCreatedRole = (
    createdRole: Role,
    createdRequirements: Requirement[],
    createdRolePlatforms: RolePlatform[]
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
    mutateGuild(
      (prev) => ({
        ...prev,
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
