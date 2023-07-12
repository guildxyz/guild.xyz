import { useWeb3React } from "@web3-react/core"
import processConnectorError from "components/[guild]/JoinModal/utils/processConnectorError"
import useGuild from "components/[guild]/hooks/useGuild"
import useJsConfetti from "components/create-guild/hooks/useJsConfetti"
import useMatchMutate from "hooks/useMatchMutate"
import { mutateOptionalAuthSWRKey } from "hooks/useSWRWithOptionalAuth"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import { useToastWithTweetButton } from "hooks/useToast"
import { useSWRConfig } from "swr"
import { Role } from "types"
import fetcher from "utils/fetcher"
import replacer from "utils/guildJsonReplacer"
import preprocessRequirements from "utils/preprocessRequirements"

type RoleOrGuild = Role & { guildId: number }

const useCreateRole = () => {
  const { account } = useWeb3React()

  const { mutate } = useSWRConfig()
  const matchMutate = useMatchMutate()

  const toastWithTweetButton = useToastWithTweetButton()
  const showErrorToast = useShowErrorToast()
  const triggerConfetti = useJsConfetti()
  const { id, urlName, mutateGuild } = useGuild()

  const fetchData = async (
    signedValidation: SignedValdation
  ): Promise<RoleOrGuild> => fetcher("/role", signedValidation)

  const useSubmitResponse = useSubmitWithSign<RoleOrGuild>(fetchData, {
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
    },
  })

  return {
    ...useSubmitResponse,
    onSubmit: (data) => {
      data.requirements = preprocessRequirements(data?.requirements)

      delete data.roleType

      if (data.logic !== "ANY_OF") delete data.anyOfNum

      return useSubmitResponse.onSubmit(JSON.parse(JSON.stringify(data, replacer)))
    },
  }
}

export default useCreateRole
