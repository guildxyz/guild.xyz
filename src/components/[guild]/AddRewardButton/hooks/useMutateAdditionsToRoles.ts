import { Schemas } from "@guildxyz/types"
import useGuild from "components/[guild]/hooks/useGuild"
import { unstable_serialize, useSWRConfig } from "swr"
import { GuildPlatform, Requirement, RolePlatform } from "types"
import { CreateRolePlatformResponse } from "./useCreateRolePlatforms"

const groupRequirementsByRoleId = (
  roleIds: number[],
  requirements: Schemas["RequirementCreateResponse"][]
): { [roleId: number]: Schemas["RequirementCreateResponse"][] } =>
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
        .filter((req) => !!req.deletedRequirements)
        .flatMap((req) => req.deletedRequirements)

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
    createdRequirements: Schemas["RequirementCreateResponse"][],
    // TODO: create a RoleRewardCreateResponse schema in our types package
    createdRolePlatforms: CreateRolePlatformResponse[]
  ) => {
    const createdRequirementsByRoleId = groupRequirementsByRoleId(
      roleIds,
      createdRequirements
    )
    const createdRolePlatformsByRoleId = groupRolePlatformsByRoleId(
      roleIds,
      createdRolePlatforms
    )

    const createdGuildPlatforms = createdRolePlatforms
      .map((rp) => rp.createdGuildPlatform)
      .filter(Boolean)

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
            .filter((req) => !!req.deletedRequirements)
            .flatMap((req) => req.deletedRequirements)

          return {
            ...role,
            requirements: [
              ...role.requirements.filter(
                (req) => !reqIdsToDelete.includes(req.id as number)
              ),
              // TODO: we can remove the Requirement[] cast once we start using the Guild schema from our types package in the useGuild hook
              ...(createdRequirementsOnRole as Requirement[]),
            ],
            rolePlatforms: [...role.rolePlatforms, ...createdRolePlatformsOnRole],
          }
        })

        // Return the updated data
        return {
          ...prev,
          // TODO: we can remove the GuildPlatform[] cast once we start using the Guild schema from our types package in the useGuild hook
          guildPlatforms: [
            ...prev.guildPlatforms,
            ...(createdGuildPlatforms as GuildPlatform[]),
          ],
          roles: updatedRoles,
        }
      },
      { revalidate: false }
    )
  }

  const mutateAdditionsToRoles = (
    roleIds: number[],
    createdRequirements: Schemas["RequirementCreateResponse"][],
    // TODO: create a RoleRewardCreateResponse schema in our types package
    createdRolePlatforms: CreateRolePlatformResponse[]
  ) => {
    mutateRequirements(roleIds, createdRequirements)
    mutateAdditionsInGuild(roleIds, createdRequirements, createdRolePlatforms)
  }

  return mutateAdditionsToRoles
}

export default useMutateAdditionsToRoles
