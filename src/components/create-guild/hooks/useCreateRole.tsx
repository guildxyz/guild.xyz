import { useWeb3React } from "@web3-react/core"
import useJsConfetti from "components/create-guild/hooks/useJsConfetti"
import useGuild from "components/[guild]/hooks/useGuild"
import processConnectorError from "components/[guild]/JoinModal/utils/processConnectorError"
import useIsV2 from "hooks/useIsV2"
import useMatchMutate from "hooks/useMatchMutate"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import { mutateOptionalAuthSWRKey } from "hooks/useSWRWithOptionalAuth"
import { useToastWithTweetButton } from "hooks/useToast"
import { useSWRConfig } from "swr"
import { Role } from "types"
import fetcher from "utils/fetcher"
import replacer from "utils/guildJsonReplacer"
import preprocessRequirements from "utils/preprocessRequirements"

export type RoleToCreate = Role & { guildId: number; roleType?: "NEW" }

const useCreateRole = (onSuccess?: () => void) => {
  const { account } = useWeb3React()

  const { mutate } = useSWRConfig()
  const matchMutate = useMatchMutate()

  const toastWithTweetButton = useToastWithTweetButton()
  const showErrorToast = useShowErrorToast()
  const triggerConfetti = useJsConfetti()
  const { id, urlName, mutateGuild } = useGuild()
  const isV2 = useIsV2()

  const fetchData = async (
    signedValidation: SignedValdation
  ): Promise<RoleToCreate> =>
    fetcher(
      isV2 ? `/v2/guilds/${id}/roles/with-requirements-and-rewards` : "/role",
      signedValidation
    )

  const useSubmitResponse = useSubmitWithSign<RoleToCreate>(fetchData, {
    onError: (error_) => {
      const processedError = processConnectorError(error_)
      showErrorToast(processedError || error_)
    },
    onSuccess: async (response_) => {
      triggerConfetti()

      toastWithTweetButton({
        title: "Role successfully created",
        tweetText: `I've just added a new role to my guild. Check it out, maybe you have access 😉
guild.xyz/${urlName}`,
      })

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

      return useSubmitResponse.onSubmit(JSON.parse(JSON.stringify(data, replacer)))
    },
  }
}

export default useCreateRole
