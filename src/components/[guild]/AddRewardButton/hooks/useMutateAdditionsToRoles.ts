import { Requirement } from "@guildxyz/types"
import useGuild from "components/[guild]/hooks/useGuild"
import { useMutateOptionalAuthSWRKey } from "hooks/useSWRWithOptionalAuth"
import {
  Guild,
  GuildPlatform,
  RequirementCreateResponseOutput,
  RolePlatform,
} from "types"
import { CreateRolePlatformResponse } from "./useCreateRolePlatforms"

const groupRequirementsByRoleId = (
  roleIds: number[],
  requirements: RequirementCreateResponseOutput[]
): { [roleId: number]: RequirementCreateResponseOutput[] } =>
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
  const mutateOptionalAuthSWRKey = useMutateOptionalAuthSWRKey()

  const mutateRequirements = (
    roleIds: number[],
    createdRequirements: RequirementCreateResponseOutput[]
  ) => {
    const createdRequirementsByRoleId = groupRequirementsByRoleId(
      roleIds,
      createdRequirements
    )

    roleIds.forEach((roleId) => {
      const createdRequirementsOnRole = createdRequirementsByRoleId[roleId]
      const reqIdsToDelete = createdRequirementsOnRole
        .filter((req) => !!req.deletedRequirements)
        .flatMap((req) => req.deletedRequirements)

      mutateOptionalAuthSWRKey<Requirement[]>(
        `/v2/guilds/${guildId}/roles/${roleId}/requirements`,
        (prevRequirements) => [
          ...prevRequirements?.filter((req) => !reqIdsToDelete.includes(req.id)),
          ...createdRequirementsOnRole,
        ],
        { revalidate: false }
      )
    })
  }

  const mutateAdditionsInGuild = (
    roleIds: number[],
    createdRequirements: RequirementCreateResponseOutput[],
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
              ...role.requirements.filter((req) => !reqIdsToDelete.includes(req.id)),
              ...createdRequirementsOnRole,
            ],
            rolePlatforms: [...role.rolePlatforms, ...createdRolePlatformsOnRole],
          }
        })

        // Return the updated data
        return !!prev
          ? ({
              ...prev,
              // TODO: we can remove the GuildPlatform[] cast once we start using the Guild schema from our types package in the useGuild hook
              guildPlatforms: [
                ...(prev?.guildPlatforms ?? []),
                ...(createdGuildPlatforms as GuildPlatform[]),
              ],
              roles: updatedRoles,
            } satisfies Guild)
          : undefined
      },
      { revalidate: false }
    )
  }

  const mutateAdditionsToRoles = (
    roleIds: number[],
    createdRequirements: RequirementCreateResponseOutput[],
    // TODO: create a RoleRewardCreateResponse schema in our types package
    createdRolePlatforms: CreateRolePlatformResponse[]
  ) => {
    mutateRequirements(roleIds, createdRequirements)
    mutateAdditionsInGuild(roleIds, createdRequirements, createdRolePlatforms)
  }

  return mutateAdditionsToRoles
}

export default useMutateAdditionsToRoles
