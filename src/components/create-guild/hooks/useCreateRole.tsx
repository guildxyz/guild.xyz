import processConnectorError from "components/[guild]/JoinModal/utils/processConnectorError"
import useGuild from "components/[guild]/hooks/useGuild"
import useRoleGroup from "components/[guild]/hooks/useRoleGroup"
import useJsConfetti from "components/create-guild/hooks/useJsConfetti"
import { useYourGuilds } from "components/explorer/YourGuilds"
import useCustomPosthogEvents from "hooks/useCustomPosthogEvents"
import useMatchMutate from "hooks/useMatchMutate"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import { GuildBase, GuildPlatform, Requirement, Role } from "types"
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

type CreateRoleResponse = Role & {
  createdGuildPlatforms?: GuildPlatform[]
  requirements?: Requirement[]
}

const useCreateRole = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void
  onError?: (error) => void
}) => {
  const { id, mutateGuild } = useGuild()
  const group = useRoleGroup()

  const { mutate: mutateYourGuilds } = useYourGuilds()
  const matchMutate = useMatchMutate()
  const { rewardCreated } = useCustomPosthogEvents()

  const showErrorToast = useShowErrorToast()
  const triggerConfetti = useJsConfetti()

  const fetchData = async (
    signedValidation: SignedValidation
  ): Promise<CreateRoleResponse> =>
    fetcher(`/v2/guilds/${id}/roles`, signedValidation)

  const useSubmitResponse = useSubmitWithSign<CreateRoleResponse>(fetchData, {
    onError: (error_) => {
      showErrorToast({
        error: processConnectorError(error_.error) ?? error_.error,
        correlationId: error_.correlationId,
      })
      onError?.(error_)
    },
    onSuccess: async (response_) => {
      triggerConfetti()

      if (response_?.createdGuildPlatforms?.length > 0) {
        response_.createdGuildPlatforms.forEach((guildPlatform) => {
          rewardCreated(guildPlatform.platformId)
        })
      }

      mutateYourGuilds((prev) => mutateGuildsCache(prev, id), {
        revalidate: false,
      })
      matchMutate<GuildBase[]>(
        /\/guilds\?order/,
        (prev) => mutateGuildsCache(prev, id),
        { revalidate: false }
      )

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

const mutateGuildsCache = (prev: GuildBase[], guildId: number) =>
  prev?.map((guild) => {
    if (guild.id !== guildId) return guild
    return {
      ...guild,
      rolesCount: guild.rolesCount + 1,
    }
  })

export default useCreateRole
