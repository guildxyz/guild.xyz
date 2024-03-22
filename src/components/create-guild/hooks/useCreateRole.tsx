import processConnectorError from "components/[guild]/JoinModal/utils/processConnectorError"
import useGuild from "components/[guild]/hooks/useGuild"
import useRoleGroup from "components/[guild]/hooks/useRoleGroup"
import useJsConfetti from "components/create-guild/hooks/useJsConfetti"
import { useYourGuilds } from "components/explorer/YourGuilds"
import useMatchMutate from "hooks/useMatchMutate"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import { GuildPlatform, Requirement, Role } from "types"
import fetcher from "utils/fetcher"
import replacer from "utils/guildJsonReplacer"
import preprocessRequirement from "utils/preprocessRequirement"

export type RoleToCreate = Omit<
  Role,
  "id" | "members" | "memberCount" | "position" | "requirements"
> & {
  guildId: number
  roleType?: "NEW"
  requirements: Omit<Requirement, "id" | "roleId" | "name" | "symbol">[]
}

type CreateRoleResponse = Role & { createdGuildPlatforms?: GuildPlatform[] }

const useCreateRole = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { id, mutateGuild } = useGuild()
  const group = useRoleGroup()

  const matchMutate = useMatchMutate()
  const { mutate: mutateYourGuilds } = useYourGuilds()

  const showErrorToast = useShowErrorToast()
  const triggerConfetti = useJsConfetti()

  const fetchData = async (
    signedValidation: SignedValidation
  ): Promise<CreateRoleResponse> =>
    fetcher(`/v2/guilds/${id}/roles`, signedValidation)

  const useSubmitResponse = useSubmitWithSign<CreateRoleResponse>(fetchData, {
    onError: (error_) =>
      showErrorToast({
        error: processConnectorError(error_.error) ?? error_.error,
        correlationId: error_.correlationId,
      }),
    onSuccess: async (response_) => {
      triggerConfetti()

      mutateYourGuilds(
        (prev) =>
          prev?.map((guild) => {
            if (guild.id !== id) return guild
            return {
              ...guild,
              rolesCount: guild.rolesCount + 1,
            }
          }),
        {
          revalidate: false,
        }
      )

      matchMutate(/^\/guild\?order/)

      mutateGuild((curr) => ({
        ...curr,
        roles: [...curr.roles, response_],
      }))
      window.location.hash = `role-${response_.id}`

      onSuccess?.()
    },
  })

  return {
    ...useSubmitResponse,
    onSubmit: (data: RoleToCreate) => {
      data.requirements = data?.requirements?.map(preprocessRequirement)

      delete data.roleType
      if (data.logic !== "ANY_OF") delete data.anyOfNum

      if (group) data.groupId = group.id

      return useSubmitResponse.onSubmit(JSON.parse(JSON.stringify(data, replacer)))
    },
  }
}

export default useCreateRole
