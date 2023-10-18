import { useWeb3React } from "@web3-react/core"
import useJsConfetti from "components/create-guild/hooks/useJsConfetti"
import useGroup from "components/[guild]/hooks/useGroup"
import useGuild from "components/[guild]/hooks/useGuild"
import processConnectorError from "components/[guild]/JoinModal/utils/processConnectorError"
import { usePostHogContext } from "components/_app/PostHogProvider"
import useMatchMutate from "hooks/useMatchMutate"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import { mutateOptionalAuthSWRKey } from "hooks/useSWRWithOptionalAuth"
import { useSWRConfig } from "swr"
import { GuildPlatform, PlatformType, Requirement, Role, Visibility } from "types"
import fetcher from "utils/fetcher"
import replacer from "utils/guildJsonReplacer"
import preprocessRequirements from "utils/preprocessRequirements"

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
  const { id, urlName, memberCount, mutateGuild } = useGuild()
  const group = useGroup()

  const { captureEvent } = usePostHogContext()
  const postHogOptions = { guild: urlName, memberCount }

  const { account } = useWeb3React()

  const { mutate } = useSWRConfig()
  const matchMutate = useMatchMutate()

  const showErrorToast = useShowErrorToast()
  const triggerConfetti = useJsConfetti()

  const fetchData = async (
    signedValidation: SignedValdation
  ): Promise<CreateRoleResponse> =>
    fetcher(`/v2/guilds/${id}/roles`, signedValidation)

  const useSubmitResponse = useSubmitWithSign<CreateRoleResponse>(fetchData, {
    onError: (error_) =>
      showErrorToast({
        error: processConnectorError(error_.error) ?? error_.error,
        correlationId: error_.correlationId,
      }),
    onSuccess: async (response_) => {
      if (response_.visibility !== Visibility.PUBLIC) {
        captureEvent(
          `Created role with ${response_.visibility} visibility`,
          postHogOptions
        )
      }

      if (response_.requirements.some((req) => req.type === "PAYMENT")) {
        captureEvent("Created role with PAYMENT requirement", postHogOptions)
      }

      if (
        response_.createdGuildPlatforms?.some(
          (cgp) => cgp.platformId === PlatformType.CONTRACT_CALL
        )
      ) {
        captureEvent("Created NFT reward", {
          ...postHogOptions,
          hook: "useCreateRole",
        })
      }

      triggerConfetti()

      mutateOptionalAuthSWRKey(`/guild/access/${id}/${account}`)
      mutate(`/statusUpdate/guild/${id}`)

      matchMutate(/^\/guild\/address\//)
      matchMutate(/^\/guild\?order/)

      await mutateGuild(async (curr) => ({
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
      data.requirements = preprocessRequirements(data?.requirements)

      delete data.roleType

      if (data.logic !== "ANY_OF") delete data.anyOfNum

      if (group) data.groupId = group.id

      return useSubmitResponse.onSubmit(JSON.parse(JSON.stringify(data, replacer)))
    },
  }
}

export default useCreateRole
