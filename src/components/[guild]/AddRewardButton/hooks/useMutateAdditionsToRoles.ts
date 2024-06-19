import useGuild from "components/[guild]/hooks/useGuild"
import { mutateGuildsCache } from "components/create-guild/hooks/useCreateRole"
import { useYourGuilds } from "components/explorer/YourGuilds"
import useMatchMutate from "hooks/useMatchMutate"
import { unstable_serialize, useSWRConfig } from "swr"
import { GuildBase, Requirement, RolePlatform } from "types"

const groupRequirementsByRoleId = (
  roleIds: number[],
  requirements: Requirement[]
): { [roleId: number]: Requirement[] } =>
  roleIds.reduce((acc, roleId) => {
    acc[roleId] = requirements.filter((req) => req.roleId === roleId)
    return acc
  }, {})

const groupRolePlatformsByRoleId = (
  roleIds: number[],
  rolePlatforms: RolePlatform[]
): { [roleId: number]: RolePlatform[] } =>
  roleIds.reduce((acc, roleId) => {
    acc[roleId] = rolePlatforms.filter((rp) => rp.roleId === roleId)
    return acc
  }, {})

const useMutateAdditionsToRoles = () => {
  const { mutate: mutateYourGuilds } = useYourGuilds()
  const matchMutate = useMatchMutate()
  const { mutateGuild, id: guildId } = useGuild()
  const { mutate } = useSWRConfig()

  const mutateRequirements = (roleIds: number[], createdRequirements) => {
    const createdRequirementsByRoleId = groupRequirementsByRoleId(
      roleIds,
      createdRequirements
    )

    roleIds.forEach((roleId) => {
      const createdRequirementsOnRole = createdRequirementsByRoleId[roleId]
      const reqIdsToDelete = createdRequirementsOnRole
        .filter((req: any) => !!req.deletedRequirements)
        .flatMap((req: any) => req.deletedRequirements)

      mutate(
        unstable_serialize([
          `/v2/guilds/${guildId}/roles/${roleId}/requirements`,
          { method: "GET", body: {} },
        ]),
        (prevRequirements) => [
          ...prevRequirements.filter((req) => !reqIdsToDelete.includes(req.id)),
          ...createdRequirementsOnRole,
        ],
        { revalidate: false }
      )
    })
  }

  const mutateAdditionsInGuild = (
    roleIds: number[],
    createdRequirements: Requirement[],
    createdRolePlatforms: RolePlatform[]
  ) => {
    const createdRequirementsByRoleId = groupRequirementsByRoleId(
      roleIds,
      createdRequirements
    )
    const createdRolePlatformsByRoleId = groupRolePlatformsByRoleId(
      roleIds,
      createdRolePlatforms
    )

    mutateGuild(
      (prev) => {
        // Create a deep copy of previous roles
        const prevRoles = prev.roles.map((role) => ({ ...role }))

        // Update the roles with the new requirements and role platforms
        const updatedRoles = prevRoles.map((role) => {
          if (!roleIds.includes(role.id)) return role

          const createdRolePlatformsOnRole = createdRolePlatformsByRoleId[role.id]
          const createdRequirementsOnRole = createdRequirementsByRoleId[role.id]
          const reqIdsToDelete = createdRequirementsOnRole
            .filter((req: any) => !!req.deletedRequirements)
            .flatMap((req: any) => req.deletedRequirements)

          return {
            ...role,
            requirements: [
              ...role.requirements.filter((req) => !reqIdsToDelete.includes(req.id)),
              ...createdRequirementsOnRole,
            ],
            rolePlatforms: [...role.rolePlatforms, ...createdRolePlatformsOnRole],
          }
        })

        // Return the updated data
        return {
          ...prev,
          roles: updatedRoles,
        }
      },
      { revalidate: false }
    )
  }

  const mutateAdditionsToRoles = (
    roleIds: number[],
    createdRequirements: Requirement[],
    createdRolePlatforms: RolePlatform[]
  ) => {
    mutateYourGuilds((prev) => mutateGuildsCache(prev, guildId), {
      revalidate: false,
    })
    matchMutate<GuildBase[]>(
      /\/guilds\?order/,
      (prev) => mutateGuildsCache(prev, guildId),
      { revalidate: false }
    )

    mutateRequirements(roleIds, createdRequirements)
    mutateAdditionsInGuild(roleIds, createdRequirements, createdRolePlatforms)
  }

  return mutateAdditionsToRoles
}

export default useMutateAdditionsToRoles
