import { PoapDiscordEmbedForm } from "components/[guild]/CreatePoap/components/Distribution/components/SendPoapDiscordEmbed/SendPoapDiscordEmbed"
import useGuild from "components/[guild]/hooks/useGuild"
import processConnectorError from "components/[guild]/JoinModal/utils/processConnectorError"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useFetcherWithSign } from "utils/fetcher"
import { SummonMembersForm } from "../SummonMembers"

const useSendJoin = (type: "JOIN" | "POAP", onSuccess?: () => void) => {
  const { mutateGuild } = useGuild()

  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const fetcerWithSign = useFetcherWithSign()

  const sendJoin = ({
    serverId,
    ...body
  }: SummonMembersForm | PoapDiscordEmbedForm) =>
    fetcerWithSign([
      `/v2/discord/servers/${serverId}/button`,
      {
        method: "POST",
        body,
      },
    ])

  const useSubmitResponse = useSubmit(sendJoin, {
    onError: (error) =>
      showErrorToast({
        error: processConnectorError(error.error) ?? error.error,
        correlationId: error.correlationId,
      }),
    onSuccess: () => {
      toast({
        status: "success",
        title: `${type === "JOIN" ? "Join" : "Claim"} button sent!`,
      })
      mutateGuild()
      onSuccess?.()
    },
  })

  return {
    ...useSubmitResponse,
    onSubmit: (data) =>
      useSubmitResponse.onSubmit({
        ...data,
        isJoinButton: type === "JOIN",
      }),
  }
}

export default useSendJoin
