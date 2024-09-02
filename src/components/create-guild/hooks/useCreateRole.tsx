import { usePostHogContext } from "@/components/Providers/PostHogProvider"
import { useYourGuilds } from "@/hooks/useYourGuilds"
import processConnectorError from "components/[guild]/JoinModal/utils/processConnectorError"
import useGuild from "components/[guild]/hooks/useGuild"
import useRoleGroup from "components/[guild]/hooks/useRoleGroup"
import useCustomPosthogEvents from "hooks/useCustomPosthogEvents"
import useMatchMutate from "hooks/useMatchMutate"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import {
  GuildBase,
  GuildPlatform,
  Requirement,
  RequirementCreationPayloadWithTempID,
  Role,
} from "types"
import fetcher from "utils/fetcher"
import replacer from "utils/guildJsonReplacer"
import preprocessRequirement from "utils/preprocessRequirement"

export type RoleToCreate = Omit<
  Role,
  "id" | "members" | "memberCount" | "position" | "requirements"
> & {
  guildId: number
  roleType?: "NEW"
  requirements: RequirementCreationPayloadWithTempID[]
}

type CreateRoleResponse = Role & {
  createdGuildPlatforms?: GuildPlatform[]
  requirements?: Requirement[]
}

const useCreateRole = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (res?: CreateRoleResponse) => void
  onError?: (error: any) => void
} = {}) => {
  const { id, mutateGuild } = useGuild()
  const group = useRoleGroup()

  const { mutate: mutateYourGuilds } = useYourGuilds()
  const matchMutate = useMatchMutate()
  const { rewardCreated } = useCustomPosthogEvents()

  const showErrorToast = useShowErrorToast()

  const { captureEvent } = usePostHogContext()
  const postHogOptions = {
    hook: "useCreateRole",
  }

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
      captureEvent("Failed to create role", { ...postHogOptions, error_ })
      onError?.(error_)
    },
    onSuccess: async (response_) => {
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

      mutateGuild(
        (curr) => ({
          ...curr,
          roles: [...curr.roles, response_],
        }),
        { revalidate: false }
      )

      window.location.hash = `role-${response_.id}`

      onSuccess?.(response_)
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

export const mutateGuildsCache = (prev: GuildBase[], guildId: number) =>
  prev?.map((guild) => {
    if (guild.id !== guildId) return guild
    return {
      ...guild,
      rolesCount: guild.rolesCount + 1,
    }
  })

export default useCreateRole
